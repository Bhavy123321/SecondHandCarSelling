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
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

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

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchPurchases}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">My Purchases</h1>
        <p className="text-muted-foreground">History of your acquisitions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Total Vehicles
              </p>
              <p className="text-4xl font-black mt-2">
                {loading ? "..." : purchases.length}
              </p>
            </div>
            <ShoppingBag className="h-12 w-12 text-green-100 opacity-20" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">
                Total Investment
              </p>
              <p className="text-4xl font-black mt-2">
                {loading ? "..." : `$${totalSpent.toLocaleString()}`}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-indigo-100 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="grid gap-6">
          {purchases.map((purchase) => (
            <Card
              key={purchase.purchaseId}
              className="overflow-hidden hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 h-48 md:h-auto relative bg-muted">
                  {purchase.car?.imageUrl ? (
                    <img
                      src={purchase.car.imageUrl}
                      alt={purchase.car.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">
                          {purchase.car?.brandName} {purchase.car?.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {purchase.car?.title}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                        {purchase.status || "Completed"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Date
                        </span>
                        <span className="font-medium text-sm">
                          {new Date(purchase.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CreditCard className="h-3 w-3" /> Payment
                        </span>
                        <span className="font-medium text-sm">
                          {purchase.paymentMethod}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> Seller
                        </span>
                        <span className="font-medium text-sm">
                          {purchase.car?.sellerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-2xl font-black text-primary">
                      ${purchase.purchasePrice?.toLocaleString()}
                    </div>
                    <Link to={`/cars/${purchase.carId}`}>
                      <Button variant="outline" className="gap-2">
                        View Vehicle <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center border-dashed">
          <CardContent>
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground mb-6">
              Start browsing our premium collection today.
            </p>
            <Link to="/">
              <Button>Browse Vehicles</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyPurchases;
