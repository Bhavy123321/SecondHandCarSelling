import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Check,
  ArrowLeft,
  ShieldCheck,
  Car,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { motion } from "framer-motion";

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
      navigate("/my-purchases");
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to complete purchase. Please try again.";
      alert(errorMsg);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-xl mx-auto py-12 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
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
    <div className="max-w-xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Checkout</h1>
          <p className="text-muted-foreground text-sm">Complete your purchase securely.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border border-border/40 shadow-xl backdrop-blur-md bg-card/80">
            <div className="h-52 bg-muted relative overflow-hidden">
              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={car.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Car className="h-12 w-12 opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-2xl">{car.brandName} {car.model}</h3>
                  <p className="opacity-80 text-sm">{car.title}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-4 pb-6 border-b border-border/40">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle Price</span>
                  <span className="font-bold text-foreground">${car.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Fees (Est.)</span>
                  <span className="font-bold text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-border/40 pt-4 mt-4">
                  <span>Total Due</span>
                  <span className="text-primary text-3xl font-black">${car.price?.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handlePurchase} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="payment" className="text-xs font-semibold text-foreground/80">Payment Method</Label>
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

                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 rounded-xl">
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>Secure Transaction</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    Your purchase is protected. By confirming, you agree to our terms of service.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-12 font-bold shadow-lg"
                  disabled={purchasing}
                >
                  {purchasing ? (
                    <span className="flex items-center gap-2">Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Confirm Purchase <Check className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyCar;
