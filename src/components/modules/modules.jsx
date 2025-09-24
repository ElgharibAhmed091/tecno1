import { useState, useCallback, useEffect } from "react";
import { Module } from "./module";
import { Button } from "../ui/button";
import { CheckCircle, List, Plus } from "lucide-react";
import ModuleTitleForm from "./moduleTitleForm";
import LiveLesson from "./liveClass/liveLessonContent";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import DelationPopup from "./confirmDeletion";

const ModulesList = ({ initModules, courseId, setInitModules, completed}) => {
  // State for managing modules, live lessons, and UI interactions
  const [modules, setModules] = useState(() =>
    [...initModules].sort((a, b) => a.order - b.order)
  );
  const [liveLessons, setLiveLessons] = useState([]);
  const [showPopup, setShowPopup] = useState(null); // Controls popup visibility
  const [isOrdering, setIsOrdering] = useState(false); // Toggle for reordering mode
  const [isDeleteing, setIsDeleteing] = useState(false); // Deletion in progress
  const [isDeleteingOpen, setIsDeleteingOpen] = useState(false); // Deletion popup state

  const axios = useAxios(); // Custom hook for Axios instance

  const fetchLiveLessons = useCallback(async () => {
    try {
      const response = await axios.get(`api/lesson/live`, {
        params: { course: courseId },
      });
      setLiveLessons(response.data);
    } catch {
      toast.error("Failed to load live lessons");
    }
  }, [courseId, axios]);

  // Sync modules and fetch live lessons when initModules changes
  useEffect(() => {
    setModules([...initModules].sort((a, b) => a.order - b.order));
    fetchLiveLessons();
  }, [initModules, fetchLiveLessons]);

  // Handle deletion of a live lesson
  const handleDeleteLiveLesson = 
    async (lesson) => {
      setIsDeleteing(true);
      try {
        await axios.delete(`api/lesson/live/details/${lesson.id}`);
        toast.success("Live lesson deleted");
        setLiveLessons((prev) => prev.filter((l) => l.id !== lesson.id));
      } catch (error) {
        toast.error(`Failed to delete live lesson: ${error.message}`);
        console.error(error);
      } finally {
        setIsDeleteing(false);
        setIsDeleteingOpen(false);
      }
    }

  // Move a module up in the order
  const moduleUp = (item) => {
    setModules((prevModules) => {
      const updatedModules = prevModules.map((m) =>
        m.id === item.id
          ? { ...m, order: m.order - 1 }
          : m.order === item.order - 1
          ? { ...m, order: m.order + 1 }
          : m
      );
      return [...updatedModules].sort((a, b) => a.order - b.order);
    });
  };

  // Move a module down in the order
  const moduleDown = (item) => {
    setModules((prevModules) => {
      const updatedModules = prevModules.map((m) =>
        m.id === item.id
          ? { ...m, order: m.order + 1 }
          : m.order === item.order + 1
          ? { ...m, order: m.order - 1 }
          : m
      );
      return [...updatedModules].sort((a, b) => a.order - b.order);
    });
  };

  // Save the new module order to the server
  const handleReordering = () => {
    const initialModuleOrders = initModules.reduce((acc, m) => {
      acc[m.id] = m.order;
      return acc;
    }, {});
    const changedOrders = modules.reduce((acc, m) => {
      if (m.order !== initialModuleOrders[m.id]) {
        acc[m.id] = m.order;
      }
      return acc;
    }, {});

    if (Object.keys(changedOrders).length) {
      try {
        axios.put(`api/instructor/courses/${courseId}/reorder`, {
          modules: changedOrders,
        });
        toast.success("Modules order updated");
        setInitModules(modules);
      } catch {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto space-y-8">
      {/* Top Bar - Responsive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Course Content</h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
          <Button
            onClick={() => setShowPopup("module")}
            variant="outline"
            className="w-full md:w-auto justify-center"
            size="sm"
            disabled={completed}
          >
            <Plus className="h-4 w-4 mr-0 md:mr-2" />
            <span className="hidden md:inline">Add Module</span>
          </Button>
        </div>
      </div>

      {/* Modules Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <h2 className="text-xl md:text-2xl font-semibold">Learning Modules</h2>
          {modules.length > 0 && (
            <Button
              className="w-full md:w-auto justify-center"
              variant={isOrdering ? "default" : "outline"}
              size="sm"
              disabled={completed}
              onClick={() => {
                if (isOrdering) handleReordering();
                setIsOrdering(!isOrdering);
              }}
            >
              {isOrdering ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finish Reordering
                </>
              ) : (
                <>
                  <List className="h-4 w-4 mr-2" />
                  Reorder Modules
                </>
              )}
            </Button>
          )}
        </div>

        {/* Module List */}
        <div className="space-y-3">
          {modules.length > 0 ? (
            modules.map((module) => (
              <Module
                key={module.id}
                module={module}
                up={moduleUp}
                down={moduleDown}
                ordering={isOrdering}
                lastOrder={modules.length}
                setInitModules={setInitModules}
                completed={completed}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground italic py-6 rounded-lg border">
              No learning modules created yet
            </div>
          )}
        </div>
      </section>

      {/* Live Sessions Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <h2 className="text-xl md:text-2xl font-semibold">Live Sessions</h2>
          <Button
            variant="outline"
            onClick={() => setShowPopup("live")}
            className="w-full md:w-auto justify-center"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-0 md:mr-2" />
            <span>Schedule Live Session</span>
          </Button>
        </div>

        <div className="space-y-3">
          {liveLessons.length > 0 ? (
            liveLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-medium text-base md:text-lg truncate pr-4">
                    {lesson.topic}
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center gap-1.5 text-sm text-muted-foreground">
                    <span>
                      {moment(lesson.start_time)
                        .tz(moment.tz.guess())
                        .format("MMM Do YYYY, h:mm a")}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span>Duration: {lesson.duration} minutes</span>
                  </div>
                </div>
                <div className="self-stretch md:self-center flex items-center">
                  <DelationPopup
                    handelClick={() => handleDeleteLiveLesson(lesson)}
                    isDeleteDialogOpen={isDeleteingOpen}
                    setIsDeleteDialogOpen={setIsDeleteingOpen}
                    isDeleting={isDeleteing}
                    name="session"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground italic py-6 rounded-lg border">
              No upcoming live sessions scheduled
            </div>
          )}
        </div>
      </section>
      {/* Popups for Adding Content */}
      <ModuleTitleForm
        open={showPopup === "module"}
        setOpen={(state) => setShowPopup(state ? "module" : null)}
        setInitModules={setInitModules}
        order={modules?.length + 1}
        module={null}
        courseId={courseId}
        setModules={setModules}
        disabled={completed}
      />

      <LiveLesson
        open={showPopup === "live"}
        setOpen={setShowPopup}
        courseId={courseId}
        setData={setLiveLessons}
      />
    </div>
  );
};
export default ModulesList;

