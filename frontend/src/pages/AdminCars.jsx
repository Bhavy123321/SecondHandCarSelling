import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, User, DollarSign, Calendar } from 'lucide-react';

const AdminCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/Car');
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars', error);
            setError('Failed to load car listings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async (carId, carTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${carTitle}"?`)) return;

        try {
            await api.delete(`/Car/${carId}`);
            setCars(cars.filter(c => c.carId !== carId));
        } catch (error) {
            console.error('Error deleting car', error);
            alert('Failed to delete car');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchCars} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Retry
            </button>
        </div>
    );

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black">Car Listings Management</h1>
                <p className="text-slate-500 mt-1">Manage all car listings</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold">Car</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Seller</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Year</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Listed</th>
                                <th className="px-6 py-4 text-right text-sm font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.carId} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold">{car.brandName} {car.model}</p>
                                            <p className="text-sm text-slate-500">{car.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            <span className="text-sm">{car.userName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 font-bold text-primary">
                                            <DollarSign size={16} />
                                            {car.price?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{car.year}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            {car.statusName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(car.createdDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(car.carId, `${car.brandName} ${car.model}`)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete car"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {cars.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No cars found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCars;
