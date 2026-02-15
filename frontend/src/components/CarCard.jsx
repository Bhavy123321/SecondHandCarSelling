import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Gauge, Settings, Fuel } from 'lucide-react';

const CarCard = ({ car }) => {
    // Determine image URL - use placeholder if missing or empty
    const imageUrl = car.imageUrl && car.imageUrl.length > 5
        ? car.imageUrl
        : `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop`; // Default placeholder

    // Format currency (assuming Indian context based on phone validation, or generic $)
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(car.price);

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                ></div>
                {car.statusName === 'New' && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">New Arrival</span>
                    </div>
                )}
                {/* Favorite Button Placeholder */}
                <button className="absolute top-4 right-4 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                    <Heart size={20} />
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{car.brandName} {car.model}</h3>
                    <span className="font-black text-primary text-lg">{formattedPrice}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm mb-5">
                    <div className="flex items-center gap-1.5" title="Year">
                        <Calendar size={16} />
                        <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Mileage">
                        <Gauge size={16} />
                        <span>{car.mileage?.toLocaleString() ?? 0} km</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Transmission">
                        <Settings size={16} />
                        <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Fuel">
                        <Fuel size={16} />
                        <span>{car.fuelType}</span>
                    </div>
                </div>

                <Link
                    to={`/cars/${car.carId}`}
                    className="flex items-center justify-center w-full py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm hover:bg-primary hover:border-primary hover:text-white transition-all"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
