import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const EditCar = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        model: '',
        brandId: 1,
        statusId: 1,
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        description: '',
        userId: user?.userId
    });

    const brands = [
        { id: 1, name: 'BMW' },
        { id: 2, name: 'Audi' },
        { id: 3, name: 'Mercedes' },
        { id: 4, name: 'Tesla' },
        { id: 5, name: 'Porsche' }
    ];

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await api.get(`/Car/${id}`);
                const car = response.data;

                // Map brand name to ID
                const brandId = brands.find(b => b.name === car.brandName)?.id || 1;

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
                    description: car.description || '',
                    userId: user?.userId
                });
            } catch (error) {
                console.error('Error fetching car:', error);
                setError('Failed to load car details');
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
        setError('');
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
                description: formData.description
            };

            await api.put(`/Car/${id}`, payload);
            navigate('/my-listings');
        } catch (error) {
            console.error("Error updating car", error);
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.title ||
                'Failed to update car. Please check your inputs and try again.';
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button
                onClick={() => navigate('/my-listings')}
                className="flex items-center gap-2 text-slate-600 hover:text-primary mb-6"
            >
                <ArrowLeft size={20} />
                Back to My Listings
            </button>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h1 className="text-3xl font-black mb-6">Edit Car Listing</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="brandId" className="block text-sm font-medium mb-2">Brand</label>
                            <select
                                id="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            >
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="model" className="block text-sm font-medium mb-2">Model</label>
                            <input
                                type="text"
                                id="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="year" className="block text-sm font-medium mb-2">Year</label>
                            <input
                                type="number"
                                id="year"
                                value={formData.year}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2">Price</label>
                            <input
                                type="number"
                                id="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="mileage" className="block text-sm font-medium mb-2">Mileage (km)</label>
                            <input
                                type="number"
                                id="mileage"
                                value={formData.mileage}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="fuelType" className="block text-sm font-medium mb-2">Fuel Type</label>
                            <select
                                id="fuelType"
                                value={formData.fuelType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="transmission" className="block text-sm font-medium mb-2">Transmission</label>
                            <select
                                id="transmission"
                                value={formData.transmission}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none"
                                required
                            >
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none resize-none"
                            placeholder="Describe the condition, features, and any additional information..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCar;
