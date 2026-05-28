import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle, Image as ImageIcon, Link as LinkIcon, Sparkles, Eye, Info } from "lucide-react";
import { motion } from "framer-motion";

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    model: "",
    brandId: 1,
    statusId: 1,
    year: new Date().getFullYear(),
    price: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    description: "",
    contactNumber: "",
    userId: user?.userId,
    imageId: 1,
    imageUrl: "",
  });

  const [brands, setBrands] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [brandsRes, statusRes] = await Promise.all([
          api.get("/CarBrands"),
          api.get("/CarStatus")
        ]);

        const brandsData = brandsRes.data.map(b => ({ id: b.brandId, name: b.brandName }));
        const statusData = statusRes.data.map(s => ({ id: s.statusId, name: s.statusName }));
        
        setBrands(brandsData);
        setStatuses(statusData);

        if (brandsData.length > 0) {
          setFormData(prev => ({ ...prev, brandId: brandsData[0].id }));
        }
        if (statusData.length > 0) {
          const availableStatus = statusData.find(s => s.name === "Available") || statusData[0];
          setFormData(prev => ({ ...prev, statusId: availableStatus.id }));
        }
      } catch (error) {
        console.error("Error fetching reference data", error);
        setError("Failed to load reference data. Please refresh the page.");
      }
    };
    fetchReferenceData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        UserId: user?.userId || JSON.parse(localStorage.getItem("user"))?.userId,
        BrandId: parseInt(formData.brandId),
        StatusId: parseInt(formData.statusId),
        ImageId: 1,
        Title: formData.title,
        Model: formData.model,
        Year: parseInt(formData.year),
        Price: parseFloat(formData.price),
        Mileage: parseInt(formData.mileage),
        FuelType: formData.fuelType,
        Transmission: formData.transmission,
        Description: formData.description,
        ContactNumber: formData.contactNumber,
      };

      const carResponse = await api.post("/Car", payload);
      const carId = carResponse.data.carId;

      if (formData.imageUrl && formData.imageUrl.trim() !== "") {
        try {
          await api.post("/CarImages/url", {
            carId: carId,
            imageUrl: formData.imageUrl,
          });
        } catch (imgError) {
          console.error("Error adding image:", imgError);
        }
      }

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error adding car", error);
      setLoading(false);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to add car. Please check your inputs and try again.";
      setError(errorMsg);
    }
  };

  const selectedBrandName = brands.find(b => b.id == formData.brandId)?.name || "Luxury Brand";
  const previewCar = {
    brandName: selectedBrandName,
    model: formData.model || "Model Name",
    title: formData.title || "Vehicle Listing Title",
    price: formData.price ? parseFloat(formData.price) : 0,
    year: formData.year,
    fuelType: formData.fuelType,
    transmission: formData.transmission,
    imageUrl: formData.imageUrl,
    statusName: statuses.find(s => s.id == formData.statusId)?.name || "Available",
  };

  return (
    <div className="py-4">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">List Your Vehicle</h1>
        <p className="text-muted-foreground text-sm">Create a premium, high-density listing to reach serious buyers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Form elements */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-xl animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Part 1: Vehicle Information */}
            <Card className="shadow-md bg-card/45 border-border/40 premium-glow-primary">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground/90">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  Vehicle Identification
                </CardTitle>
                <CardDescription className="text-xs">Provide core specifications of the car.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-semibold text-foreground/80">Listing Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Pristine Condition BMW M4 - Low Mileage"
                    onChange={handleChange}
                    value={formData.title}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandId" className="text-xs font-semibold text-foreground/80">Brand</Label>
                    <Select
                      id="brandId"
                      onChange={handleChange}
                      value={formData.brandId}
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-xs font-semibold text-foreground/80">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g. M4 Competition"
                      onChange={handleChange}
                      value={formData.model}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part 2: Technical Specifications */}
            <Card className="shadow-md bg-card/45 border-border/40">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground/90">
                  <Info className="h-4.5 w-4.5 text-primary" />
                  Specifications & Price
                </CardTitle>
                <CardDescription className="text-xs">Detail the running mechanics and pricing parameters.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-xs font-semibold text-foreground/80">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max="2027"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-xs font-semibold text-foreground/80">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="mileage" className="text-xs font-semibold text-foreground/80">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="0"
                      value={formData.mileage}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType" className="text-xs font-semibold text-foreground/80">Fuel</Label>
                    <Select
                      id="fuelType"
                      onChange={handleChange}
                      value={formData.fuelType}
                    >
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission" className="text-xs font-semibold text-foreground/80">Transmission</Label>
                    <Select
                      id="transmission"
                      onChange={handleChange}
                      value={formData.transmission}
                    >
                      <option>Automatic</option>
                      <option>Manual</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part 3: Contact & Description */}
            <Card className="shadow-md bg-card/45 border-border/40">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground/90">
                  <LinkIcon className="h-4.5 w-4.5 text-primary" />
                  Seller Details & Description
                </CardTitle>
                <CardDescription className="text-xs">How can potential buyers contact you?</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-xs font-semibold text-foreground/80">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="e.g. +1 234 567 8900"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-semibold text-foreground/80">Description</Label>
                  <Textarea
                    id="description"
                    rows="3"
                    placeholder="Tell us about the car's condition, modifications, and history..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-muted/40 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold">Listing Image</span>
                  </div>
                  <Label htmlFor="imageUrl" className="text-[11px] text-muted-foreground mb-1 block">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/...car-image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold shadow-lg"
              disabled={loading}
            >
              {loading ? "Posting Vehicle..." : "Post Premium Listing"}
            </Button>
          </form>
        </div>

        {/* Right column: Sticky live card preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="border border-border/40 bg-card/65 dark:bg-slate-900/40 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-primary" />
                Live Listing Card Preview
              </h3>
              <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-bold uppercase animate-pulse">Real-time</span>
            </div>

            <motion.div
              layout
              className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
                <img
                  src={previewCar.imageUrl || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000"}
                  alt="Preview"
                  className="h-full w-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className="backdrop-blur-md bg-white/95 dark:bg-slate-900/80 font-bold text-xs px-2.5 py-1 rounded-full text-foreground border border-border/30">
                    {previewCar.statusName}
                  </span>
                </div>
              </div>
              
              <div className="p-4 pb-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">
                  {previewCar.brandName}
                </p>
                <h3 className="font-bold text-lg leading-tight truncate">
                  {previewCar.model}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-1">{previewCar.title}</p>
              </div>
              
              <div className="p-4 pt-0">
                <div className="text-2xl font-black text-foreground mb-4">
                  ${previewCar.price?.toLocaleString() || "0"}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
                    <span className="font-bold text-foreground">{previewCar.year}</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5">Year</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
                    <span className="font-bold text-foreground truncate max-w-full">{previewCar.fuelType}</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5">Fuel</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
                    <span className="font-bold text-foreground truncate max-w-full">{previewCar.transmission === "Automatic" ? "Auto" : "Manual"}</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5">Gear</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-[10px] text-muted-foreground/80 mt-4 leading-relaxed italic text-center">
              * This is exactly how your listing will render to prospective buyers in the AutoPremium marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;