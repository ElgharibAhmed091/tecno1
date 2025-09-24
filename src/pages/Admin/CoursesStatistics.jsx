import { useEffect, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from 'react-hot-toast';
import useAxios from '@/utils/useAxios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function CourseStatistics() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('api/admin/statistics/courses/');
        setStatsData(response.data);
      } catch  {
        setError('Failed to load course statistics');
        toast.error('Failed to fetch course statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'No course statistics available'}
      </div>
    );
  }

  // Helper function to format numbers
  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  // Chart configurations
  const languageChartData = {
    labels: statsData?.language_distribution?.map(item => item.language),
    datasets: [{
      data: statsData?.language_distribution?.map(item => item.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  const categoryChartData = {
    labels: statsData?.category_distribution?.map(item => item.category__name),
    datasets: [{
      label: 'Courses per Category',
      data: statsData?.category_distribution?.map(item => item.count),
      backgroundColor: '#4BC0C0',
    }]
  };

  const timelineChartData = {
    labels: statsData?.created_timeline?.map(item => new Date(item?.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
    datasets: [{
      label: 'Courses Created',
      data: statsData?.created_timeline?.map(item => item.count),
      borderColor: '#36A2EB',
      tension: 0.4,
    }]
  };

  const instructorChartData = {
    labels: statsData?.instructor_distribution?.map(item => item.instructor__username),
    datasets: [{
      label: 'Courses Created',
      data: statsData?.instructor_distribution?.map(item => item.count),
      backgroundColor: '#FF9F40',
    }]
  };

  return (
    <div className="p-6 space-y-8">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-600">Total Courses</h3>
          <p className="text-3xl font-bold text-primary">
            {formatNumber(statsData?.general.total_courses)}
          </p>
        </Card>
        
        <Card className="p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-600">Published Courses</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatNumber(statsData?.general.published_courses)}
          </p>
        </Card>

        <Card className="p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-600">Total Students</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatNumber(statsData?.students.total_students)}
          </p>
        </Card>

        <Card className="p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-600">Avg. Price</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${statsData?.pricing.average_price.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Language Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={languageChartData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="h-64">
            <Bar
              data={categoryChartData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                scales: {
                  x: { beginAtZero: true },
                  y: { ticks: { autoSkip: false } }
                }
              }}
            />
          </div>
        </Card>

        {/* Creation Timeline */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Creation Timeline</h3>
          <div className="h-64">
            <Line
              data={timelineChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>

        {/* Instructor Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Instructors</h3>
          <div className="h-64">
            <Bar
              data={instructorChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>
      </div>

      {/* Secondary Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-600">Top Course</h3>
          <p className="text-xl font-bold mt-2">{statsData?.students.top_course_by_students.title}</p>
          <p className="text-gray-600">{formatNumber(statsData?.students.top_course_by_students.students_count)} students</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-600">Total Content Hours</h3>
          <p className="text-3xl font-bold text-orange-600">
            {formatNumber(statsData?.content_hours.total_hours)}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            ({statsData?.content_hours.average_hours_per_course.toFixed(1)} hrs/course)
          </p>
        </Card>
      </div>
        <GeneralCourseStats data={statsData}/>
    </div>
  );
}

function GeneralCourseStats({ data }) {
  // Prepare chart data
  const chartData = {
    labels: Object.keys(data.general),
    datasets: [{
      label: 'Course Statistics',
      data: Object.values(data.general),
      backgroundColor: '#3b82f6',
      borderWidth: 0,
    }]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card className="w-full p-6">
      <h3 className="text-lg font-semibold mb-4">Course Overview</h3>
      <div className="w-full h-64">
        <Bar
          data={chartData}
          options={options}
        />
      </div>
    </Card>
  );
}