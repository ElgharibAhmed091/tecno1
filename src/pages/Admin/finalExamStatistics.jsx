import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ClipboardList, Award, Users, TrendingDown } from 'lucide-react';
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

export function FinalExamStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/statistics/finalexams');
        setStats(response.data.final_exam_statistics);
      } catch (err) {
        setError('Failed to load exam statistics');
        toast.error('Failed to fetch exam data');
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
        {error || 'No exam data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Grade Distribution Chart
  const gradeData = {
    labels: stats.grade_distribution.map(g => g.range),
    datasets: [{
      label: 'Number of Students',
      data: stats.grade_distribution.map(g => g.count),
      backgroundColor: '#3b82f6',
      borderWidth: 0
    }]
  };

  // Submission Timeline Chart
  const submissionData = {
    labels: stats.submissions_by_month.map(m => 
      new Date(m.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ),
    datasets: [{
      label: 'Monthly Submissions',
      data: stats.submissions_by_month.map(m => m.count),
      borderColor: '#10b981',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(16, 185, 129, 0.05)'
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Final Exam Statistics</title>
      </Helmet>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<ClipboardList className="w-6 h-6" />}
          title="Total Submissions"
          value={stats.total_submissions.toLocaleString()}
          color="bg-blue-100"
        />
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          title="Total Exams"
          value={stats.total_final_exams.toLocaleString()}
          color="bg-purple-100"
        />
        <MetricCard
          icon={<TrendingDown className="w-6 h-6" />}
          title="Drop Rate"
          value={`${stats.drop_rate.toFixed(1)}%`}
          color="bg-red-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
          <div className="h-80">
            <Bar
              data={gradeData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>

        {/* Submission Timeline */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Submission Trend</h3>
          <div className="h-80">
            <Line
              data={submissionData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>

        {/* Top Students */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Performing Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_students.map((student, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-3">{student.student}</td>
                    <td className="py-3 font-semibold text-green-600">
                      {student.grade.toFixed(1)}%
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