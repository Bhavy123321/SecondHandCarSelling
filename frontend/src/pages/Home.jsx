import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('All');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/Car');
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching cars", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Derived state for filtering
    const brands = ['All', ...new Set(cars.map(c => c.brandName))];
    const filteredCars = cars.filter(car => {
        const matchesBrand = filterBrand === 'All' || car.brandName === filterBrand;
        const matchesSearch = car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.brandName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesBrand && matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters (25%) */}
            <aside className="w-full lg:w-1/4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Filters</h3>
                        <button
                            onClick={() => setFilterBrand('All')}
                            className="text-xs font-semibold text-primary uppercase tracking-wider hover:opacity-80"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Brand Filter */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-semibold text-sm">Top Brands</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {brands.map(brand => (
                                <label key={brand} className="flex items-center gap-3 py-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={filterBrand === brand}
                                        onChange={() => setFilterBrand(brand)}
                                        className="h-5 w-5 rounded-full border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-all"
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{brand}</span>
                                    {brand !== 'All' && (
                                        <span className="ml-auto text-xs text-slate-500">
                                            {cars.filter(c => c.brandName === brand).length}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Listings Content (75%) */}
            <section className="w-full lg:w-3/4">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Premium Listings</h1>
                        <p className="text-slate-500 text-sm mt-1">Found {filteredCars.length} vehicles</p>
                    </div>
                    {/* Search logic is simplified for now */}
                    <div className="hidden sm:block">
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="px-4 py-2 border rounded-lg text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid of Car Cards */}
                {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCars.map(car => (
                            <CarCard key={car.carId} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>No cars found matching your criteria.</p>
                        <button onClick={() => { setFilterBrand('All'); setSearchTerm(''); }} className="mt-4 text-primary font-bold">Clear Filters</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
