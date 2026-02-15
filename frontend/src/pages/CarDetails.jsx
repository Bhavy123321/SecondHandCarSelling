import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  Gauge,
  Settings,
  Fuel,
  ArrowLeft,
  User,
  ShoppingCart,
  Edit,
  Trash2,
  Shield,
  Info,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = user && car && user.userId == car.userId;
  const canBuy =
    user &&
    car &&
    user.userId != car.userId &&
    car.statusName === "Available" &&
    user.role !== "Admin";

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this car listing?`))
      return;

    try {
      await api.delete(`/Car/${id}`);
      navigate("/my-listings");
    } catch (error) {
      console.error("Error deleting car", error);
      setError("Failed to delete car. Please try again.");
    }
  };

  const fetchCar = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/Car/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error("Error fetching car details", error);
      if (error.response?.status === 404) {
        setError("Car not found. It may have been sold or removed.");
      } else {
        setError("Failed to load car details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <civ className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={fetchCar} variant="outline">
            Retry
          </Button>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </civ>
    );

  if (!car) return <div className="text-center py-20">Car not found.</div>;

  const imageUrl =
    car.imageUrl && car.imageUrl.length > 5
      ? car.imageUrl
      : `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop`;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg group">
            <img
              src={imageUrl}
              alt={`${car.brandName} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge className="text-sm px-3 py-1 font-bold shadow-sm backdrop-blur-md bg-white/90 text-black dark:bg-black/60 dark:text-white">
                {car.statusName}
              </Badge>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-muted/30 border-0">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Calendar className="h-5 w-5 text-primary mb-2" />
                <span className="font-bold text-lg">{car.year}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  Year
                </span>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-0">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Gauge className="h-5 w-5 text-primary mb-2" />
                <span className="font-bold text-lg">
                  {car.mileage?.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  km
                </span>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-0">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Fuel className="h-5 w-5 text-primary mb-2" />
                <span className="font-bold text-lg">{car.fuelType}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  Fuel
                </span>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-0">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Settings className="h-5 w-5 text-primary mb-2" />
                <span className="font-bold text-lg">{car.transmission}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  Gearbox
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Vehicle Description
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              {car.description || (
                <p className="italic text-muted-foreground/60">
                  No description provided by the seller.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">
                {car.brandName} {car.model}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">{car.title}</p>
              <div className="text-4xl font-black text-primary">
                ${car.price?.toLocaleString()}
              </div>
            </div>

            {/* Seller Card */}
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">
                    Seller
                  </p>
                  <p className="font-bold text-lg leading-tight">
                    {car.userName}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {isOwner && (
                <>
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Your Listing</AlertTitle>
                    <AlertDescription>
                      You are the owner of this listing.
                    </AlertDescription>
                  </Alert>

                  {car.statusName !== "Sold" && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/edit-car/${car.carId}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleDelete}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  )}
                </>
              )}

              {canBuy && (
                <Button
                  size="lg"
                  className="w-full text-lg h-14"
                  onClick={() => navigate(`/buy/${car.carId}`)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                </Button>
              )}

              {!canBuy && !isOwner && car.statusName === "Sold" && (
                <Button
                  size="lg"
                  variant="secondary"
                  disabled
                  className="w-full text-lg h-14"
                >
                  Vehicle Sold
                </Button>
              )}

              {!canBuy && !isOwner && user?.role === "Admin" && (
                <Alert className="mt-4">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Admin View</AlertTitle>
                  <AlertDescription>
                    Admin cannot purchase vehicles.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
