// NewsSection.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import useAxios from '@/utils/useAxios'

export function AdminNewsection() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const axios=useAxios()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/support/news/')
        setNews(response.data)
      } catch  {
        toast.error('Failed to load news. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/support/news/delete/${id}/`)
      setNews(news.filter(item => item.id !== id))
      toast.success('News deleted successfully')
    } catch {
      toast.error('Failed to delete news. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const filteredNews = news.filter(newsItem => 
    newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    newsItem.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>News</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search news articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-6 rounded-lg shadow-sm"
        />
        <Button 
          onClick={() => navigate('/admin/News/create')}
          className="whitespace-nowrap"
        >
          Create New Article
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredNews.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No news articles found matching your search.
            </div>
          ) : (
            filteredNews.map((newsItem) => (
              <article key={newsItem.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative pb-20">
              {newsItem.image && (
                <img 
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-60 object-contain rounded-lg mb-4"
                />
              )}
              
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 capitalize mb-4">
                {newsItem.title}
              </h2>            
              <p className="text-sm text-gray-500 mb-4">
                Published on {formatDate(newsItem.created_at)}
              </p>
            
              <div className="w-full max-w-full overflow-hidden">
                <div className="prose text-gray-600 max-w-full break-words">
                  <p>{newsItem.body}</p>
                </div>
              </div>
            
              {/* Delete button */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="text-xs">
                      Delete
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{newsItem.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
            
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(newsItem.id)}
                        disabled={deletingId === newsItem.id}
                      >
                        {deletingId === newsItem.id ? 'Deleting...' : 'Confirm Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}