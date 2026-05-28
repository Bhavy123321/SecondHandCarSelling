import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import CarCard from "../components/CarCard";
import { Search, ShoppingCart, TrendingUp, Package, Sparkles } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const BuyerDashboard = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem("user"));

      const [carsRes, purchasesRes] = await Promise.all([
        api.get("/Car/available"),
        api.get(`/Purchase/buyer/${user.userId}`),
      ]);

      setCars(carsRes.data);
      setFilteredCars(carsRes.data);
      setPurchases(purchasesRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to load available cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = cars;

    if (selectedBrand !== "All") {
      filtered = filtered.filter((car) => car.brandName === selectedBrand);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCars(filtered);
  }, [searchTerm, selectedBrand, cars]);

  const brands = ["All", ...new Set(cars.map((car) => car.brandName))];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive font-medium text-center">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );

  return (
    <div className="py-4 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="h-full">
          <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/70" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Available Inventory</p>
                <p className="text-3xl font-black text-foreground mt-1.5">{cars.length}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">Premium vehicles online</p>
              </div>
              <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
                <ShoppingCart size={22} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="h-full">
          <Card className="overflow-hidden border border-border/40 bg-card/65 dark:bg-slate-900/40 shadow-sm relative group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/70" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">My Purchases</p>
                <p className="text-3xl font-black text-foreground mt-1.5">{purchases.length}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">Acquisitions locked in</p>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                <TrendingUp size={22} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="h-full">
          <Link to="/my-purchases" className="block h-full">
            <Card className="overflow-hidden border border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-sm relative group h-full transition-colors cursor-pointer">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">History & Delivery</p>
                  <p className="text-lg font-black text-foreground mt-3">Order Ledger →</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">View detailed statements</p>
                </div>
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/20 text-primary">
                  <Package size={22} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-black tracking-tight">Browse Luxury Inventory</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground/60"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search by make, model, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-card/50"
            />
          </div>
          <div className="w-full md:w-56">
            <Select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === "All" ? "All Brands" : brand}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      {filteredCars.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCars.map((car, idx) => (
            <motion.div
              key={car.carId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card/20">
          <p className="text-muted-foreground font-semibold">
            No premium vehicles found matching your criteria.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1">Try resetting your brand filter or search query.</p>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
