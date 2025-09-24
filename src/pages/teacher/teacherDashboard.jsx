import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";
import { CoursesList } from "@/components/courses/courses-list";
import moment from "moment";
import { Helmet } from "react-helmet-async";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveSessions, setLiveSessions] = useState([]);
  const axios = useAxios();

  // Stats configuration based on API response
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, dashboardResponse, sessionsResponse] = await Promise.all([
          axios.get('api/instructor/courses/'),
          axios.get('api/accounts/instructor/dashboard'),
          axios.get('api/lesson/live') 
        ]);
        
        setCourses(coursesResponse.data);
        setDashboardStats(dashboardResponse.data);
        setLiveSessions(sessionsResponse.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

    const stats = [
      { 
        title: "Total Students", 
        value: dashboardStats?.all_students?.toLocaleString() || "0" 
      },
      { 
        title: "Total Earnings", 
        value: dashboardStats?.total_revenue ? `$${dashboardStats.total_revenue.toLocaleString()}` : "$0" 
      },
      { 
        title: "Courses", 
        value: courses.length 
      },
  
    ];
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === 0 ? true :
      activeFilter === 1 ? course.published :
      !course.published;
    
    return matchesSearch && matchesFilter;
  });
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
  if (loading) return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );

  
  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Teaching Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Professor</p>
        </div>
        <Button 
          onClick={() => navigate("/teacher/courses/create")} 
          className="w-full md:w-auto"
        >
          + Create New Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>
{/* Live Sessions Section */}
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
                  {sessions.map((session) => (
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
                              {moment(session.start_time).format(
                                "MMM Do YYYY, h:mm a"
                              )}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full md:w-auto"
                          variant="outline"
                        >
                          <a href={session.start_url} target='_blank'>Start Session</a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={activeFilter === 0 ? "default" : "outline"}
            onClick={() => setActiveFilter(0)}
          >
            All ({courses.length})
          </Button>
          <Button 
            variant={activeFilter === 1 ? "default" : "outline"}
            onClick={() => setActiveFilter(1)}
          >
            Published ({courses.filter(c => c.published).length})
          </Button>
          <Button 
            variant={activeFilter === 2 ? "default" : "outline"}
            onClick={() => setActiveFilter(2)}
          >
            Unpublished ({courses.filter(c => !c.published).length})
          </Button>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <CoursesList 
          items={filteredCourses} 
          link="/teacher/courses/edit/" 
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;