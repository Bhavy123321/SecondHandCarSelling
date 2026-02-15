import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  DollarSign,
  Check,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";

const BuyCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/Car/${id}`);
        setCar(response.data);
      } catch (error) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setPurchasing(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.post("/Purchase", {
        carId: parseInt(id),
        userId: user.userId,
        purchasePrice: car.price,
        paymentMethod,
      });

      // Success - redirect to purchases
      navigate("/my-purchases");
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to complete purchase. Please try again.";
      alert(errorMsg); // Using alert for now as immediate feedback, could be a toast
    } finally {
      setPurchasing(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );

  if (error || !car)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error || "Car not found"}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/")}>Back to Browse</Button>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 pl-0"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your purchase securely.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="h-48 bg-muted relative">
            {car.imageUrl ? (
              <img
                src={car.imageUrl}
                alt={car.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No Image Available
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="text-white">
                <h3 className="font-bold text-xl">
                  {car.brandName} {car.model}
                </h3>
                <p className="opacity-90">{car.title}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-3 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vehicle Price</span>
                <span className="font-medium">
                  ${car.price?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Taxes & Fees (Est.)
                </span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-3 mt-3">
                <span>Total Due</span>
                <span className="text-primary text-2xl">
                  ${car.price?.toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment">Payment Method</Label>
                <Select
                  id="payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash">Cash Payment</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Financing">Financing</option>
                </Select>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-300">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Secure Transaction</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Your purchase is protected. By confirming, you agree to our
                  terms of service.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-12"
                disabled={purchasing}
              >
                {purchasing ? (
                  <>Processing...</>
                ) : (
                  <>
                    Confirm Purchase <Check className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyCar;
