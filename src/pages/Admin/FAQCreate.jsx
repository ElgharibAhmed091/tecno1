import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Helmet } from 'react-helmet-async'

export function CreateFAQForm() {
  const [submissionStatus, setSubmissionStatus] = useState({ success: false, message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/support/faq/', data)
      if (response.status === 201) {
        setSubmissionStatus({ success: true, message: 'FAQ created successfully!' })
        reset()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create FAQ. Please try again.'
      setSubmissionStatus({ success: false, message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Helmet>
        <title>FAQ</title>
      </Helmet>
      <h2 className="text-3xl font-bold mb-8 text-center">Create New FAQ</h2>
      
      {submissionStatus.message && (
        <Alert variant={submissionStatus.success ? "default" : "destructive"} className="mb-6">
          <AlertTitle>{submissionStatus.success ? 'Success!' : 'Error'}</AlertTitle>
          <AlertDescription>{submissionStatus.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              {...register('question', { required: 'Question is required' })}
              className="mt-1"
              disabled={isSubmitting}
            />
            {errors.question && (
              <p className="text-sm text-red-500 mt-1">{errors.question.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              {...register('answer', { required: 'Answer is required' })}
              className="mt-1 min-h-[120px]"
              disabled={isSubmitting}
            />
            {errors.answer && (
              <p className="text-sm text-red-500 mt-1">{errors.answer.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create FAQ'}
          </Button>
        </div>
      </form>
    </div>
  )
}