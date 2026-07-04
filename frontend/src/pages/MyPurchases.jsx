import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  ExternalLink,
  Package,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { motion } from "framer-motion";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.get(`/Purchase/buyer/${user.userId}`);
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases", error);
      setError("Failed to load your purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const totalSpent = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);

  const StatCard = ({ title, value, icon: Icon, subtext, color = "primary" }) => {
    const colorClasses = {
      primary: "text-primary bg-primary/10 border-primary/20",
      emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
      blue: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
      indigo: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400",
    };
    return (
      <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 dark:bg-primary/20 group-hover:bg-primary transition-all duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
            <div className={`p-2 rounded-xl border ${colorClasses[color]}`}>
              <Icon className="h-4 w-4" />
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
        <Button onClick={fetchPurchases}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">My Purchases</h1>
        <p className="text-muted-foreground text-sm">History of your acquisitions and investment overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Vehicles Purchased" value={purchases.length} icon={Package} subtext="Total acquisitions" color="emerald" />
        <StatCard title="Total Investment" value={`$${totalSpent.toLocaleString()}`} icon={DollarSign} subtext="Lifetime spend" color="indigo" />
        <motion.div whileHover={{ y: -4 }} className="h-full">
          <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/70" />
            <CardContent className="p-5 flex items-center justify-between h-full">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg. per Vehicle</p>
                <p className="text-3xl font-black text-foreground mt-1.5">
                  {purchases.length > 0 ? `$${(totalSpent / purchases.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "$0"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1.5">Average purchase price</p>
              </div>
              <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
                <TrendingUp size={22} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="h-full">
          <Link to="/" className="block h-full">
            <Card className="overflow-hidden border border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-sm relative group h-full transition-colors cursor-pointer">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardContent className="p-5 flex items-center justify-between h-full">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Marketplace</p>
                  <p className="text-lg font-black text-foreground mt-3">Browse Cars →</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">Find your next vehicle</p>
                </div>
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/20 text-primary">
                  <ShoppingBag size={22} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-black tracking-tight">Purchase History</h2>
          </div>
          <div className="grid gap-6">
            {purchases.map((purchase, idx) => (
              <motion.div
                key={purchase.purchaseId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/40 bg-card/65 dark:bg-slate-900/40 backdrop-blur-md">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 h-52 md:h-auto relative bg-muted/40 overflow-hidden">
                      {purchase.car?.imageUrl ? (
                        <img
                          src={purchase.car.imageUrl}
                          alt={purchase.car.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <ShoppingBag className="h-10 w-10 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-500/90 text-white border-0 text-[10px] font-bold px-2.5 py-1 shadow-lg">
                          {purchase.status || "Completed"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-foreground/90">
                              {purchase.car?.brandName} {purchase.car?.model}
                            </h3>
                            <p className="text-sm text-muted-foreground">{purchase.car?.title}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-muted/30">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold uppercase tracking-wider">
                              <Calendar className="h-3 w-3" /> Date
                            </span>
                            <span className="font-bold text-sm">{new Date(purchase.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-muted/30">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold uppercase tracking-wider">
                              <CreditCard className="h-3 w-3" /> Payment
                            </span>
                            <span className="font-bold text-sm truncate">{purchase.paymentMethod}</span>
                          </div>
                          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-muted/30">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold uppercase tracking-wider">
                              <User className="h-3 w-3" /> Seller
                            </span>
                            <span className="font-bold text-sm truncate">{purchase.car?.sellerName || "—"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Paid</span>
                          <div className="text-2xl font-black text-primary">${purchase.purchasePrice?.toLocaleString()}</div>
                        </div>
                        <Link to={`/cars/${purchase.carId}`}>
                          <Button variant="outline" className="gap-2 font-bold">
                            View Vehicle <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <Card className="py-16 border border-dashed border-border/60 rounded-2xl bg-card/20 text-center">
          <CardContent>
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-foreground/80 mb-2">No purchases yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Start browsing our premium collection today.</p>
            <Link to="/">
              <Button className="font-bold">Browse Vehicles</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyPurchases;
