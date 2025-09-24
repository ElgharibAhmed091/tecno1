import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ClipboardList, Upload, CheckCircle2, Star, Clock } from 'lucide-react';
import useAxios from '@/utils/useAxios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function AssignmentStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/statistics/assignment');
        setStats(response.data.assignment_statistics);
      } catch (err) {
        setError('Failed to load assignment statistics');
        toast.error('Failed to fetch assignment data');
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
        {error || 'No assignment data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Top Submissions Chart Data
  const topSubmissionsData = {
    labels: stats.top_assignments_by_submission_count.map(a => a.assignment_title),
    datasets: [{
      label: 'Submissions',
      data: stats.top_assignments_by_submission_count.map(a => a.submission_count),
      backgroundColor: '#3b82f6',
    }]
  };

  // Top Grades Chart Data
  const topGradesData = {
    labels: stats.top_assignments_by_average_grade.map(a => a.assignment_title),
    datasets: [{
      label: 'Average Grade (%)',
      data: stats.top_assignments_by_average_grade.map(a => a.average_grade),
      backgroundColor: '#10b981',
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Assignment Statistics</title>
      </Helmet>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <MetricCard
          icon={<ClipboardList className="w-6 h-6" />}
          title="Total Assignments"
          value={stats.total_assignments.toLocaleString()}
          color="bg-blue-100"
        />
        <MetricCard
          icon={<Upload className="w-6 h-6" />}
          title="Avg. Submissions"
          value={stats.average_submissions_per_assignment.toFixed(1)}
          color="bg-purple-100"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Submission Rate"
          value={`${stats.submission_rate.toFixed(1)}%`}
          color="bg-green-100"
        />
        <MetricCard
          icon={<Star className="w-6 h-6" />}
          title="Avg. Grade"
          value={`${stats.average_grade.toFixed(1)}%`}
          color="bg-yellow-100"
        />
        <MetricCard
          icon={<Clock className="w-6 h-6" />}
          title="Late Submissions"
          value={`${stats.late_submissions_rate.toFixed(1)}%`}
          color="bg-red-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Submissions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Submitted Assignments</h3>
          <div className="h-96">
            <Bar
              data={topSubmissionsData}
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

        {/* Top Grades */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Highest Graded Assignments</h3>
          <div className="h-96">
            <Bar
              data={topGradesData}
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
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Submissions Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Assignments by Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Assignment</th>
                  <th className="pb-3">Module</th>
                  <th className="pb-3 text-right">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_assignments_by_submission_count.map((assignment, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3">{assignment.assignment_title}</td>
                    <td className="py-3 text-gray-600">{assignment.module_title}</td>
                    <td className="py-3 text-right font-semibold">
                      {assignment.submission_count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Grades Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Assignments by Grades</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Assignment</th>
                  <th className="pb-3">Module</th>
                  <th className="pb-3 text-right">Avg. Grade</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_assignments_by_average_grade.map((assignment, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3">{assignment.assignment_title}</td>
                    <td className="py-3 text-gray-600">{assignment.module_title}</td>
                    <td className="py-3 text-right font-semibold text-green-600">
                      {assignment.average_grade.toFixed(1)}%
                    </td>
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