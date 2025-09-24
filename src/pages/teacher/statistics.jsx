import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from 'lucide-react';
import useAxios from '@/utils/useAxios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function TeacherStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/instructor/statistics');
        setStats(response.data.teacher_statistics);
      } catch (err) {
        setError('Failed to load teacher statistics');
        toast.error('Failed to fetch teacher data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'No teacher data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Helmet>
        <title>Teacher Statistics</title>
      </Helmet>

      {/* Total Students */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Total Enrolled Students</h2>
        <div className="text-4xl font-bold text-primary">
          {stats.total_enrolled_students.toLocaleString()}
        </div>
      </Card>


      {/* Per Course Statistics */}
      {stats.course_progress.map((course, index) => (
        <Card key={index} className="p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{course.course_title}</h2>
            <div className="flex items-center gap-4">
              <Progress value={course.avg_progress} className="h-2 w-1/4" />
              <span className="text-sm text-gray-600">
                Average Progress: {course.avg_progress}%
              </span>
            </div>
          </div>

          {/* Quiz Performance */}
          {course.quiz_performance.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Quiz Performance</h3>
              <div className="h-64">
                <Bar
                  data={{
                    labels: course.quiz_performance.map(q => q.quiz_title),
                    datasets: [
                      {
                        label: 'Average Grade',
                        data: course.quiz_performance.map(q => q.avg_grade),
                        backgroundColor: '#10b981',
                      },
                      {
                        label: 'Highest Grade',
                        data: course.quiz_performance.map(q => q.highest_grade),
                        backgroundColor: '#3b82f6',
                      },
                      {
                        label: 'Lowest Grade',
                        data: course.quiz_performance.map(q => q.lowest_grade),
                        backgroundColor: '#f59e0b',
                      }
                    ]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: {
                      y: { 
                        max: 100,
                        ticks: {
                          callback: value => `${value}%`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Assignment Performance */}
          {course.assignment_performance.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Assignment Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <Bar
                    data={{
                      labels: course.assignment_performance.map(a => a.assignment_title),
                      datasets: [{
                        label: 'Average Grade (%)',
                        data: course.assignment_performance.map(a => a.avg_grade),
                        backgroundColor: '#f59e0b',
                      }]
                    }}
                    options={{
                      indexAxis: 'y',
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' } },
                      scales: {
                        x: { 
                          max: 100,
                          ticks: {
                            callback: value => `${value}%`
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: course.assignment_performance.map(a => a.assignment_title),
                      datasets: [
                        {
                          label: 'Submitted',
                          data: course.assignment_performance.map(a => a.submitted),
                          backgroundColor: '#10b981',
                        },
                        {
                          label: 'Not Submitted',
                          data: course.assignment_performance.map(a => a.not_submitted),
                          backgroundColor: '#f59e0b',
                        }
                      ]
                    }}
                    options={{
                      indexAxis: 'y',
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' } }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Top Students */}
          {course.top_students.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Top Students</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3">Student</th>
                      <th className="pb-3 text-right">Overall Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.top_students.map((student, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3">{student.student_name}</td>
                        <td className="py-3 text-right font-semibold text-green-600">
                          {student.overall_grade.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Unfinished Assignments */}
          {course.unfinished_assignments.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Pending Submissions</h3>
              <div className="space-y-4">
                {course.unfinished_assignments.map((assignment, index) => (
                  <Alert key={index} variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>{assignment.assignment_title}</AlertTitle>
                    <AlertDescription>
                      <div className="flex justify-between">
                        <span>Due: {formatDate(assignment.due_date)}</span>
                        <span>{assignment.students_not_submitted} students pending</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}