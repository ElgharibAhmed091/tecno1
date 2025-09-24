import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Progress } from "@/components/ui/progress";
import useAxios from '@/utils/useAxios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function StudentStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios =useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/student/statistics/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load student statistics');
        toast.error('Failed to fetch student data');
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
        {error || 'No student data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Course progress chart data
  const courseProgressData = {
    labels: stats.courses.map(course => course.course_title),
    datasets: [{
      label: 'Course Progress (%)',
      data: stats.courses.map(course => course.progress),
      backgroundColor: '#3b82f6',
    }]
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Student Statistics</title>
      </Helmet>

      {/* Overall Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
        <div className="flex items-center gap-4">
          <Progress value={stats.average_progress} className="h-3" />
          <span className="text-lg font-semibold">{stats.average_progress.toFixed(1)}%</span>
        </div>
      </div>

      {/* Course Progress Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Course Progress Overview</h3>
        <div className="h-64">
          <Bar
            data={courseProgressData}
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
      </Card>

      {/* Per Course Statistics */}
      {stats.courses.map((course, index) => (
        <Card key={index} className="p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{course.course_title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <Progress value={course.progress} className="h-2" />
              <span className="text-sm text-gray-600">{course.progress}% Complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quizzes Chart */}
            {course.quizzes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Quiz Grades</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: course.quizzes.map(q => q.quiz_title),
                      datasets: [{
                        label: 'Grade (%)',
                        data: course.quizzes.map(q => q.grade),
                        backgroundColor: '#10b981',
                      }]
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

            {/* Assignments Chart */}
            {course.assignments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Assignment Grades</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: course.assignments.map(a => a.assignment_title),
                      datasets: [{
                        label: 'Grade (%)',
                        data: course.assignments.map(a => a.grade),
                        backgroundColor: '#f59e0b',
                      }]
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
          </div>
        </Card>
      ))}
    </div>
  );
}