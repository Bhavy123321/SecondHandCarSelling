import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Users, Car, TrendingUp, Package, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, carsRes] = await Promise.all([
          api.get("/User"),
          api.get("/Car"),
        ]);
        setStats({
          totalUsers: usersRes.data.length,
          totalCars: carsRes.data.length,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, description, loading }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of system performance and metrics.
          </p>
        </div>
        {/* Optional: Add Date Range Picker here */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered active users"
          loading={stats.loading}
        />
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={Car}
          description="Vehicles listed for sale"
          loading={stats.loading}
        />
        {/* Placeholders for future metrics */}
        <StatCard
          title="Active Sessions"
          value="+573"
          icon={TrendingUp}
          description="+201 since last hour"
          loading={false}
        />
        <StatCard
          title="Revenue"
          value="$45,231.89"
          icon={Package}
          description="+20.1% from last month"
          loading={false}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Quick administrative actions and system health.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/users">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
                >
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link to="/admin/cars">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
                >
                  <Car className="h-6 w-6" />
                  <span>Manage Cars</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    System Update
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dashboard redesigned successfully.
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">
                  Just now
                </div>
              </div>
              {/* Dummy data for visual completion */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New User Registered
                  </p>
                  <p className="text-sm text-muted-foreground">
                    user@example.com joined.
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">
                  2m ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
