import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Edit, Trash2, Plus, Eye, MoreHorizontal } from "lucide-react";
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

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchListings}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">
            Manage your vehicle sales inventory.
          </p>
        </div>
        <Link to="/sell">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Car
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            You have {listings.length} vehicle(s) listed.
          </CardDescription>
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
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Car Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Listed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((car) => (
                  <TableRow key={car.carId}>
                    <TableCell>
                      <div className="h-12 w-20 rounded-md bg-muted overflow-hidden">
                        {car.imageUrl ? (
                          <img
                            src={car.imageUrl}
                            alt={car.model}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-xs text-muted-foreground">
                            No Img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold">
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
                            ? "outline"
                            : "secondary"
                        }
                        className={
                          car.statusName === "Available"
                            ? "border-primary text-primary"
                            : ""
                        }
                      >
                        {car.statusName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(car.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/cars/${car.carId}`}>
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {car.statusName !== "Sold" && (
                          <>
                            <Link to={`/edit-car/${car.carId}`}>
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(
                                  car.carId,
                                  `${car.brandName} ${car.model}`,
                                )
                              }
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Delete"
                            >
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No listings found. Start by adding a car!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyListings;
