import { Card } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import MyCoursesCard from "@/components/dashbord/courseCard";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { CoursesList } from "@/components/courses/courses-list";
import { Helmet } from "react-helmet-async";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIslading] = useState(false);
  const axios = useAxios();
  const [liveSessions, setLiveSessions] = useState([]);

  useEffect(() => {
    setIslading(true);
    const handleFetch = async () => {
      try {
        const [response, sessionsResponse,recommend] = await Promise.all([
          axios.get("api/student/courses/Enrolled"),
          axios.get("api/student/live/lessons"),
          axios.get("api/student/course/recommend"),

        ]);

        setLiveSessions(sessionsResponse.data);
        setCourses(response.data);
        setRecommendation(recommend.data)
      } catch {
        toast.error("failed to get the courses");
      } finally {
        setIslading(false);
      }
    };
    handleFetch();
  }, []);

  const groupedSessions = liveSessions.reduce((acc, session) => {
    const courseTitle = session.course_title;
    if (!acc[courseTitle]) {
      acc[courseTitle] = [];
    }
    acc[courseTitle].push(session);
    return acc;
  }, {});

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xl text-gray-600 mt-2">Good Morning {user.username}!</p>
      </div>

      {/* My Courses Section */}
      <section className="mb-8">
        <h1>Recommended courses</h1>
        {recommendation?(
          <CoursesList items={recommendation} link={'/course/'} />
        ):(<p>there is no recommendation</p>)}
      </section>
      <section className="mb-8">
        <MyCoursesCard courses={courses} isLoading={isLoading} />
      </section>

      {/* Lesson Schedule & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lesson Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Upcoming Live Lessons</h2>
          {liveSessions.length === 0 ? (
            <p className="text-muted-foreground">No upcoming live sessions</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSessions).map(([courseTitle, sessions]) => (
                <div key={courseTitle} className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {courseTitle}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {sessions.map((session) => {
                      const isSessionStarted = moment(session.start_time).isBefore(moment());
                      return (
                        <Card key={session.id} className="p-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1 flex-1">
                              <p className="text-sm text-muted-foreground font-medium">
                                {session.topic}
                              </p>
                              <div className="flex flex-col md:flex-row gap-2 text-sm">
                                <span>
                                  Duration: {formatDuration(session.duration)}
                                </span>
                                <span className="md:mx-2">•</span>
                                <span>
                                  Starts:{" "}
                                  {moment(session.start_time).format("MMM Do YYYY, h:mm a")}
                                </span>
                              </div>
                            </div>
                            {/* Disable button if session has not started */}
                            <Button
                              className="w-full md:w-auto"
                              variant="outline"
                              disabled={!isSessionStarted}
                            >
                              <a href={session.join_url} target="_blank">
                                join
                              </a>
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
