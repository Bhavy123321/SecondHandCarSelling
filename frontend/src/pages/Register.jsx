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
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
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
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digits }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
    <div className="min-h-screen relative flex items-center justify-center bg-muted/5 dark:bg-slate-950/10 p-4 py-8 overflow-hidden">
      {/* Visual background decorative ambient orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/8 dark:bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-baltic-blue-500/8 dark:bg-baltic-blue-500/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-t-4 border-t-primary shadow-2xl backdrop-blur-xl bg-card/60 dark:bg-slate-900/40 premium-glow-primary">
          <CardHeader className="space-y-1.5 text-center pb-4">
            <div className="flex justify-center mb-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="size-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25"
              >
                <Car size={24} />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Create an account
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Join AutoPremium to buy or sell luxury vehicles
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2.5 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-xs font-semibold text-foreground/80">Username</Label>
                  <Input
                    id="userName"
                    placeholder="username"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-semibold text-foreground/80">I want to</Label>
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
                <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email</Label>
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
                <Label htmlFor="phone" className="text-xs font-semibold text-foreground/80">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit Indian number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <p className="text-[0.72rem] text-muted-foreground/85">
                  Must be at least 8 characters long
                </p>
              </div>

              <Button type="submit" className="w-full mt-2 font-bold" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t border-border/40 p-5 bg-muted/5 dark:bg-slate-900/10 rounded-b-2xl">
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
