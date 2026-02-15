import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DollarSign, CreditCard, Check, ArrowLeft } from 'lucide-react';

const BuyCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await api.get(`/Car/${id}`);
                setCar(response.data);
            } catch (error) {
                setError('Failed to load car details');
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
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/Purchase', {
                carId: parseInt(id),
                userId: user.userId,
                purchasePrice: car.price,
                paymentMethod
            });

            // Success - redirect to purchases
            alert('Purchase completed successfully!');
            navigate('/my-purchases');
        } catch (error) {
            console.error('Purchase error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to complete purchase';
            alert(errorMsg);
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error || !car) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500">{error || 'Car not found'}</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Back to Browse
            </button>
        </div>
    );

    return (
        <div className="py-8">
            <button
                onClick={() => navigate(`/cars/${id}`)}
                className="flex items-center gap-2 text-slate-600 hover:text-primary mb-6"
            >
                <ArrowLeft size={20} />
                Back to Car Details
            </button>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-black mb-2">Purchase Confirmation</h1>
                <p className="text-slate-500 mb-8">Review and complete your purchase</p>

                {/* Car Summary */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
                    <h2 className="font-bold text-lg mb-4">Car Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Car</span>
                            <span className="font-bold">{car.brandName} {car.model} ({car.year})</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Title</span>
                            <span className="font-bold">{car.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Mileage</span>
                            <span className="font-bold">{car.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Fuel Type</span>
                            <span className="font-bold">{car.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Transmission</span>
                            <span className="font-bold">{car.transmission}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Seller</span>
                            <span className="font-bold">{car.userName}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-lg font-bold">Total Price</span>
                            <div className="flex items-center gap-1 text-primary">
                                <DollarSign size={24} />
                                <span className="text-2xl font-black">{car.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePurchase} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="font-bold text-lg mb-4">Payment Information</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                            required
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Financing">Financing</option>
                            <option value="Credit Card">Credit Card</option>
                        </select>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                            <strong>Note:</strong> This is a demo purchase flow. In a production environment, this would integrate with actual payment processing.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={purchasing}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {purchasing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                Confirm Purchase
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuyCar;
