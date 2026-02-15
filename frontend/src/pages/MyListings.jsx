import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Edit, Trash2, Car as CarIcon, DollarSign, Calendar, User } from 'lucide-react';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await api.get(`/Car/seller/${user.userId}`);
            setListings(response.data);
        } catch (error) {
            console.error('Error fetching listings', error);
            setError('Failed to load your listings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (carId, carTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${carTitle}"?`)) return;

        try {
            await api.delete(`/Car/${carId}`);
            setListings(listings.filter(car => car.carId !== carId));
        } catch (error) {
            console.error('Error deleting car', error);
            alert('Failed to delete car');
        }
    };

    const handleEdit = (carId) => {
        navigate(`/edit-car/${carId}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchListings} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Retry
            </button>
        </div>
    );

    return (
        <div className="py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">My Listings</h1>
                    <p className="text-slate-500 mt-1">Manage your car listings</p>
                </div>
                <Link to="/sell" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                    + Add New Car
                </Link>
            </div>

            {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {listings.map(car => (
                        <div key={car.carId} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                {/* Car Image */}
                                <div className="md:w-64 h-48 md:h-auto bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                    {car.imageUrl ? (
                                        <img src={car.imageUrl} alt={car.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <CarIcon size={48} className="text-slate-400" />
                                    )}
                                </div>

                                {/* Car Details */}
                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black">{car.brandName} {car.model}</h3>
                                            <p className="text-slate-500">{car.title}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${car.statusName === 'Available'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-200 text-slate-700'
                                            }`}>
                                            {car.statusName}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Year</p>
                                            <p className="font-bold">{car.year}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Mileage</p>
                                            <p className="font-bold">{car.mileage?.toLocaleString()} km</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Fuel Type</p>
                                            <p className="font-bold">{car.fuelType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Transmission</p>
                                            <p className="font-bold">{car.transmission}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <div>
                                            <div className="flex items-center gap-2 text-primary mb-1">
                                                <DollarSign size={20} />
                                                <span className="text-2xl font-black">{car.price?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Calendar size={12} />
                                                Listed {new Date(car.createdDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/cars/${car.carId}`}
                                                className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors font-medium"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(car.carId)}
                                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(car.carId, `${car.brandName} ${car.model}`)}
                                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <CarIcon size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg mb-4">You haven't listed any cars yet</p>
                    <Link to="/sell" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                        List Your First Car
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyListings;
