import { useContext, useEffect, useState } from "react";
import useAxios from "@/utils/useAxios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SidebarContext from "@/context/sidebarContext";
import LessonShow from "@/components/courses/coursePage/lessonContent";
import QuizShow from "@/components/courses/coursePage/quizContent";
import AssignmentUploadForm from "@/components/courses/coursePage/assignmentContent";
import FinalExam from "@/components/courses/coursePage/FinalExam";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle,
  BookOpen,
  Folder,
  GraduationCap,
  ChevronDown,
  LayoutGrid
} from "lucide-react";
import StudentResources from "@/components/courses/coursePage/StudentResourses";
import { Helmet } from "react-helmet-async";

const CoursePage = () => {
  const { selectedModule, setSidebarList, setIsModules, setIsLoading1 } = useContext(SidebarContext);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const axios = useAxios();
  const [navbarItem, setNavbarItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const { courseId } = useParams();

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsModules(true);
      setLoading(true);
      setIsLoading1(true);
      try {
        const response = await axios.get(`api/courses/enrolled/${courseId}`);
        setCourseData(response.data);
      } catch (error) {
        toast.error("Something went wrong while fetching course data.");
      } finally {
        setLoading(false);
        setIsLoading1(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  // Handle sidebar structure
  useEffect(() => {
    if (!courseData) return;

    const handleSide = () => {
      const structuredSidebar = {};
      let finalExam = courseData?.completed;

      courseData.modules?.forEach((module) => {
        finalExam = finalExam && module.completed;
        structuredSidebar[module.title] = {
          completed: module.completed,
          items: []
        };

        module.lessons?.forEach((lesson) => {
          structuredSidebar[module.title].items.push({
            itemType: "lesson",
            itemName: lesson.title,
            moduleId: module.id,
            itemId: lesson.id,
            completed: lesson.completed,
          });
        });

        module.quizzes?.forEach((quiz) => {
          structuredSidebar[module.title].items.push({
            itemType: "quiz",
            itemName: quiz.title,
            moduleId: module.id,
            itemId: quiz.id,
          });
        });

        module.assignments?.forEach((assignment) => {
          structuredSidebar[module.title].items.push({
            itemType: "assignment",
            itemName: assignment.title,
            moduleId: module.id,
            itemId: assignment.id,
          });
        });
      });

      if (finalExam) {
        structuredSidebar.finalExam = true;
      }

      setSidebarList(structuredSidebar);
    };

    handleSide();
  }, [courseData]);

  // Handle current item selection
  useEffect(() => {
    if (!selectedModule || !courseData?.modules) return;

    const findCurrentItem = () => {
      if (selectedModule.type === 'final-exam') {
        setNavbarItem(null);
        setCurrentItem('exam');
        return;
      }

      let foundItem = null;
      for (const mod of courseData.modules) {
        if (mod.id === selectedModule?.module) {
          switch (selectedModule?.type) {
            case 'lesson':
              foundItem = mod.lessons?.find(item => item.id === selectedModule.item);
              break;
            case 'quiz':
              foundItem = mod.quizzes?.find(item => item.id === selectedModule.item);
              break;
            case 'assignment':
              foundItem = 1; // Assuming this is intentional
              break;
            default:
              foundItem = null;
          }
          break;
        }
      }

      // Only update if the item has changed
      if (JSON.stringify(foundItem) !== JSON.stringify(currentItem)) {
        setNavbarItem(null);
        setCurrentItem(foundItem);
      }
    };

    findCurrentItem();
  }, [selectedModule, courseData?.modules]); // Specific dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No course data available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Helmet>
        <title>{courseData?courseData?.title:'course'}</title>
      </Helmet>
      {/* Modern Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <GraduationCap className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight">
                  {courseData.title}
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="group flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                asChild
              >
                <Link to={`/course/${courseId}/forum`}>
                  <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  <span>Discussions</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => { setNavbarItem('resources'); setCurrentItem(null) }}
                className="group flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                <span>Resources</span>
              </Button>

              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <LayoutGrid className="h-5 w-5 text-gray-400" />
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex flex-grow">
        <div className="flex-grow p-6">
          {currentItem ? (
            selectedModule?.type === "lesson" ? (
              <LessonShow 
                lesson={currentItem} 
                moduleid={selectedModule?.module} 
                setCourseData={setCourseData} 
              />
            ) : selectedModule?.type === 'quiz' ? (
              <QuizShow quiz={currentItem} />
            ) : selectedModule?.type === "assignment" ? (
              <AssignmentUploadForm assignmentId={selectedModule?.item} />
            ) : selectedModule?.type === 'final-exam' ? (
              <FinalExam courseId={courseId} />
            ) : null
          ) : (
            !navbarItem?(
            <p className="text-center text-lg text-gray-500">
              Select a lesson or quiz from the sidebar.
            </p>
          ):null)}
          {
            navbarItem?(
              navbarItem==='resources'?(
                <StudentResources courseId={courseId}/>
              ):null

            ):null
          }
        </div>
      </div>
    </div>
  );
};

export default CoursePage;