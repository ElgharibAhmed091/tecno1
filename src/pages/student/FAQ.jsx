import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'

export function FAQSection() {
  const [faqs, setFaqs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/support/faq/')
        setFaqs(response.data)
      } catch  {
        toast.error('Failed to load FAQs. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )


  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>FAQ</title>
      </Helmet>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-6">FAQ Center</h1>
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-6 rounded-lg shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[100px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No FAQs found matching your search.
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left hover:bg-gray-50 px-4 rounded-lg">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 text-gray-600">
                  {faq.answer}
                  {faq.category && (
                    <div className="mt-3">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      )}
    </div>
  )
}