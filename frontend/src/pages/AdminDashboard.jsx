import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Users, Car, TrendingUp, Package, Sparkles, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { motion } from "framer-motion";

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

  const StatCard = ({ title, value, icon: Icon, description, loading, color = "primary" }) => {
    const colorClasses = {
      primary: "text-primary bg-primary/10 border-primary/20",
      emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
      blue: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
      amber: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
    };
    
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 dark:bg-primary/20 group-hover:bg-primary transition-all duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
            <div className={`p-2 rounded-xl border ${colorClasses[color]}`}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold tracking-tight text-foreground/90">
              {loading ? <Skeleton className="h-8 w-20 rounded-lg" /> : value}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
              {description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">System Console</h2>
          <p className="text-muted-foreground text-xs">
            Overview of system performance, metrics, and core parameters.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered active users"
          loading={stats.loading}
          color="primary"
        />
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={Car}
          description="Vehicles listed for sale"
          loading={stats.loading}
          color="blue"
        />
        <StatCard
          title="Active Sessions"
          value="+573"
          icon={TrendingUp}
          description="+201 since last hour"
          loading={false}
          color="emerald"
        />
        <StatCard
          title="Gross Valuation"
          value="$45,231"
          icon={Package}
          description="+20.1% from last month"
          loading={false}
          color="amber"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-border/40 bg-card/65 dark:bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-[18px] w-[18px] text-primary" />
              Administrative Actions
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access controls for user accounts and vehicle lists.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/users" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl group border-border/50"
                >
                  <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="font-bold text-[10px] uppercase tracking-wider text-foreground/80 group-hover:text-foreground">Manage Users</span>
                </Button>
              </Link>
              <Link to="/admin/cars" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl group border-border/50"
                >
                  <Car className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="font-bold text-[10px] uppercase tracking-wider text-foreground/80 group-hover:text-foreground">Manage Cars</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border border-border/40 bg-card/65 dark:bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="h-[18px] w-[18px] text-primary" />
              Recent System Activity
            </CardTitle>
            <CardDescription className="text-xs">Latest administrative actions.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start border-l-2 border-primary/45 pl-3 py-0.5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold leading-none text-foreground/90">
                    Console Redesign
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                    Premium Admin dashboard interface compiled.
                  </p>
                </div>
                <div className="ml-auto font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
                  Just now
                </div>
              </div>
              <div className="flex items-start border-l-2 border-border/70 pl-3 py-0.5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold leading-none text-foreground/80">
                    New Registration
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                    Buyer account registered successfully.
                  </p>
                </div>
                <div className="ml-auto font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
                  3m ago
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
