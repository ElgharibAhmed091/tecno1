import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Clock, PlayCircle, BookOpen, Award, LucideTvMinimalPlay, CircleArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import AuthContext from "@/context/AuthContext";
import useAxios from "@/utils/useAxios";
import { Card } from "@/components/ui/card";
import ChaptersCard from "@/components/courses/ChaptersCard";
import { Helmet } from "react-helmet-async";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const Axios = useAxios();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/`);
        setCourse(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Course not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      if (user) {
        try {
          const response = await Axios.get(`/api/course/isEnrolled/${courseId}`);
          setIsEnrolled(response.data.message);
        } catch {
          setIsEnrolled(false);
        }
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [courseId]);

  const handleEnrollment = async () => {
    setEnrolling(true);
    if (user) {
      if (user?.role ==='student'){
        navigate(`/payment/${course.id}`, { state: { course } });
      }
      else{
        toast.error('you are not student')
        setEnrolling(false)
      }
    }
     else navigate("/login");
  };

  if (loading) {
    return <Skeleton className="h-[300px] w-full max-w-7xl mx-auto rounded-lg mt-10" />;
  }

  return (
    <Card>
      <Helmet>
            <title>{course?course?.title:'Course'}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* Course Header with Background Image */}
        <div
          className="relative w-full h-96 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${course?.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
            <h1 className="text-white text-3xl font-bold">{course?.title}</h1>
            <p className="text-gray-200 mt-2">{course?.category?.name}</p>
            <div className="flex items-center mt-4 space-x-4">
              {course?.instructor && (
                <div className="flex items-center text-gray-200">
                  <User className="h-5 w-5 mr-2" />
                  <span>{course?.instructor?.username}</span>
                </div>
              )}

            </div>
            <div className="mt-4">
              <span className="text-gray-200 ml-2">({course?.students_count}) Students</span>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Right Column (Left on Large Screens) */}
          <div className="lg:order-1 lg:w-1/3 space-y-6">
            {/* Course Includes */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800">This Course Includes:</h2>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{course?.hours} hours</span>
                </li>
                <li className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>Study materials</span>
                </li>
                <li className="flex items-center">
                  <LucideTvMinimalPlay className="h-5 w-5 mr-2" />
                  <span>{course?.modules?.length} Modules</span>
                </li>
                <li className="flex items-center">
                  <CircleArrowRight className="h-5 w-5 mr-2" />
                  <span>{course?.language}</span>
                </li>
                <li className="flex items-center">
                  <CircleArrowRight className="h-5 w-5 mr-2" />
                  <span>{course?.completed?'ongoing':'completed'}</span>
                </li>
                {course?.has_certification && (
                  <li className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    <span>Certificate of completion</span>
                  </li>
                )}
              </ul>
            </div>
            {/* Pricing */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800">Pricing</h2>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-800">${course?.price * ((1-course?.discount/100))}</span>
                {course?.discount > 0 && (
                  <span className="text-red-700 line-through ml-2">${course?.price}</span>
                )}
              </div>

              <Button
                className="w-full mt-4 py-3 text-lg bg-blue-600 hover:bg-blue-700 transition"
                onClick={handleEnrollment}
                disabled={enrolling || isEnrolled}
              >
                {isEnrolled ? "Already Enrolled" : enrolling ? "Enrolling..." : "Enroll Now"}
              </Button>
            </div>
          </div>

          {/* Left Column (Right on Large Screens) */}
          <div className="lg:order-2 lg:w-2/3 space-y-6">
            {/* About the Course */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">About the Course</h2>
              <p className="text-gray-700 mt-2">
                {course?.description || "No description available."}
              </p>
            </div>

            {/* What You'll Learn */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">What You'll Learn</h2>
              <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
                {course?.learned.length > 0 ? (
                  course?.learned.map((item) => (
                    <li key={item.id} className="mt-2">
                      {item.text}
                    </li>
                  ))
                ) : (
                  <li>No learning objectives provided.</li>
                )}
              </ul>
            </div>

            {/* Course Chapters */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Course Chapters</h2>
              <ChaptersCard modules={course?.modules} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseDetailPage;