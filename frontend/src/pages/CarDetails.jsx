import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Gauge, Settings, Fuel, ArrowLeft, User, Phone, Mail, ShoppingCart, Edit, Trash2 } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwner = user && car && user.userId == car.userId;
    // Buyers can buy if they don't own the car, it's available, and they are not an Admin
    const canBuy = user && car && user.userId != car.userId && car.statusName === 'Available' && user.role !== 'Admin';



    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this car listing?`)) return;

        try {
            await api.delete(`/Car/${id}`);
            navigate('/my-listings');
        } catch (error) {
            console.error('Error deleting car', error);
            alert('Failed to delete car');
        }
    };

    const fetchCar = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/Car/${id}`);
            setCar(response.data);
        } catch (error) {
            console.error("Error fetching car details", error);
            if (error.response?.status === 404) {
                setError('Car not found. It may have been sold or removed.');
            } else {
                setError('Failed to load car details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCar();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500 text-center">{error}</p>
            <div className="flex gap-3">
                <button
                    onClick={fetchCar}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                    Retry
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );

    if (!car) return <div className="text-center py-20">Car not found.</div>;

    const imageUrl = car.imageUrl && car.imageUrl.length > 5
        ? car.imageUrl
        : `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop`;

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 font-medium transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Listings
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                {/* Image Section */}
                <div className="h-[400px] md:h-[500px] w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${imageUrl}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <span className="bg-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                            {car.statusName}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{car.brandName} {car.model}</h1>
                        <p className="text-xl opacity-90">{car.title}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 p-8 md:p-12">
                    {/* Main Specs & Description */}
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-center">
                                <Calendar className="text-primary" />
                                <span className="font-bold text-lg">{car.year}</span>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Year</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-center">
                                <Gauge className="text-primary" />
                                <span className="font-bold text-lg">{car.mileage?.toLocaleString()} km</span>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Mileage</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-center">
                                <Fuel className="text-primary" />
                                <span className="font-bold text-lg">{car.fuelType}</span>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Fuel</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-center">
                                <Settings className="text-primary" />
                                <span className="font-bold text-lg">{car.transmission}</span>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Transmission</span>
                            </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-4">Vehicle Description</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {car.description || "No description provided by the seller."}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Price & Seller */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 text-sm font-medium mb-1">Asking Price</p>
                            <div className="text-4xl font-black text-primary tracking-tight">
                                ${car.price?.toLocaleString()}
                            </div>
                            {/* Action Buttons */}
                            {isOwner && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center gap-3">
                                    <div className="size-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-900 dark:text-blue-100">Your Listing</p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">You are the seller of this vehicle.</p>
                                    </div>
                                </div>
                            )}
                            {canBuy && (
                                <button
                                    onClick={() => navigate(`/buy/${car.carId}`)}
                                    className="w-full mt-6 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Buy Now
                                </button>
                            )}
                            {isOwner && (
                                <div className="space-y-3 mt-6">
                                    {car.statusName !== 'Sold' && (
                                        <button
                                            onClick={() => navigate(`/edit-car/${car.carId}`)}
                                            className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit size={18} />
                                            Edit Listing
                                        </button>
                                    )}
                                    {car.statusName !== 'Sold' && (
                                        <button
                                            onClick={handleDelete}
                                            className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={18} />
                                            Delete Listing
                                        </button>
                                    )}
                                </div>
                            )}
                            {!canBuy && !isOwner && car.statusName === 'Sold' && (
                                <div className="mt-6 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-center font-bold">
                                    This car has been sold
                                </div>
                            )}
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Seller</p>
                                <p className="font-bold text-lg">{car.userName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
