import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Post from '@/components/forums/Post';
import toast from 'react-hot-toast';
import AuthContext from '@/context/AuthContext';
import useAxios from '@/utils/useAxios';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Helmet } from 'react-helmet-async';

const Forum = () => {
  const { courseId } = useParams();
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const socket = useRef(null);
  const { authTokens } = useContext(AuthContext);
  const axios = useAxios();

  // Optimized post loading with debounce and cancellation
  useEffect(() => {
    const controller = new AbortController();
    let debounceTimer;

    const loadInitialPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/forum/posts/${courseId}`, {
          params: { search: searchQuery },
          signal: controller.signal // Attach abort controller
        });
        setPosts(response.data.results);
        setNextPage(response.data.next);
      } catch (error) {
        if (!axios.isCancel(error)) { // Ignore cancellation errors
          console.error('Error loading posts:', error);
          toast.error('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce mechanism: wait 500ms after last input
    debounceTimer = setTimeout(loadInitialPosts, 500);

    // Cleanup function for effect
    return () => {
      controller.abort(); // Cancel ongoing request
      clearTimeout(debounceTimer); // Clear pending execution
    };
  }, [courseId, searchQuery]); // Re-run when these change

  // WebSocket connection (unchanged from original)
  useEffect(() => {
    const token = authTokens.access;
    socket.current = new WebSocket(
      `ws://127.0.0.1:8001/ws/forum/${courseId}/?token=${token}`
    );

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'post') {
        let post = { user: data.user, id: data.id, content: data.message };
        setPosts(prev => [post, ...prev]);
      }
      else if (data.type === 'reply') {
        let reply = { user: data.user, id: data.id, content: data.message, post: data.post };
        setPosts(prev => prev.map(post => 
          post.id === data.post
            ? { ...post, course_replies: [reply, ...(post.course_replies || [])] }
            : post
        ));
      }
    };

    return () => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, [courseId]);

  // Load more posts (unchanged)
  const loadMorePosts = async () => {
    if (!nextPage) return;
    
    try {
      const response = await axios.get(nextPage);
      setPosts(prev => [...prev, ...response.data.results]);
      setNextPage(response.data.next);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  // Search handler (optimized with useCallback)
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Post submission (unchanged)
  const handleNewPostSubmit = () => {
    if (newPost.trim() && socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        type: 'post',
        message: newPost,
        course_id: courseId
      }));
      setNewPost('');
      setShowNewPost(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <Helmet>
        <title>Forum</title>
      </Helmet>
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full sm:max-w-md"
            disabled={loading} // Disable input during loading
          />
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => setShowNewPost(!showNewPost)}
            variant='outline'
          >
            ask question
          </Button>
        </div>

        {/* New post form (unchanged) */}
        {showNewPost && (
          <Card className="p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Write your question..."
                className="w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleNewPostSubmit()}
              />
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewPost(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNewPostSubmit}
                  className="w-full sm:w-auto"
                  variant='outline'
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Loading and content states */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts found. Be the first to start a discussion!
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post}
              onReply={(message) => {
                if (socket.current?.readyState === WebSocket.OPEN) {
                  socket.current.send(JSON.stringify({
                    type: 'reply',
                    message,
                    post_id: post.id
                  }));
                }
              }}
            />
          ))}

          {nextPage && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={loadMorePosts} 
                className="w-full sm:w-auto"
              >
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Forum;