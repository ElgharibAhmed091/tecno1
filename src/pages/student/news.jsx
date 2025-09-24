import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'

export function Newsection() {
  const [news, setNews] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/support/news/')
        setNews(response.data)
      } catch  {
        toast.error('Failed to load news. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  const filteredNews = news.filter(newsItem => 
    newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    newsItem.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>News</title>
      </Helmet>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search news articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-6 rounded-lg shadow-sm"
        />
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
              <article key={newsItem.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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
              </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}