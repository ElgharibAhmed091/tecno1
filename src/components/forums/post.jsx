import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronDown, Reply, Send} from 'lucide-react';
import { Textarea } from '../ui/textarea';

const Post = ({ post, onReply }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [newReply, setNewReply] = useState('');

  const handleReplySubmit = () => {
    if (newReply.trim()) {
      onReply(newReply);
      setNewReply('');
      setShowReplyInput(false);
    }
  };

  return (
    <Card className="mb-4 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3 sm:gap-4">
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarImage src={post.user.image} />
          <AvatarFallback>{post.user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                {post.user.username}
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 sm:gap-2 group self-end sm:self-auto"
              onClick={() => setExpanded(!expanded)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              <span className="text-blue-600 text-sm">
                {post.course_replies?.length || 0} {post.course_replies?.length === 1 ? 'reply' : 'replies'}
              </span>
            </Button>
          </div>

          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">{post.content}</p>

          {expanded && (
            <div className="mt-4 sm:mt-6 ml-1 sm:ml-12 space-y-4 sm:space-y-6">
              <div className="flex justify-end items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="flex items-center gap-2 self-end sm:w-auto"
                >
                  <Reply className="h-4 w-4" />
                  <span className="hidden sm:inline">Reply</span>
                </Button>
              </div>

              {showReplyInput && (
              <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4 w-full">
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
                />
                <Button 
                  variant="outline"
                  onClick={handleReplySubmit}
                  className="w-auto flex justify-end"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            )}

              {post.course_replies?.map(reply => (
                <div key={reply.id} className="flex gap-3 sm:gap-4">
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                    <AvatarImage src={reply.user.image} />
                    <AvatarFallback>{reply.user.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 mb-1">
                      <h4 className="text-xs sm:text-sm font-semibold">{reply.user.username}</h4>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Post;