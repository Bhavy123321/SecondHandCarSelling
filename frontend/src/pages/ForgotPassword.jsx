import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Car, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post("/Auth/reset-password", {
        userName,
        email,
        newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === "string" ? err.response.data : "Failed to reset password. Please check your credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center bg-muted/5 dark:bg-slate-950/10 p-4 py-6 overflow-y-auto scrollbar-hidden">
      {/* Visual background decorative ambient orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/8 dark:bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-baltic-blue-500/8 dark:bg-baltic-blue-500/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[24rem] z-10"
      >
        <Card className="border-t-4 border-t-primary shadow-2xl backdrop-blur-xl bg-card/60 dark:bg-slate-900/40 premium-glow-primary">
          <CardHeader className="space-y-1 text-center pb-3 pt-5">
            <div className="flex justify-center mb-2">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="size-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25"
              >
                <Car size={24} />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Reset Password
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your details to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <Alert variant="destructive" className="py-2.5 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50/60 dark:bg-green-950/20 text-green-900 dark:text-green-300 border-green-200/50 py-2.5 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-sm font-semibold">Success</AlertTitle>
                  <AlertDescription className="text-xs">
                  Password reset successfully!{" "}
                  <Link to="/login" className="font-bold underline underline-offset-2">Sign in now</Link>
                </AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-semibold text-foreground/80">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ex: johndoe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={success}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={success}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-semibold text-foreground/80">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={success}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full mt-2 font-bold" disabled={loading || success}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-1.5 border-t border-border/40 py-3 bg-muted/5 dark:bg-slate-900/10 rounded-b-2xl">
            <p className="text-xs text-center text-muted-foreground">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-bold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
