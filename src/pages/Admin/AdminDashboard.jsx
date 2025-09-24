import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useAxios from "@/utils/useAxios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios=useAxios()
  const navigate=useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios("/api/accounts/admin/dashboard");
        const result = response.data;
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardCards = [
    { name: "Users", count: data?.users,},
    { name: "Courses", count: data?.courses, },
    { name: "Enrollments", count: data?.enrollments,},
    { name: "Categories", count: data?.categories,},
    { name: "Materials", count: data?.materials,},
    { name: "Modules", count: data?.modules,  },
    { name: "Lessons", count: data?.lessons,  },
    { name: "Quizzes", count: data?.quizzes, },
    { name: "Questions", count: data?.questions,  },
    { name: "Assignments", count: data?.assignments, },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="flex m-6 justify-end"><Button onClick={()=>{navigate('/admin/create')}}>Create Admin</Button></div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">Administration Dashboard</p>
      </div>

      {/* Revenue Card */}
      <Card className="mb-8 p-6 bg-indigo-600 text-white">
        <h2 className="text-2xl font-bold mb-2">Total Revenue</h2>
        <div className="flex items-center justify-between">
          <p className="text-4xl font-bold">
            ${data?.revenue?.toLocaleString() || 0}
          </p>
          <span className="text-sm bg-indigo-700 px-3 py-1 rounded-full">
            Lifetime Earnings
          </span>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dashboardCards.map((card) => (
          <Card
            key={card.name}
            className="p-6 hover:bg-accent transition-colors "
          >
            <div className="flex flex-col items-start">
              <span className="text-4xl font-bold mb-2">
                {(card.count || 0).toLocaleString()}
              </span>
              <span className="text-muted-foreground">{card.name}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}