import React, { useEffect, useState } from "react";
import api from "../services/api";
import CarCard from "../components/CarCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("All");
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

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

  // Derived state for filtering
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
    <div className="flex flex-col lg:flex-row gap-8 relative">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sidebar Filters */}
      <aside
        className={`
                fixed inset-0 z-40 bg-background p-6 transition-transform duration-300 transform 
                ${showFilters ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static lg:w-1/4 lg:p-0 lg:bg-transparent lg:z-auto lg:block
            `}
      >
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h3 className="text-lg font-bold">Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="bg-card rounded-xl border p-6 sticky top-24 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Refine Results</h3>
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => setFilterBrand("All")}
            >
              Reset
            </Button>
          </div>

          <div className="mb-8">
            <div className="mb-4 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Brands
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 py-2 cursor-pointer group hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={filterBrand === brand}
                    onChange={() => setFilterBrand(brand)}
                    className="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-sm font-medium flex-1">{brand}</span>
                  {brand !== "All" && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs font-normal"
                    >
                      {cars.filter((c) => c.brandName === brand).length}
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </div>
          {/* Add more filters here later (Price range, Year, etc.) */}
        </div>
      </aside>

      {/* Main Listings Content */}
      <section className="w-full lg:w-3/4">
        <div className="hidden lg:flex flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Premium Listings
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover {filteredCars.length} vehicles matching your criteria
            </p>
          </div>
          <div className="w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search make, model..."
              className="pl-9 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.carId} car={car} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-dashed">
            <p className="text-lg font-medium">No vehicles found</p>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search term.
            </p>
            <Button
              variant="outline"
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
