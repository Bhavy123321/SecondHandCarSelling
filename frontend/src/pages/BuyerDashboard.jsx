import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/CarCard';
import { Search, ShoppingCart, TrendingUp } from 'lucide-react';

const BuyerDashboard = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchases, setPurchases] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));

            // Fetch available cars and buyer's purchases
            const [carsRes, purchasesRes] = await Promise.all([
                api.get('/Car/available'),
                api.get(`/Purchase/buyer/${user.userId}`)
            ]);

            setCars(carsRes.data);
            setFilteredCars(carsRes.data);
            setPurchases(purchasesRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
            setError('Failed to load cars');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = cars;

        if (selectedBrand !== 'All') {
            filtered = filtered.filter(car => car.brandName === selectedBrand);
        }

        if (searchTerm) {
            filtered = filtered.filter(car =>
                car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCars(filtered);
    }, [searchTerm, selectedBrand, cars]);

    const brands = ['All', ...new Set(cars.map(car => car.brandName))];

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500 text-center">{error}</p>
            <button onClick={fetchData} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Retry
            </button>
        </div>
    );

    return (
        <div className="py-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Available Cars</p>
                            <p className="text-3xl font-black mt-1">{cars.length}</p>
                        </div>
                        <ShoppingCart size={40} className="opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">My Purchases</p>
                            <p className="text-3xl font-black mt-1">{purchases.length}</p>
                        </div>
                        <TrendingUp size={40} className="opacity-50" />
                    </div>
                </div>
                <Link to="/my-purchases" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">View Purchases</p>
                            <p className="text-lg font-bold mt-1">Purchase History →</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-6">Browse Cars</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by brand, model, or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                        />
                    </div>
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                    >
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Car Grid */}
            {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map(car => (
                        <CarCard key={car.carId} car={car} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No cars found matching your criteria</p>
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;
