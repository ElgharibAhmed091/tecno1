import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import useAxios from '@/utils/useAxios';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function EnrollmentStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/statistics/enrollments');
        setStats(response.data.enrollment_statistics);
      } catch (err) {
        setError('Failed to load enrollment statistics');
        toast.error('Failed to fetch enrollment data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
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
        {error || 'No enrollment data available'}
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Enrollment Timeline Chart
  const timelineData = {
    labels: stats.enrollments_by_month.map(m => new Date(m.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
    datasets: [{
      label: 'Monthly Enrollments',
      data: stats.enrollments_by_month.map(m => m.count),
      borderColor: '#3b82f6',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.05)'
    }]
  };

  // Progress Distribution Chart
  const progressData = {
    labels: stats.progress_distribution.map(p => p.range),
    datasets: [{
      label: 'Students in Progress Range',
      data: stats.progress_distribution.map(p => p.count),
      backgroundColor: '#10b981'
    }]
  };

  // Top Courses Chart
  const topCoursesData = {
    labels: stats.top_10_enrolled_courses.map(c => c.title),
    datasets: [{
      label: 'Enrollments',
      data: stats.top_10_enrolled_courses.map(c => c.total_enrollments),
      backgroundColor: '#f59e0b'
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Enrollment Statistics</title>
      </Helmet>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Total Enrollments"
          value={stats.total_enrollments.toLocaleString()}
          trend="total"
        />
        <MetricCard
          title="Inactive Students"
          value={stats.inactive_students.toLocaleString()}
          trend="down"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        

        {/* Progress Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Student Progress Distribution</h3>
          <div className="h-80">
            <Bar
              data={progressData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                  x: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>

        {/* Top Courses */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Enrolled Courses</h3>
          <div className="h-96">
            <Bar
              data={topCoursesData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                  x: { beginAtZero: true }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.top_10_enrolled_courses.map((course, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium truncate">{course.title}</h4>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">{course.total_enrollments} enrollments</span>
                  <span className="text-sm font-semibold">${course.price}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({  title, value, trend }) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-gray-600',
    danger: 'text-red-600',
    total: 'text-blue-600'
  };

  return (
    <Card className="p-4 flex items-center gap-4">

      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <p className={`text-2xl font-bold ${trendColors[trend] || 'text-gray-900'}`}>
          {value}
        </p>
      </div>
    </Card>
  );
}