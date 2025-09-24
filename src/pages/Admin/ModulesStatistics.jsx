import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { BookOpenText, Trophy, Clock, Layers } from 'lucide-react';
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

export function ModuleStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/statistics/modules');
        setStats(response.data.module_statistics);
      } catch (err) {
        setError('Failed to load module statistics');
        toast.error('Failed to fetch module data');
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
          <Skeleton className="h-32 rounded-xl" />
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
        {error || 'No module data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Completion Rate Chart Data
  const completionData = {
    labels: stats.modules_completion_rate.map(m => m.module),
    datasets: [{
      label: 'Completion Rate (%)',
      data: stats.modules_completion_rate.map(m => m.completion_rate),
      backgroundColor: '#3b82f6',
      borderWidth: 0
    }]
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Module Statistics</title>
      </Helmet>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<Layers className="w-6 h-6" />}
          title="Total Modules"
          value={stats.total_modules.toLocaleString()}
          color="bg-blue-100"
        />
        <MetricCard
        icon={<Trophy className="w-6 h-6" />}
        title="Top Completion Rate"
        value={`${(stats.modules_completion_rate.length > 0
            ? Math.max(...stats.modules_completion_rate.map(m => m.completion_rate)) 
            : 0
        ).toFixed(1)}%`}
        color="bg-green-100"
        />

        <MetricCard
        icon={<BookOpenText className="w-6 h-6" />}
        title="Avg. Completion"
        value={`${(stats.modules_completion_rate.length > 0
            ? (stats.modules_completion_rate.reduce((a, b) => a + b.completion_rate, 0) / stats.modules_completion_rate.length)
            : 0
        ).toFixed(1)}%`}
        color="bg-purple-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Rates */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Module Completion Rates</h3>
          <div className="h-96">
            <Bar
              data={completionData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                  x: { 
                    beginAtZero: true,
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

        {/* Top Modules Table */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Module Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Module</th>
                  <th className="pb-3">Course</th>
                  <th className="pb-3 text-right">Completion Rate</th>
                  <th className="pb-3 text-right">Completed</th>
                  <th className="pb-3 text-right">Total Students</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_modules.map((module, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3">{module.module}</td>
                    <td className="py-3 text-gray-600">{module.course}</td>
                    <td className="py-3 text-right font-semibold text-green-600">
                      {module.completion_rate.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right">{module.completed_count.toLocaleString()}</td>
                    <td className="py-3 text-right">{module.total_students.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
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