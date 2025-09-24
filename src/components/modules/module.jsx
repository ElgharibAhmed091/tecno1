import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { ChevronDown, ChevronUp, Pencil, GripVertical, Plus, BookOpen, ClipboardList, PencilLine, MoreVertical, Video } from "lucide-react";
import { Button } from "../ui/button";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import LessonPopup from "./lesson/lessonContent";
import DelationPopup from "./confirmDeletion";
import ModuleTitleForm from "./moduleTitleForm";
import QuizForm from "./quiz/QuizForm";
import AssignmentPobup from '@/components/modules/assignment/assignmentContent';

export const Module = ({ module, courseId, up, down, ordering, lastOrder, setInitModules,completed }) => {
  const [currentModule, setCurrentModule] = useState(module || { id: null, title: "", lessons: [], quizzes: [], assignments: [] });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePopup, setActivePopup] = useState({ type: null, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile menu
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const axios = useAxios();

  // Sort items (lessons and quizzes only, assignments are separate)
  const sortedItems = useMemo(() => {
    return [...currentModule.lessons, ...currentModule.quizzes]
      .map((item) => ({
        ...item,
        type: item.hasOwnProperty("video") ? "lesson" : "quiz",
      }))
      .sort((a, b) => a.order - b.order);
  }, [currentModule.lessons, currentModule.quizzes]);

  // Update initModules when currentModule changes
  useEffect(() => {
    if (currentModule?.id) {
      setInitModules((prev) => prev.map((m) => (m.id === currentModule.id ? currentModule : m)));
    }
  }, [currentModule, setInitModules]);

  // Handle delete module
  const handleDeleteModule = useCallback(async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`api/module/${module.id}/action`);
      toast.success("Module deleted successfully");
      setInitModules((prev) => prev.filter((m) => m.id !== module.id));
    } catch (error) {
      toast.error(`Oops! Something went wrong: ${error.message}`);
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }, [module.id, axios, setInitModules]);

  // Handle delete item (lesson, quiz, or assignment)
  const handleDeleteItem = useCallback(async (item) => {
    setIsDeleting(true);
    try {
      await axios.delete(`api/module/${item.type}/${item.id}/action`);
      toast.success(`${item.type === "lesson" ? "Lesson" : item.type === "quiz" ? "Quiz" : "Assignment"} deleted successfully`);
      setCurrentModule((prev) => ({
        ...prev,
        lessons: item.type === "lesson" ? prev.lessons.filter((l) => l.id !== item.id) : prev.lessons,
        quizzes: item.type === "quiz" ? prev.quizzes.filter((q) => q.id !== item.id) : prev.quizzes,
        assignments: item.type === "assignment" ? prev.assignments.filter((a) => a.id !== item.id) : prev.assignments,
      }));
    } catch (error) {
      toast.error(`Oops! Something went wrong: ${error.message}`);
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }, [axios]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 border relative">
      <div className="flex flex-wrap items-center justify-between">
        {/* Module title container */}
        <div className="flex items-center gap-x-2 flex-1 min-w-0">
          {ordering ? (
            <div className="flex flex-col items-center space-y-1">
              {module.order > 1 && (
                <button onClick={() => up(module)} className="p-1 hover:bg-gray-200 rounded">
                  <ChevronUp size={18} />
                </button>
              )}
              {module.order < lastOrder && (
                <button onClick={() => down(module)} className="p-1 hover:bg-gray-200 rounded">
                  <ChevronDown size={18} />
                </button>
              )}
            </div>
          ) : (
            <GripVertical className="text-gray-400 cursor-move" size={20} />
          )}
          <h2 className="text-lg font-semibold truncate" title={currentModule?.title}>{currentModule.title}</h2>
        </div>

        {/* Action buttons */}
        <div className="flex gap-x-2 mt-2 sm:mt-0 relative">
          {/* Mobile Menu (Three Dots) */}
          <div className="sm:hidden relative" ref={mobileMenuRef}>
            <Button
             size="sm"
             variant="ghost"
             onClick={() => setShowMobileMenu((prev) => !prev)}
             disabled={completed}
            >
              <MoreVertical size={18} />
            </Button>
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setActivePopup({ type: "lesson", item: null });
                  }}
                >
                  Add Lesson
                </button>
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePopup({ type: "quiz", item: null });
                    }}
                  >
                    Add Quiz
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePopup({ type: "assignment", item: null });
                    }}
                  >
                    Add Assignment
                  </button>
                <button
                  disabled={completed}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowEditPopup(true);
                  }}
                >
                  Edit Module
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  disabled={completed}
                  onClick={() => {
                    setShowMobileMenu(false);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete Module
                </button>
              </div>
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex gap-x-2">
            <div className="relative" ref={dropdownRef}>
              <Button
               size="sm"
               variant="ghost"
               onClick={() => setShowDropdown((prev) => !prev)}
               disabled={completed}
               >

                <Plus size={18} />
              </Button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePopup({ type: "lesson", item: null });
                    }}
                  >
                    Add Lesson
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePopup({ type: "quiz", item: null });
                    }}
                  >
                    Add Quiz
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePopup({ type: "assignment", item: null });
                    }}
                  >
                    Add Assignment
                  </button>
                </div>
              )}
            </div>

            <Button
             size="sm"
             variant="ghost" 
             onClick={() => setShowEditPopup(true)}
             disabled={completed}
            >

              <Pencil size={16} />
            </Button>
            <DelationPopup
              handelClick={handleDeleteModule}
              isDeleting={isDeleting}
              name="Module"
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              disabled={completed}
            />
          </div>

          <Button size="sm" variant="ghost" onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </div>

      {/* Rest of the code remains the same */}
      {isExpanded && (
        <>
          {/* Lessons and Quizzes */}
          <div className="mt-4 space-y-2">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-md bg-gray-100 flex justify-between items-center"
                >
                  <span
                    className="cursor-pointer truncate flex-grow"
                    onClick={() => setActivePopup({ type: item.type, item })}
                  >
                    <div className="flex gap-3 items-center">
                      {item.type === "lesson" ? <BookOpen size={16} /> : <ClipboardList size={16} />}
                      {item.title}
                    </div>
                  </span>
                  <DelationPopup
                    key={item.id}
                    handelClick={() => handleDeleteItem(item)}
                    isDeleting={isDeleting}
                    name={item.type === "lesson" ? "Lesson" : "Quiz"}
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    disabled={completed}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No lessons or quizzes added yet.</p>
            )}
          </div>

          {/* Assignments (separate section) */}
          <div className="mt-4 space-y-2">
            <h3 className="text-md font-semibold">Assignments</h3>
            {currentModule.assignments.length > 0 ? (
              currentModule.assignments.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-md bg-gray-100 flex justify-between items-center"
                >
                  <span
                    className="cursor-pointer truncate flex-grow"
                    onClick={() => setActivePopup({ type: "assignment", item })}
                  >
                    <div className="flex gap-3 items-center">
                      <PencilLine size={16} />
                      {item.title}
                    </div>
                  </span>
                  <DelationPopup
                    key={item.id}
                    handelClick={() => handleDeleteItem({ ...item, type: "assignment" })}
                    isDeleting={isDeleting}
                    name="Assignment"
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No assignments added yet.</p>
            )}
          </div>
        </>
      )}

      {showEditPopup && (
        <ModuleTitleForm
          open={showEditPopup}
          setOpen={setShowEditPopup}
          module={currentModule}
          courseId={courseId}
          setInitModules={setInitModules}
          disabled={completed}
        />
      )}

      {activePopup.type === "lesson" && currentModule?.id && (
        <LessonPopup
          open={activePopup.type === "lesson"}
          setOpen={() => setActivePopup({ type: null, item: null })}
          lesson={activePopup.item}
          order={sortedItems.length}
          module_id={currentModule}
          disabled={completed}
        />
      )}

      {activePopup.type === "assignment" && currentModule?.id && (
        <AssignmentPobup
          open={activePopup.type === "assignment"}
          setOpen={() => setActivePopup({ type: null, item: null })}
          item={activePopup.item}
          module_id={currentModule.id}
          setModule={setCurrentModule}
          disabled={completed}
        />
      )}

      {activePopup.type === "quiz" && currentModule?.id && (
        <QuizForm
          open={activePopup.type === "quiz"}
          setOpen={() => setActivePopup({ type: null, item: null })}
          item={activePopup.item}
          order={sortedItems.length}
          moduleId={currentModule.id}
          setModule={setCurrentModule}
          disabled={completed}
        />
        
      )}
    </div>
  );
};

export default memo(Module);