import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, User, MoreVertical, Eye } from "lucide-react";
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
      c.brandName.toLowerCase().includes(search.toLowerCase()) ||
      c.model.toLowerCase().includes(search.toLowerCase()) ||
      c.userName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Manage Listings
          </h1>
          <p className="text-muted-foreground">
            Admin control for all platform listings.
          </p>
        </div>
        <Input
          placeholder="Search cars, sellers..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
          <CardDescription>
            Total {cars.length} vehicles listed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car Info</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                      <TableRow key={car.carId}>
                        <TableCell>
                          <div className="font-medium">
                            {car.brandName} {car.model}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {car.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{car.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>${car.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              car.statusName === "Available"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {car.statusName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/cars/${car.carId}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                handleDelete(
                                  car.carId,
                                  `${car.brandName} ${car.model}`,
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No results found.
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
