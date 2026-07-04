import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Edit, Trash2, Plus, Eye, Car, Package, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { motion } from "framer-motion";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.get(`/Car/seller/${user.userId}`);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings", error);
      setError("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (carId, carTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${carTitle}"?`))
      return;

    try {
      await api.delete(`/Car/${carId}`);
      setListings(listings.filter((car) => car.carId !== carId));
    } catch (error) {
      console.error("Error deleting car", error);
      alert("Failed to delete car");
    }
  };

  const activeListings = listings.filter(c => c.statusName === "Available").length;
  const soldListings = listings.filter(c => c.statusName === "Sold").length;

  const StatCard = ({ title, value, icon: Icon, subtext, color = "primary" }) => {
    const colorClasses = {
      primary: "text-primary bg-primary/10 border-primary/20",
      emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
      blue: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
      amber: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
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
        <Button onClick={fetchListings}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">My Listings</h1>
          <p className="text-muted-foreground text-sm">Manage your vehicle sales inventory and track performance.</p>
        </div>
        <Link to="/sell">
          <Button className="gap-2 font-bold shadow-lg">
            <Plus className="h-4 w-4" /> Add New Car
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Listings" value={listings.length} icon={Package} subtext="All time inventory" color="amber" />
        <StatCard title="Active Listings" value={activeListings} icon={Car} subtext="Currently on market" color="primary" />
        <StatCard title="Cars Sold" value={soldListings} icon={TrendingUp} subtext="Successful sales" color="blue" />
        <motion.div whileHover={{ y: -4 }} className="h-full">
          <Link to="/sell" className="block h-full">
            <Card className="overflow-hidden border border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-sm relative group h-full transition-colors cursor-pointer">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardContent className="p-5 flex items-center justify-between h-full">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Quick Action</p>
                  <p className="text-lg font-black text-foreground mt-3">New Listing →</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">Add a vehicle to sell</p>
                </div>
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/20 text-primary">
                  <Plus size={22} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      <Card className="border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-md backdrop-blur-md">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Inventory
              </CardTitle>
              <CardDescription className="text-xs">You have {listings.length} vehicle(s) listed.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : listings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b border-border/40">
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Car Details</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Price</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Status</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Date Listed</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((car) => (
                    <TableRow key={car.carId} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-20 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/30">
                            {car.imageUrl ? (
                              <img src={car.imageUrl} alt={car.model} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                <Car className="h-5 w-5 opacity-30" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground/90">{car.brandName} {car.model}</span>
                            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">{car.year} • {car.fuelType}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 font-bold text-foreground/95">${car.price?.toLocaleString()}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge className={`rounded-full px-2.5 py-0.5 font-semibold text-[10px] border shadow-sm ${
                          car.statusName === "Available"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : car.statusName === "Sold"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
                            : "bg-muted text-muted-foreground border-border/50"
                        }`}>
                          {car.statusName}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-sm text-muted-foreground">
                        {car.createdDate ? new Date(car.createdDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/cars/${car.carId}`}>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {car.statusName !== "Sold" && (
                            <>
                              <Link to={`/edit-car/${car.carId}`}>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(car.carId, `${car.brandName} ${car.model}`)} className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Car className="h-12 w-12 mb-3 opacity-20 text-primary" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No listings yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Start listing your vehicles to see them here.</p>
              <Link to="/sell">
                <Button variant="outline" size="sm" className="font-bold text-xs">Add Your First Car</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyListings;
