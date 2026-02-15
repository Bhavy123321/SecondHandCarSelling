import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Car, AlertCircle } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "", // ✅ backend expects phone (10-digit)
    role: "Buyer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    // ✅ keep only digits, max 10 (Indian mobile)
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digits }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ quick frontend validation
    if (formData.phone.length !== 10) {
      setLoading(false);
      setError("Phone number must be a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      await api.post("/User", {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });

      navigate("/login");
    } catch (err) {
      console.error(err);

      // ✅ show backend validation errors nicely
      const data = err.response?.data;
      const phoneErrors = data?.errors?.Phone?.join(" ");
      const anyErrors =
        data?.errors && typeof data.errors === "object"
          ? Object.values(data.errors).flat().join(" ")
          : null;

      setError(
        phoneErrors ||
        anyErrors ||
        data?.title ||
        data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
              <Car size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Join AutoPremium to buy or sell luxury vehicles
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  placeholder="johndoe"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I want to</Label>
                <Select
                  id="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full"
                >
                  <option value="Buyer">Buy Cars</option>
                  <option value="Seller">Sell Cars</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit Indian number (e.g. 9876543210)"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t p-6 bg-muted/10">
          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
