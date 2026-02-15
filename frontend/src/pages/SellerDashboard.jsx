import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Car, DollarSign, TrendingUp, Package } from 'lucide-react';

const SellerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        soldListings: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));

            const [listingsRes, salesRes] = await Promise.all([
                api.get(`/Car/seller/${user.userId}`),
                api.get(`/Purchase/seller/${user.userId}/sales`)
            ]);

            setListings(listingsRes.data);
            setSales(salesRes.data);

            // Calculate stats
            const totalRevenue = salesRes.data.reduce((sum, sale) => sum + sale.purchasePrice, 0);
            const activeListings = listingsRes.data.filter(car => car.statusName === 'Available').length;
            const soldListings = listingsRes.data.filter(car => car.statusName === 'Sold').length;

            setStats({
                totalListings: listingsRes.data.length,
                activeListings,
                soldListings,
                totalRevenue
            });
        } catch (error) {
            console.error('Error fetching data', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchData} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Retry
            </button>
        </div>
    );

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black">Seller Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage your car listings and track sales</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Package size={32} className="opacity-50" />
                    </div>
                    <p className="text-blue-100 text-sm font-medium">Total Listings</p>
                    <p className="text-3xl font-black mt-1">{stats.totalListings}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Car size={32} className="opacity-50" />
                    </div>
                    <p className="text-green-100 text-sm font-medium">Active Listings</p>
                    <p className="text-3xl font-black mt-1">{stats.activeListings}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={32} className="opacity-50" />
                    </div>
                    <p className="text-purple-100 text-sm font-medium">Cars Sold</p>
                    <p className="text-3xl font-black mt-1">{stats.soldListings}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={32} className="opacity-50" />
                    </div>
                    <p className="text-orange-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-black mt-1">${stats.totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                    to="/sell"
                    className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-primary hover:shadow-xl transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">Add New Listing</h3>
                            <p className="text-slate-500">List a new car for sale</p>
                        </div>
                    </div>
                </Link>
                <Link
                    to="/my-listings"
                    className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:shadow-xl transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Car size={32} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">Manage Listings</h3>
                            <p className="text-slate-500">Edit or remove your cars</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Listings */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Listings</h2>
                    <Link to="/my-listings" className="text-primary hover:underline font-medium">View All →</Link>
                </div>
                {listings.slice(0, 5).length > 0 ? (
                    <div className="space-y-4">
                        {listings.slice(0, 5).map(car => (
                            <div key={car.carId} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="size-16 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <Car className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{car.brandName} {car.model}</p>
                                        <p className="text-sm text-slate-500">{car.year} • {car.fuelType}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">${car.price?.toLocaleString()}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${car.statusName === 'Available' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                        {car.statusName}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-slate-500">No listings yet. Add your first car!</p>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
