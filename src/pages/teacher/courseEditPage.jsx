import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import CourseSetup from "@/components/courses/courseSetup";
import ModulesList from "@/components/modules/modules";
import { Button } from "@/components/ui/button";
import PeopleSection from "@/components/courses/enrolledIn";
import Resources from "@/components/courses/resources";
import { AssignmentsList } from "@/components/courses/assignments";
import { FinalExamEditor } from "@/components/FinalExam/finalexam";
import { Helmet } from "react-helmet-async";

export const EditCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const [activeTab,setActiveTab]=useState(1)
  const [initModules,setInitModules]=useState(null)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/instructor/course/${courseId}/`),
          axios.get("/api/categories/"),
        ]);
        setCourse(courseResponse.data);
        setCategories(categoriesResponse.data);
        setInitModules(courseResponse.data.modules)
      } catch  {
        toast.error("Something went wrong...");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6">
            <Helmet>
              <title>Edit course</title>
            </Helmet>
            <div className="flex justify-center space-x-6 border-b pb-3 flex-wrap">
        <Button size="sm" variant="ghost"
          onClick={() => setActiveTab(1)}
          className={`py-2 px-4 ${activeTab === 1 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Course Setup
        </Button>
        <Button size="sm" variant="ghost"
          onClick={() => setActiveTab(2)}
          className={`py-2 px-4 ${activeTab === 2 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Modules
        </Button>
        <Button size="sm" variant="ghost"
          onClick={() => setActiveTab(3)}
          className={`py-2 px-4 ${activeTab === 3 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Students
        </Button>
        <Button size="sm" variant="ghost"
          onClick={() => setActiveTab(4)}
          className={`py-2 px-4 ${activeTab === 4 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Resourses
        </Button>
        <Button size="sm" variant="ghost"
          onClick={() => setActiveTab(5)}
          className={`py-2 px-4 ${activeTab === 5 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Assignmets
        </Button>
        <Button size="sm" variant="ghost"
          onClick={() => setActiveTab(6)}
          className={`py-2 px-4 ${activeTab === 6 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          final Exam
        </Button>
      </div>
      {
        activeTab===1?<CourseSetup course={course} categories={categories} setCourse={setCourse}/>:
        activeTab===2?<ModulesList initModules={initModules} courseId={courseId} setInitModules={setInitModules} completed={course.completed}/>:
        activeTab===3?<PeopleSection/>:
        activeTab===4?<Resources/>:
        activeTab===5?<AssignmentsList/>:
        activeTab===6?<FinalExamEditor/>:null
      }
    </div>
  );
};

export default EditCourse;
