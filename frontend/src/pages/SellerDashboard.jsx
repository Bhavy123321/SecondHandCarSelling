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

  const StatCard = ({ title, value, icon: Icon, subtext }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-20" /> : value}
        </div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seller Overview</h2>
          <p className="text-muted-foreground">
            Manage your inventory and track performance.
          </p>
        </div>
        <Link to="/sell">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          subtext="Lifetime earnings"
        />
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          icon={Car}
          subtext="Currently on market"
        />
        <StatCard
          title="Cars Sold"
          value={stats.soldListings}
          icon={TrendingUp}
          subtext="Successful sales"
        />
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          icon={Package}
          subtext="All time inventory"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Listings</CardTitle>
              <CardDescription>Your most recent car listings.</CardDescription>
            </div>
            <Link to="/my-listings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : listings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car Details</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.slice(0, 5).map((car) => (
                    <TableRow key={car.carId}>
                      <TableCell className="font-medium">
                        <div>
                          <span className="block">
                            {car.brandName} {car.model}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {car.year} • {car.fuelType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>${car.price?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            car.statusName === "Available"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {car.statusName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/edit-car/${car.carId}`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/80">
                <Car className="h-10 w-10 mb-2 opacity-20" />
                <p>No listings yet. Start selling today!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
