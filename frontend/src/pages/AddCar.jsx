import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddCar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        model: '',
        brandId: 1, // Default, ideally fetch brands
        statusId: 1, // Default Available
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        description: '',
        userId: user?.userId,
        imageId: 1 // Default image ID since backend requires it but UI doesn't support upload yet
    });

    // Hardcoded brands for now - ideally fetched from /api/CarBrands or similar
    const brands = [
        { id: 1, name: 'BMW' },
        { id: 2, name: 'Audi' },
        { id: 3, name: 'Mercedes' },
        { id: 4, name: 'Tesla' },
        { id: 5, name: 'Porsche' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Need to ensure numeric values are numbers
            const payload = {
                ...formData,
                userId: user.userId, // Ensure userId is set
                brandId: parseInt(formData.brandId),
                statusId: 1,
                year: parseInt(formData.year),
                price: parseFloat(formData.price),
                mileage: parseInt(formData.mileage),
                imageId: 1 // Placeholder as per constraint
            };

            await api.post('/Car', payload);
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error("Error adding car", error);
            setLoading(false);
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.title ||
                'Failed to add car. Please check your inputs and try again.';
            setError(errorMsg);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-black mb-8 text-center">List Your Vehicle</h1>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">

                {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="brandId">Brand</label>
                        <select id="brandId" onChange={handleChange} value={formData.brandId} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary">
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="model">Model</label>
                        <input id="model" type="text" placeholder="e.g. M4 Competition" onChange={handleChange} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold ml-1" htmlFor="title">Listing Title</label>
                    <input id="title" type="text" placeholder="e.g. Pristine Condition BMW M4 - Low Mileage" onChange={handleChange} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary" required />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="year">Year</label>
                        <input id="year" type="number" min="1900" max="2027" value={formData.year} onChange={handleChange} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="price">Price ($)</label>
                        <input id="price" type="number" placeholder="0.00" onChange={handleChange} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="mileage">Mileage (km)</label>
                        <input id="mileage" type="number" placeholder="0" onChange={handleChange} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="fuelType">Fuel</label>
                        <select id="fuelType" onChange={handleChange} value={formData.fuelType} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary">
                            <option>Petrol</option>
                            <option>Diesel</option>
                            <option>Electric</option>
                            <option>Hybrid</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1" htmlFor="transmission">Transmission</label>
                        <select id="transmission" onChange={handleChange} value={formData.transmission} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary">
                            <option>Automatic</option>
                            <option>Manual</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold ml-1" htmlFor="description">Description</label>
                    <textarea id="description" rows="4" placeholder="Tell us about the car..." onChange={handleChange} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Posting...' : 'Post Listing'}
                </button>
            </form>
        </div>
    );
};

export default AddCar;
