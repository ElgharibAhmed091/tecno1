import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookCheck, ClipboardList, Award, ScrollText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const PeopleSection = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentStats, setStudentStats] = useState({});
  const [statsLoading, setStatsLoading] = useState({});
  const axios = useAxios();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/api/instructor/courses/${courseId}/enrolledIn`);
        setStudents(response.data);
      } catch {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  const fetchStudentStats = async (studentId) => {
    setStatsLoading(prev => ({ ...prev, [studentId]: true }));
    try {
      const response = await axios.get(
        `api/instructor/student/statistics/${courseId}/${studentId}`
      );
      setStudentStats(prev => ({
        ...prev,
        [studentId]: response.data
      }));
    } catch {
      toast.error("Failed to load student statistics");
    } finally {
      setStatsLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const toggleStudent = (studentId) => {
    if (selectedStudent === studentId) {
      setSelectedStudent(null);
    } else {
      setSelectedStudent(studentId);
      if (!studentStats[studentId]) {
        fetchStudentStats(studentId);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Enrolled Students
      </h2>
      
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {students.map((student) => {
            const stats = studentStats[student.student.id];
            const isLoadingStats = statsLoading[student.student.id];
            
            return (
              <div key={student.student.id} className="rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center p-4 bg-white hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.student.image} />
                    <AvatarFallback>{student.student.username[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-800">{student.student.username}</h3>
                    <p className="text-sm text-gray-500">
                      Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStudent(student.student.id)}
                    className="rounded-lg"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        selectedStudent === student.student.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>

                <AnimatePresence>
                  {selectedStudent === student.student.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t"
                    >
                      <div className="p-4 bg-gray-50">
                        {isLoadingStats ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-24 rounded-lg" />
                            ))}
                          </div>
                        ) : stats ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Quiz Grade Card */}
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <Award className="h-6 w-6 text-blue-500" />
                                <h4 className="font-medium">Quiz Average</h4>
                              </div>
                              <Progress 
                                value={stats.average_quiz_grade} 
                                className="h-2"
                              />
                              <div className="mt-2 text-xl font-bold text-blue-600">
                                {stats.average_quiz_grade}%
                              </div>
                            </div>

                            {/* Assignments Card */}
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <ClipboardList className="h-6 w-6 text-purple-500" />
                                <h4 className="font-medium">Assignments</h4>
                              </div>
                                  <Progress 
                                    value={(stats.assignments_submitted / stats.total_assignments) * 100} 
                                    className="h-2 my-3"
                                  />
                              <div className="flex justify-between text-sm mb-2">
                                <span>{stats.assignments_submitted}/{stats.total_assignments}</span>
                                <span>
                                  {Math.round(
                                    (stats.assignments_submitted / stats.total_assignments) * 100
                                  )}%
                                </span>
                              </div>
                            </div>

                            {/* Progress Card */}
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <ScrollText className="h-6 w-6 text-green-500" />
                                <h4 className="font-medium">Course Progress</h4>
                              </div>
                              <Progress 
                                value={stats.current_progress} 
                                className="h-2"
                              />
                              <div className="mt-2 text-xl font-bold text-green-600">
                                {stats.current_progress}%
                              </div>
                            </div>

                            {/* Completion Badge */}
                            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
                              <BookCheck className="h-8 w-8 text-orange-500 mb-2" />
                              <div className="text-center">
                                <div className="text-xl font-bold">
                                  {stats.current_progress}%
                                </div>
                                <div className="text-sm text-gray-500">
                                  Overall Completion
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-4 text-gray-500">
                            Failed to load statistics
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PeopleSection;