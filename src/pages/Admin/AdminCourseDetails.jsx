import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import useAxios from '@/utils/useAxios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/api/admin/courses/${courseId}/`);
        setCourseData(response.data);
      } catch (err) {
        setError('Failed to load course data');
        toast.error('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/2 rounded-lg" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'Course not found'}
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Chart data for statistics
  const statsChartData = {
    labels: ['Course Statistics'],
    datasets: [
      {
        label: 'Total Students',
        data: [courseData?.statistics?.total_students],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Average Students',
        data: [courseData?.statistics?.avg_students_per_course],
        backgroundColor: '#10b981',
      },
      {
        label: 'Revenue Potential',
        data: [courseData?.statistics?.total_revenue_potential],
        backgroundColor: '#f59e0b',
        yAxisID: 'y2',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label === 'Revenue Potential') {
              return `$${context.parsed.x.toLocaleString()}`
            }
            return `${label}: ${context.parsed.x.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value) => Number(value).toLocaleString()
        }
      },
      x2: {
        position: 'top',
        grid: { display: false },
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`
        },
        display: false
      }
    }
  };

  // Improved metric cards structure
  const metrics = [
    { 
      label: 'Avg. Students/Course', 
      value: courseData?.statistics?.avg_students_per_course?.toFixed(1) || 0,
      tooltip: 'Average students across all courses'
    },
    { 
      label: 'Revenue Potential', 
      value: `$${courseData?.statistics?.total_revenue_potential?.toFixed(2) || 0}`,
      trend: 'monthly'
    },
    { 
      label: 'Completion Rate', 
      value: courseData?.course_data?.completed ? 'Yes' : 'No',
      status: courseData?.course_data?.completed ? 'success' : 'error'
    },
    { 
      label: 'Published Status', 
      value: courseData?.course_data?.published ? 'Yes' : 'No',
      status: courseData?.course_data?.published ? 'success' : 'warning'
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString)?.toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Helmet>
        <title>{courseData?.course_data?.title || 'Course Details'}</title>
      </Helmet>

      {/* Improved Statistics Section */}
      <Card className="p-4 md:p-6 mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Performance Metrics</h2>
        
        <div className="h-64 mb-6">
          <Bar 
            data={statsChartData} 
            options={chartOptions}
            data-testid="performance-chart"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                metric.status 
                  ? metric.status === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : metric.status === 'warning' 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-red-50 border border-red-200'
                  : 'bg-gray-50'
              }`}
            >
              <p className="text-xs md:text-sm text-gray-600 mb-1">
                {metric.label}
                {metric.tooltip && (
                  <span className="ml-1 text-gray-400 cursor-help" title={metric.tooltip}>
                    (?)
                  </span>
                )}
              </p>
              <p className={`text-xl md:text-2xl font-bold ${
                metric.status === 'success' 
                  ? 'text-green-700' 
                  : metric.status === 'warning' 
                    ? 'text-yellow-700' 
                    : metric.status === 'error' 
                      ? 'text-red-700' 
                      : 'text-gray-900'
              }`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img 
          src={courseData?.course_data?.image} 
          alt={courseData?.course_data?.title||'NotFound'}
          className="w-full md:w-1/2 h-64 object-cover rounded-xl bg-gray-300"
        />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{courseData?.course_data?.title||'NotFound'}</h1>
          <p className="text-gray-600">{courseData?.course_data?.description||'NotFound'}</p>
          <div className="flex gap-4 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {courseData?.course_data?.category?.name}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {courseData?.course_data?.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Details */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Course Information</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Instructor</dt>
              <dd className="font-medium">{courseData?.course_data?.instructor?.username||'NotFound'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Created Date</dt>
              <dd className="font-medium">{formatDate(courseData?.course_data?.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Price</dt>
              <dd className="font-medium">
                ${courseData?.course_data?.price?.toFixed(2)}
                {courseData?.course_data?.discount > 0 && (
                  <span className="ml-2 text-red-600">
                    ({courseData?.course_data?.discount||0}% off)
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Language</dt>
              <dd className="font-medium">{courseData?.course_data?.language||'English'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Total Hours</dt>
              <dd className="font-medium">{courseData?.course_data?.hours||0}h</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Students Enrolled</dt>
              <dd className="font-medium">{courseData?.course_data?.students_count||0}</dd>
            </div>
          </dl>
        </Card>

      </div>

      {/* Modules Section */}
      {courseData?.course_data?.modules?.length > 0 && (
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
          <div className="space-y-4">
            {courseData?.course_data?.modules?.map((module, index) => (
              <div key={module?.id} className="p-4 border rounded-lg">
                <h3 className="font-medium">
                  Module {index + 1}: {module?.title}
                </h3>
                {module?.lessons && (
                  <div className="mt-2 text-sm text-gray-600">
                    {module?.lessons?.length||0} lessons
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}