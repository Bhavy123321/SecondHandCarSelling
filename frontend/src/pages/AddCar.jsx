import React, { useState } from "react";
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
import { AlertCircle, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageInputType, setImageInputType] = useState("url"); // 'url' or 'file'
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

  const brands = [
    { id: 1, name: "BMW" },
    { id: 2, name: "Audi" },
    { id: 3, name: "Mercedes" },
    { id: 4, name: "Tesla" },
    { id: 5, name: "Porsche" },
    { id: 6, name: "Toyota" },
    { id: 7, name: "Honda" },
    { id: 8, name: "Ford" },
    { id: 9, name: "Chevrolet" },
    { id: 10, name: "Volkswagen" },
    { id: 11, name: "Nissan" },
    { id: 12, name: "Hyundai" },
    { id: 13, name: "Kia" },
    { id: 14, name: "Lexus" },
    { id: 15, name: "Jaguar" },
    { id: 16, name: "Land Rover" },
    { id: 17, name: "Volvo" },
    { id: 18, name: "Mazda" },
    { id: 19, name: "Subaru" },
    { id: 20, name: "Jeep" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        userId: user.userId,
        brandId: parseInt(formData.brandId),
        statusId: 1,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        imageId: 1,
      };

      // First create the car
      const carResponse = await api.post("/Car", payload);
      const carId = carResponse.data.carId;

      // If image URL is provided, create the car image
      if (formData.imageUrl && formData.imageUrl.trim() !== "") {
        try {
          await api.post("/CarImages/url", {
            carId: carId,
            imageUrl: formData.imageUrl,
          });
        } catch (imgError) {
          console.error("Error adding image:", imgError);
          // Don't fail the whole operation if image fails
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

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">List Your Vehicle</CardTitle>
          <CardDescription>
            Enter the details of the car you want to sell.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brandId">Brand</Label>
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
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g. M4 Competition"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                placeholder="e.g. Pristine Condition BMW M4 - Low Mileage"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
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
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="0"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel</Label>
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
                <Label htmlFor="transmission">Transmission</Label>
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

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="e.g. +1 234 567 8900"
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                This number will be displayed to potential buyers so they can contact you.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows="4"
                placeholder="Tell us about the car..."
                onChange={handleChange}
              />
            </div>

            {/* Image URL Input */}
            <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Car Image</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/car-image.jpg"
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct URL to an image of your car (optional).
                </p>
              </div>

              {formData.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Car preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCar;