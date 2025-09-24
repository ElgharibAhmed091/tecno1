import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
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
  Legend
);

export function CategoryStatistics() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/statistics/categories/');
        setStatsData(response.data);
      } catch {
        setError('Failed to load categories statistics');
        toast.error('Failed to fetch category statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'No categories statistics available'}
      </div>
    );
  }

  // Line chart data (Categories over time)
 const timelineChartData = {
  labels: statsData.categories_over_time.map(item => {
    const date = new Date(item.month);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month}`; // Format: 2025-4
  }),
  datasets: [{
    label: 'Categories Added',
    data: statsData.categories_over_time.map(item => item.categories_added),
    borderColor: '#4BC0C0',
    tension: 0.4,
    fill: false
  }]
};

  // Bar chart data (Course count per category)
  const courseCountChartData = {
    labels: statsData.category_course_count.map(item => item.name),
    datasets: [{
      label: 'Number of Courses',
      data: statsData.category_course_count.map(item => item.course_count),
      backgroundColor: '#36A2EB',
      borderWidth: 0
    }]
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold">Total Categories</h3>
          <p className="text-4xl font-bold text-primary">{statsData.total_categories}</p>
        </Card>
        
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold">Recent Categories (Last 30 days)</h3>
          <p className="text-4xl font-bold text-green-600">{statsData.recent_categories}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Growth Timeline</h3>
          <div className="h-64">
            <Line
              data={timelineChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Categories Added'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  }
                }
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Courses per Category</h3>
          <div className="h-64">
            <Bar
              data={courseCountChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    },
                    title: {
                      display: true,
                      text: 'Number of Courses'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Category'
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}