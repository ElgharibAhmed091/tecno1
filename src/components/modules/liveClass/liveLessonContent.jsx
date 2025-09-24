import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { memo, useCallback } from "react";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";
import ZoomMeetingForm from "./zoomForm";


const LiveLesson = ({ open, setOpen, courseId, setData }) => {
  const axios = useAxios();

  const handleSubmit = useCallback(async (data) => {
    try {
      let response =await axios.post("api/lesson/live", {
        ...data,
        course: courseId
      });
      toast.success("Live lesson created successfully");
      setData((prev)=>[...prev,response.data])
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create live lesson");
      console.error("Live lesson error:", error);
    }
  }, [courseId, axios, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Live Session</DialogTitle>
          <DialogDescription>
            Create a new live session for your students. All times are in your local timezone.
          </DialogDescription>
        </DialogHeader>
        
        <ZoomMeetingForm 
          onSubmit={handleSubmit}
          defaultValues={{
            topic: "",
            duration: 40,
            date: new Date()
          }}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(LiveLesson);