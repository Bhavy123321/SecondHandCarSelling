import React from "react";
import { Link } from "react-router-dom";
import { Fuel, Calendar, Gauge } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const CarCard = ({ car }) => {
  // Default image if none provided
  const imageUrl =
    car.imageUrl ||
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000";

  return (
    <Card className="group overflow-hidden border-0 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageUrl}
          alt={`${car.brandName} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="backdrop-blur-md bg-white/90 dark:bg-black/60 font-bold"
          >
            {car.statusName}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">
              {car.brandName}
            </p>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {car.model}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-black text-foreground mb-4">
          ${car.price?.toLocaleString()}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 mb-1 text-primary/70" />
            <span>{car.year}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
            <Fuel className="h-4 w-4 mb-1 text-primary/70" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
            <Gauge className="h-4 w-4 mb-1 text-primary/70" />
            {/* Assuming mileage might be added later, keeping placeholder or remove */}
            <span>km</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/cars/${car.carId}`} className="w-full">
          <Button className="w-full group-hover:bg-primary/90">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
