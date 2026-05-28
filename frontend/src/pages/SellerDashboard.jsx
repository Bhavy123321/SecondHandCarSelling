import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Plus,
  Car,
  DollarSign,
  TrendingUp,
  Package,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import { motion } from "framer-motion";

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem("user"));

      const [listingsRes, salesRes] = await Promise.all([
        api.get(`/Car/seller/${user.userId}`),
        api.get(`/Purchase/seller/${user.userId}/sales`),
      ]);

      setListings(listingsRes.data);
      setSales(salesRes.data);

      const totalRevenue = salesRes.data.reduce(
        (sum, sale) => sum + sale.purchasePrice,
        0,
      );
      const activeListings = listingsRes.data.filter(
        (car) => car.statusName === "Available",
      ).length;
      const soldListings = listingsRes.data.filter(
        (car) => car.statusName === "Sold",
      ).length;

      setStats({
        totalListings: listingsRes.data.length,
        activeListings,
        soldListings,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, subtext, color = "primary" }) => {
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
              <Icon className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-black tracking-tight text-foreground/90">
              {loading ? <Skeleton className="h-9 w-24 rounded-lg" /> : value}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
              {subtext}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Seller Overview</h2>
          <p className="text-muted-foreground text-sm">
            Manage your inventory, evaluate pricing metrics, and track performance.
          </p>
        </div>
        <Link to="/sell">
          <Button className="gap-2 font-bold shadow-lg">
            <Plus className="h-4.5 w-4.5" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          subtext="Lifetime earnings"
          color="emerald"
        />
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          icon={Car}
          subtext="Currently on market"
          color="primary"
        />
        <StatCard
          title="Cars Sold"
          value={stats.soldListings}
          icon={TrendingUp}
          subtext="Successful sales"
          color="blue"
        />
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          icon={Package}
          subtext="All time inventory"
          color="amber"
        />
      </div>

      <div className="grid gap-6">
        <Card className="border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-md backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                Recent Inventory Listings
              </CardTitle>
              <CardDescription className="text-xs">Your most recently updated car listings.</CardDescription>
            </div>
            <Link to="/my-listings">
              <Button variant="ghost" size="sm" className="gap-1 font-semibold hover:bg-primary/10">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : listings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-b border-border/40">
                      <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Car Details</TableHead>
                      <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Price</TableHead>
                      <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Status</TableHead>
                      <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.slice(0, 5).map((car) => (
                      <TableRow key={car.carId} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground/90">
                              {car.brandName} {car.model}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                              {car.year} • {car.fuelType} • {car.transmission}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 font-bold text-foreground/95">
                          ${car.price?.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            className={`rounded-full px-2.5 py-0.5 font-semibold text-[10px] border shadow-sm ${
                              car.statusName === "Available"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground border-border/50"
                            }`}
                          >
                            {car.statusName}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <Link to={`/edit-car/${car.carId}`}>
                            <Button variant="outline" size="sm" className="font-bold hover:bg-primary hover:text-white transition-all text-xs h-8 px-3.5">
                              Edit
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/80">
                <Car className="h-12 w-12 mb-3 opacity-20 text-primary" />
                <p className="text-sm font-semibold">No listings yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Start listing your vehicles to see them here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
