import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { BookOpen, CheckCircle, Trophy, Percent } from 'lucide-react';
import useAxios from '@/utils/useAxios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function LessonStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/statistics/lessons');
        setStats(response.data.lesson_statistics);
      } catch (err) {
        setError('Failed to load lesson statistics');
        toast.error('Failed to fetch lesson data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'No lesson data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate average completion rate
  const avgCompletionRate = stats.lessons_completion_rate.length > 0 
    ? stats.lessons_completion_rate.reduce((sum, lesson) => sum + lesson.completion_rate, 0) / stats.lessons_completion_rate.length
    : 0;

  // Lesson Completion Chart Data
  const lessonCompletionData = {
    labels: stats.lessons_completion_rate.map(lesson => lesson.lesson),
    datasets: [{
      label: 'Completion Rate (%)',
      data: stats.lessons_completion_rate.map(lesson => lesson.completion_rate),
      backgroundColor: '#3b82f6',
    }]
  };



  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Lesson Statistics</title>
      </Helmet>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Total Lessons"
          value={stats.total_lessons.toLocaleString()}
          color="bg-blue-100"
        />
        <MetricCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Completed Lessons"
          value={stats.total_completed_lessons.toLocaleString()}
          color="bg-green-100"
        />
        <MetricCard
          icon={<Percent className="w-6 h-6" />}
          title="Avg. Completion"
          value={`${avgCompletionRate.toFixed(1)}%`}
          color="bg-purple-100"
        />
        <MetricCard
          icon={<Trophy className="w-6 h-6" />}
          title="Top Course"
          value={`${stats.top_courses_by_completion[0]?.avg_completion_rate?.toFixed(1) || 0}%`}
          color="bg-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Lesson Completion Rates */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lesson Completion Rates</h3>
          <div className="h-96">
            <Bar
              data={lessonCompletionData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
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
      </div>

      {/* Top Lessons Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Lessons</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Lesson</th>
                <th className="pb-3">Course</th>
                <th className="pb-3 text-right">Completion Rate</th>
                <th className="pb-3 text-right">Completed</th>
                <th className="pb-3 text-right">Total Students</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_lessons.map((lesson, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3">{lesson.lesson}</td>
                  <td className="py-3 text-gray-600">{lesson.course}</td>
                  <td className="py-3 text-right font-semibold text-green-600">
                    {lesson.completion_rate.toFixed(1)}%
                  </td>
                  <td className="py-3 text-right">{lesson.completed_count.toLocaleString()}</td>
                  <td className="py-3 text-right">{lesson.total_students.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ icon, title, value, color }) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </Card>
  );
}