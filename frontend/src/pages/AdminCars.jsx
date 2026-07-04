import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, User, Eye, Edit, Search, Car, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/Car");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars", error);
      setError("Failed to load car listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (carId, carTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${carTitle}"?`))
      return;

    try {
      await api.delete(`/Car/${carId}`);
      setCars(cars.filter((c) => c.carId !== carId));
    } catch (error) {
      console.error("Error deleting car", error);
      alert("Failed to delete car");
    }
  };

  const filteredCars = cars.filter(
    (c) =>
      c.brandName?.toLowerCase().includes(search.toLowerCase()) ||
      c.model?.toLowerCase().includes(search.toLowerCase()) ||
      c.userName?.toLowerCase().includes(search.toLowerCase()),
  );

  const availableCars = cars.filter(c => c.statusName === "Available").length;
  const soldCars = cars.filter(c => c.statusName === "Sold").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Manage Listings</h1>
          <p className="text-muted-foreground text-sm">Admin control for all platform vehicle listings.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
          <Input
            placeholder="Search cars, sellers..."
            className="pl-9 bg-card/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div whileHover={{ y: -4 }}>
          <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-all duration-300" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Vehicles</p>
                <p className="text-3xl font-black text-foreground mt-1.5">{loading ? "..." : cars.length}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">Platform listings</p>
              </div>
              <div className="p-3 rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Car size={22} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/70" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Available</p>
                <p className="text-3xl font-black text-foreground mt-1.5">{loading ? "..." : availableCars}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">Active on market</p>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                <Eye size={22} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/70" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sold</p>
                <p className="text-3xl font-black text-foreground mt-1.5">{loading ? "..." : soldCars}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">Completed sales</p>
              </div>
              <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
                <CheckCircle size={22} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-md backdrop-blur-md">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                All Vehicles
              </CardTitle>
              <CardDescription className="text-xs">Total {cars.length} vehicles listed.</CardDescription>
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b border-border/40">
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Car Info</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Seller</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Price</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground">Status</TableHead>
                    <TableHead className="py-3 px-6 text-xs font-bold uppercase text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                      <TableRow key={car.carId} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                        <TableCell className="py-4 px-6">
                          <div className="font-bold text-foreground/90">{car.brandName} {car.model}</div>
                          <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{car.title}</div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{car.userName}</span>
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
                        <TableCell className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={`/cars/${car.carId}`}>
                              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/edit-car/${car.carId}`}>
                              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(car.carId, `${car.brandName} ${car.model}`)} className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {search ? "No results found matching your search." : "No vehicles listed yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCars;
