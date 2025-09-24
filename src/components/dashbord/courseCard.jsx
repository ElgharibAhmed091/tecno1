import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { ImageIcon } from "lucide-react"; // Import the fallback icon
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";



const MyCoursesCard = ({ courses, isLoading }) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading 
          ? // Show skeletons if loading or courses are empty
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow p-4">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-24 rounded-md" />
                </CardFooter>
              </Card>
            ))
          :
            courses?.map((course, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow rounded-lg overflow-hidden border border-gray-200">
                <CardHeader className="p-0">
                  <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    )}
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md">
                      {course?.category?.name}
                    </div>
                  </div>
                </CardHeader>
          
                {/* Smaller Content Section */}
                <CardContent className="p-3">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{course.title}</h3> 
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={course.instructor.image || "https://via.placeholder.com/40"}
                      alt={course.instructor.username}
                      className="w-6 h-6 rounded-full border"
                    />
                    <p className="text-xs text-gray-600">{course.instructor.username}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-primary">${course.price}</span>
                    <span className="text-xs text-gray-500">{course.students_count} Students</span>
                  </div>
          
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1 text-center">{course.progress}% Completed</p>
                  </div>
                </CardContent>
          
                {/* Conditional Footer Button */}
                <CardFooter className="p-3 flex justify-center border-t">
                    <Link to={`/course/${course?.id}`}
                    className={`w-full py-2 text-sm rounded-md `}
                    >
                        <Button
                            className={`w-full py-2 text-sm rounded-md `}
                        >
                                {course.progress === 100 ? "Completed" : "Resume"}
                        </Button>
                    </Link>
                </CardFooter>
              </Card>
            ))}
      </div>
      {!isLoading && courses?.length?null:(
                <p className="text-center w-full text-slate-500">No courses Enrolled in</p>
            )}

    </section>
  );
};

export default MyCoursesCard;