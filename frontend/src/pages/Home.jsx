import React, { useEffect, useState } from "react";
import api from "../services/api";
import CarCard from "../components/CarCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Filter, X, Sparkles } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/Car");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars", error);
      setError("Failed to load car listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const brands = ["All", ...new Set(cars.map((c) => c.brandName))];
  const filteredCars = cars.filter((car) => {
    const matchesBrand = filterBrand === "All" || car.brandName === filterBrand;
    const matchesSearch =
      car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchCars}>Retry</Button>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative py-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex gap-2 w-full">
        <Button
          variant="outline"
          className="flex-1 font-bold text-xs h-10"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-9.5 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sidebar Filters */}
      <AnimatePresence>
        {(showFilters || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <aside
            className={`
              fixed inset-0 z-40 bg-background/95 backdrop-blur-md p-6 transition-all duration-300
              lg:translate-x-0 lg:static lg:w-1/4 lg:p-0 lg:bg-transparent lg:z-auto lg:block
              ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h3 className="text-base font-bold uppercase tracking-wider">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="bg-card/60 dark:bg-slate-900/40 rounded-2xl border border-border/40 p-5 sticky top-24 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-primary" />
                  Refine Results
                </h3>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-primary font-bold hover:no-underline hover:text-primary/80"
                  onClick={() => setFilterBrand("All")}
                >
                  Reset
                </Button>
              </div>

              <div>
                <div className="mb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Brands
                </div>
                <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1.5 custom-scrollbar">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className={`flex items-center gap-3 py-2 cursor-pointer group hover:bg-muted/50 rounded-xl px-2.5 -mx-1.5 transition-all duration-200 border border-transparent ${
                        filterBrand === brand ? "bg-primary/5 border-primary/20" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="brand"
                        checked={filterBrand === brand}
                        onChange={() => setFilterBrand(brand)}
                        className="h-4 w-4 rounded-full border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className={`text-xs font-bold transition-colors ${
                        filterBrand === brand ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                      }`}>{brand === "All" ? "All Brands" : brand}</span>
                      {brand !== "All" && (
                        <Badge
                          variant="secondary"
                          className="ml-auto text-[10px] px-1.5 py-0 border border-border/40 font-semibold"
                        >
                          {cars.filter((c) => c.brandName === brand).length}
                        </Badge>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Main Listings Content */}
      <section className="w-full lg:w-3/4">
        <div className="hidden lg:flex flex-row items-center justify-between mb-6 gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              Premium Listings
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              Discover {filteredCars.length} vehicles matching your criteria
            </p>
          </div>
          <div className="w-72 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search make, model..."
              className="pl-9.5 bg-card/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredCars.map((car, idx) => (
              <motion.div
                key={car.carId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card/25 rounded-2xl border border-dashed border-border/80">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No vehicles found</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Try adjusting your filters or search term.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="font-bold text-xs"
              onClick={() => {
                setFilterBrand("All");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
