import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ZoomMeetingForm from "@/components/modules/liveClass/zoomForm"
import useAxios from "@/utils/useAxios"
import toast from "react-hot-toast"
import { format, parseISO } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import { Video, Trash2, Mail } from 'lucide-react'
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
import { Label } from "@/components/ui/label"
import { Helmet } from 'react-helmet-async'

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export default function LiveSupport() {
  const axios = useAxios()
  const [meetings, setMeetings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [selectedInviteMeeting, setSelectedInviteMeeting] = useState(null)

  // Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await axios.get('/api/support/live')
        setMeetings(data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load meetings')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMeetings()
  }, [])

  // Handle meeting creation
  const handleSubmit = async (formData) => {
    try {
      const { data } = await axios.post('/api/support/live', formData)
      toast.success('Live support meeting created!')
      setMeetings([...meetings, data])
      return data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Creation failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Handle meeting deletion
  const handleDelete = async (meetingId) => {
    if (!meetingId) return
    
    try {
      setIsDeleting(true)
      await axios.delete(`/api/support/live/details/${meetingId}`)
      setMeetings(prev => prev.filter(m => m.id !== meetingId))
      toast.success('Meeting deleted successfully')
    } catch (error) {
      toast.error('Failed to delete meeting')
    } finally {
      setIsDeleting(false)
      setSelectedMeeting(null)
    }
  }

  // Format duration with leading zero for minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins.toString().padStart(2, '0')}m`
  }

  // Deletion Popup Component
  function DeletionPopup({ meetingId }) {
    return (
      <Dialog 
        open={selectedMeeting === meetingId}
        onOpenChange={(open) => setSelectedMeeting(open ? meetingId : null)}
      >
        <DialogTrigger asChild>
          <button 
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete meeting"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Meeting?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the meeting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedMeeting(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(meetingId)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Invitation Form Component
  function InviteForm({ meetingId }) {
    const { 
      register, 
      handleSubmit, 
      formState: { errors, isSubmitting }, 
      reset 
    } = useForm({
      resolver: zodResolver(inviteSchema)
    })

    const onSubmit = async (data) => {
      try {
        await axios.post('/api/support/live/mail/', {
          email: data.email,
          meeting: meetingId
        })
        toast.success('Invitation sent successfully!')
        reset()
        setSelectedInviteMeeting(null)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send invitation')
      }
    }

    return (
      <Dialog 
        open={selectedInviteMeeting === meetingId}
        onOpenChange={(open) => setSelectedInviteMeeting(open ? meetingId : null)}
      >
      <Helmet>
        <title>Live Support</title>
      </Helmet>
        <DialogTrigger asChild>
          <button 
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            aria-label="Invite to meeting"
          >
            <Mail className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Meeting Invitation</DialogTitle>
            <DialogDescription>
              Enter the recipient's email address to send meeting details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="off"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedInviteMeeting(null)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Sending...' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Create Meeting Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">Schedule Live Support</h1>
        <ZoomMeetingForm onSubmit={handleSubmit} />
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Support Sessions</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {meetings.map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{meeting.topic}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      {format(parseISO(meeting.start_time), 'MMM dd, yyyy - hh:mm a')}
                    </span>
                    <span>•</span>
                    <span>{formatDuration(meeting.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.open(meeting.start_url, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Start
                  </button>

                  <InviteForm meetingId={meeting.id} />
                  <DeletionPopup meetingId={meeting.id} />
                </div>
              </div>
            ))}

            {meetings.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                No upcoming support sessions found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}