import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useState } from 'react'
import useAxios from '@/utils/useAxios'

export function NewsCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const axios = useAxios()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      
      // Append form data
      formData.append('title', data.title)
      formData.append('body', data.body)
      if (data.image[0]) {
        formData.append('image', data.image[0])
      }
      const response = await axios.post(
        'http://127.0.0.1:8000/api/support/news/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.status === 201) {
        toast.success('News created successfully!')
        reset()
        navigate('/admin/news') // Redirect to news list
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create news. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>Create New Article</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            disabled={isSubmitting}
            className="mt-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="body">Content</Label>
          <Textarea
            id="body"
            {...register('body', { required: 'Content is required' })}
            disabled={isSubmitting}
            className="mt-2 h-48"
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="image">Featured Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register('image')}
            disabled={isSubmitting}
            className="mt-2"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Creating...' : 'Create Article'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/news')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}