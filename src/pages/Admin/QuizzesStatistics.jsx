import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ClipboardList, Award, Users, ListChecks } from 'lucide-react';
import useAxios from '@/utils/useAxios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function QuizStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxios()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/statistics/quizzes');
        setStats(response.data.quiz_statistics);
      } catch (err) {
        setError('Failed to load quiz statistics');
        toast.error('Failed to fetch quiz data');
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
        {error || 'No quiz data available'}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Most Taken Quizzes Chart Data
  const mostTakenData = {
    labels: stats.most_taken_quizzes.map(q => q.quiz_title),
    datasets: [{
      label: 'Times Taken',
      data: stats.most_taken_quizzes.map(q => q.taken_count),
      backgroundColor: '#3b82f6',
    }]
  };

  // Top Quizzes by Grade Chart Data
  const topGradesData = {
    labels: stats.top_quizzes_by_grade.map(q => q.quiz_title),
    datasets: [{
      label: 'Average Grade (%)',
      data: stats.top_quizzes_by_grade.map(q => q.average_grade),
      backgroundColor: '#10b981',
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Quiz Statistics</title>
      </Helmet>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<ClipboardList className="w-6 h-6" />}
          title="Total Quizzes"
          value={stats.total_quizzes.toLocaleString()}
          color="bg-blue-100"
        />
        <MetricCard
          icon={<Award className="w-6 h-6" />}
          title="Avg. Grade"
          value={`${stats.overall_average_grade.toFixed(1)}%`}
          color="bg-green-100"
        />
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          title="Participation"
          value={`${stats.participation_rate.toFixed(1)}%`}
          color="bg-purple-100"
        />
        <MetricCard
          icon={<ListChecks className="w-6 h-6" />}
          title="Avg. Questions"
          value={stats.average_questions_per_quiz.toFixed(1)}
          color="bg-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Most Taken Quizzes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Popular Quizzes</h3>
          <div className="h-96">
            <Bar
              data={mostTakenData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: {
                  x: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>

        {/* Top Quizzes by Grade */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Highest Performing Quizzes</h3>
          <div className="h-96">
            <Bar
              data={topGradesData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
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
        {/* Most Taken Quizzes Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Attempted Quizzes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Quiz</th>
                  <th className="pb-3">Module</th>
                  <th className="pb-3 text-right">Attempts</th>
                </tr>
              </thead>
              <tbody>
                {stats.most_taken_quizzes.map((quiz, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3">{quiz.quiz_title}</td>
                    <td className="py-3 text-gray-600">{quiz.module_title}</td>
                    <td className="py-3 text-right font-semibold">
                      {quiz.taken_count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Quizzes by Grade Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Graded Quizzes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Quiz</th>
                  <th className="pb-3">Module</th>
                  <th className="pb-3 text-right">Avg. Grade</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_quizzes_by_grade.map((quiz, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3">{quiz.quiz_title}</td>
                    <td className="py-3 text-gray-600">{quiz.module_title}</td>
                    <td className="py-3 text-right font-semibold text-green-600">
                      {quiz.average_grade.toFixed(1)}%
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