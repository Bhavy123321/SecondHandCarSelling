import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const EditCar = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    userId: user?.userId,
  });

  const brands = [
    { id: 1, name: "BMW" },
    { id: 2, name: "Audi" },
    { id: 3, name: "Mercedes" },
    { id: 4, name: "Tesla" },
    { id: 5, name: "Porsche" },
  ];

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/Car/${id}`);
        const car = response.data;
        const brandId = brands.find((b) => b.name === car.brandName)?.id || 1;

        setFormData({
          title: car.title,
          model: car.model,
          brandId: brandId,
          statusId: 1,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          fuelType: car.fuelType,
          transmission: car.transmission,
          description: car.description || "",
          userId: user?.userId,
        });
      } catch (error) {
        console.error("Error fetching car:", error);
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        carId: parseInt(id),
        userId: user.userId,
        brandId: parseInt(formData.brandId),
        statusId: 1,
        title: formData.title,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        description: formData.description,
      };

      await api.put(`/Car/${id}`, payload);
      navigate("/my-listings");
    } catch (error) {
      console.error("Error updating car", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to update car. Please check your inputs and try again.";
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/my-listings")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Listings
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Car Listing</CardTitle>
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId">Brand</Label>
                <Select
                  id="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  required
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  id="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  id="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCar;
