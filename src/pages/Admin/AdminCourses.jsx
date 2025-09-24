import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "@/utils/useAxios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const AdminCoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    const fetchcourses = async () => {
      try {
        const response = await axios.get("/api/admin/courses/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchcourses();
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Courses</title>
      </Helmet>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage courses</h1>
      </div>

      {/* Table Container */}
      <Card className="overflow-hidden shadow-md rounded-lg">
        {loading ? (
          <div className="p-6 text-center">Loading courses...</div>
        ) : (
          <Table>
            {/* Table Head */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className="hover:bg-gray-50 cursor-pointer transition duration-200"
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                  >
                    <TableCell>{course.title}</TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="p-4 text-center text-gray-500">
                    No courses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AdminCoursesTable;
