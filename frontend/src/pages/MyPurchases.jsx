import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, Car, Calendar, DollarSign, CreditCard, User } from 'lucide-react';

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await api.get(`/Purchase/buyer/${user.userId}`);
            setPurchases(response.data);
        } catch (error) {
            console.error('Error fetching purchases', error);
            setError('Failed to load your purchases');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchPurchases} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Retry
            </button>
        </div>
    );

    const totalSpent = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black">My Purchases</h1>
                <p className="text-slate-500 mt-1">View your purchase history</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Purchases</p>
                            <p className="text-3xl font-black mt-1">{purchases.length}</p>
                        </div>
                        <ShoppingBag size={40} className="opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Spent</p>
                            <p className="text-3xl font-black mt-1">${totalSpent.toLocaleString()}</p>
                        </div>
                        <DollarSign size={40} className="opacity-50" />
                    </div>
                </div>
            </div>

            {purchases.length > 0 ? (
                <div className="space-y-6">
                    {purchases.map(purchase => (
                        <div key={purchase.purchaseId} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                {/* Car Image */}
                                <div className="md:w-64 h-48 md:h-auto bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                    {purchase.car?.imageUrl ? (
                                        <img src={purchase.car.imageUrl} alt={purchase.car.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Car size={48} className="text-slate-400" />
                                    )}
                                </div>

                                {/* Purchase Details */}
                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black">{purchase.car?.brandName} {purchase.car?.model}</h3>
                                            <p className="text-slate-500">{purchase.car?.title}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            {purchase.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                                <Calendar size={12} />
                                                Purchase Date
                                            </div>
                                            <p className="font-bold">{new Date(purchase.createdDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                                <CreditCard size={12} />
                                                Payment Method
                                            </div>
                                            <p className="font-bold">{purchase.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                                <User size={12} />
                                                Seller
                                            </div>
                                            <p className="font-bold">{purchase.car?.sellerName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-primary">
                                            <DollarSign size={24} />
                                            <span className="text-3xl font-black">{purchase.purchasePrice?.toLocaleString()}</span>
                                        </div>
                                        <Link
                                            to={`/cars/${purchase.carId}`}
                                            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-bold"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg mb-4">You haven't purchased any cars yet</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                        Browse Cars
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyPurchases;
