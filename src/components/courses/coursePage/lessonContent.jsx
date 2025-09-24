// LessonShow.jsx
import VideoPlayer from "@/components/modules/lesson/videoPlayer";
import { Button } from "@/components/ui/button";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const LessonShow = ({ lesson, moduleid, setCourseData }) => {
  const axios = useAxios();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (lesson.completed) return;
    
    try {
      setIsCompleting(true);
      await axios.post(`api/student/lesson/completed/${lesson.id}`);
      setCourseData(prev => ({
        ...prev,
        modules: prev.modules.map(module => 
          module.id === moduleid ? {
            ...module,
            lessons: module.lessons.map(l => 
              l.id === lesson.id ? { ...l, completed: true } : l
            )
          } : module
        )
      }));
      toast.success("Lesson marked as completed!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {lesson?.title}
          </h1>
          <Progress value={lesson.progress || 0} className="h-2" />
        </div>

        {/* Video Section */}
        <div className="mb-8">
          <div className="relative group">
          {lesson?.id ? (
              <VideoPlayer lessonId={lesson.id} />
            ) : (
              <div>Loading video...</div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleComplete}
                disabled={lesson.completed || isCompleting}
                className={`font-semibold transition-all relative overflow-hidden ${
                  lesson.completed 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white"
                }`}
              >
                {isCompleting && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
                <div className="flex items-center gap-2 relative">
                  {isCompleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : lesson.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    "Mark as Completed"
                  )}
                </div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
            Lesson Content
          </h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 
                      prose-headings:text-gray-900 prose-a:text-blue-600
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:w-full
                      prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: lesson?.content }} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LessonShow;