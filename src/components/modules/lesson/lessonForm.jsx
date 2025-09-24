import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { UploadCloud, Loader2, Video } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./videoPlayer";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  video: z.any().refine((file) => file instanceof File, {
    message: "Please select a valid video file",
  }),
  content: z.string().min(1, { message: "Content is required" }),
});

const LessonForm = ({ lesson, order, module_id, disabled }) => {
  const axios = useAxios();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState();
  const [loadingDuration, setLoadingDuration] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    disabled: disabled,
    defaultValues: {
      title: lesson?.title || "",
      video: lesson?.video || "",
      content: lesson?.content || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
  
    if (file) {
      // Validate file type
      const allowedTypes = ["video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a video.");
        return;
      }

      // Validate file size
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 500MB.");
        return;
      }

      setLoadingDuration(true);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      form.setValue("video", file, { shouldValidate: true });

      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.src = previewUrl;

      tempVideo.onloadedmetadata = () => {
        if (tempVideo.duration === Infinity || tempVideo.duration < 1) {
          tempVideo.currentTime = 9999999;
          tempVideo.ontimeupdate = () => {
            tempVideo.ontimeupdate = null;
            setLoadingDuration(false);
            toast.success(`Video Duration: ${tempVideo.duration.toFixed(2)} seconds`);
            URL.revokeObjectURL(previewUrl);

          };
        } else {
          setLoadingDuration(false);
          toast.success(`Video Duration: ${tempVideo.duration.toFixed(2)} seconds`);
        }
      };

      tempVideo.onerror = () => {
        setLoadingDuration(false);
        toast.error("Error loading video metadata.");
      };
    }
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
  
      // Append regular fields
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("order", order);
      formData.append("module", module_id);
  
      // Check if the video file is present before appending it
      if (values.video) {
        formData.append("video", values.video);
      } else {
        // If no video, show an error and stop submission
        toast.error("Video file is required");
        return;
      }
  
      // Check if it's an update or create request
      if (lesson) {
        await axios.patch(`/api/module/lesson/${lesson.id}/`, formData);
      } else {
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }        
        let response = await axios.post('/api/module/lesson/create', formData);
        console.log(response);
      }
  
      toast.success(`Lesson ${lesson ? "updated" : "created"} successfully`);
      navigate(0); // Refresh or navigate to the same page
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error); // Log error for debugging
    }
  };
  
  
  return (
    <div className="border bg-slate-100 rounded-md p-4">
      <h2 className="font-medium">Lesson Details</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4" >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input 
                    disabled={isSubmitting} 
                    placeholder="e.g. 'Advanced Web Development'" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
   <FormField
      control={form.control}
      name="video"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lesson Video</FormLabel>
          {lesson?.video ? (
            <div className="max-w-[500px] mx-auto aspect-video max-h-[400px]">
              <VideoPlayer lessonId={lesson.id} />
            </div>
          ) : preview ? (
            <div className="relative max-w-[500px] mx-auto">
              {loadingDuration ? (
                <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm max-h-[400px] w-full">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={preview}
                    style={{ maxHeight: '400px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ) : (
            <div
              className="max-w-[500px] mx-auto border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer group bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-white group-hover:bg-blue-50 transition-colors shadow-sm">
                  <UploadCloud className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Click to upload video</p>
                  <p className="text-xs text-gray-400 mt-1">MP4 up to 500MB</p>
                </div>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            hidden
          />
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Content</FormLabel>
                <FormControl>
                  <Textarea 
                    disabled={isSubmitting} 
                    placeholder="Enter lesson content here..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting || loadingDuration}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : lesson ? (
                "Update Lesson"
              ) : (
                "Create Lesson"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LessonForm;