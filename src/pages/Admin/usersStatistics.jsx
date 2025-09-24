import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from 'react-hot-toast';
import useAxios from '@/utils/useAxios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function UserStatistics() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/admin/statistics/users/');
        setStatsData(response.data);
      } catch  {
        setError('Failed to load statistics');
        toast.error('Failed to fetch user statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
        {error || 'No statistics data available'}
      </div>
    );
  }

  // Doughnut chart data (User Roles)
  const rolesChartData = {
    labels: statsData.user_roles.map(role => role.role),
    datasets: [{
      data: statsData.user_roles.map(role => role.role_count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  // Bar chart data (Active/Inactive/Pending)
  const statusChartData = {
    labels: ['Active', 'Inactive', 'Pending'],
    datasets: [{
      label: 'User Status',
      data: [
        statsData.active_users,
        statsData.inactive_users,
        statsData.pending_verifications
      ],
      backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
      borderWidth: 0
    }]
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-4xl font-bold text-primary">{statsData.total_users}</p>
        </Card>
        
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-4xl font-bold text-green-600">{statsData.active_users}</p>
        </Card>
        
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold">Pending Verifications</h3>
          <p className="text-4xl font-bold text-yellow-600">{statsData.pending_verifications}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Roles Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={rolesChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Status Overview</h3>
          <div className="h-64">
            <Bar
              data={statusChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 20 } }
                },
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}