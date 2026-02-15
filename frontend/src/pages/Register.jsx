import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, Phone, Shield, Car } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        email: '',
        phone: '',
        role: 'Buyer' // Default valid role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/User', formData);
            setLoading(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
            setLoading(false);
            // Display specific validation errors if available
            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(validationErrors);
            } else {
                setError(err.response?.data?.message || err.response?.data?.title || 'Registration failed');
            }
        }
    };

    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Left Side: Immersive Brand Content (60%) - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>
                    {/* Placeholder for car image */}
                    <div className="w-full h-full bg-center bg-no-repeat bg-cover opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop')" }}></div>
                </div>

                <div className="relative z-20 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Car className="text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-black tracking-tight">AutoPremium</h2>
                </div>

                <div className="relative z-20 max-w-xl">
                    <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                        Join the exclusive circle.
                    </h1>
                    <p className="text-white/80 text-lg font-medium leading-relaxed">
                        Create an account to access premium listings, schedule test drives, and find your dream car.
                    </p>
                </div>

                <div className="relative z-20">
                    <p className="text-white/40 text-sm font-medium">© 2026 AutoPremium Global Inc.</p>
                </div>
            </div>

            {/* Right Side: Registration Form (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-6 py-12 sm:px-12 bg-white dark:bg-background-dark overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">

                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <Car className="text-primary text-3xl" />
                            <h2 className="text-2xl font-black tracking-tight">AutoPremium</h2>
                        </div>
                    </div>

                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create Account</h2>
                        <p className="text-slate-500 dark:text-slate-400">Enter your details to register.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="userName">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="userName"
                                    type="text"
                                    placeholder="Username (Letters only)"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-400 ml-1">Letters only (A-Z, no spaces/numbers)</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="phone">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="phone"
                                    type="tel"
                                    placeholder="10-digit mobile (e.g. 9876543210)"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-400 ml-1">Indian mobile number starting with 6-9</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="role">Account Type</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white appearance-none"
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="Buyer">Buyer</option>
                                    <option value="Seller">Seller</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
                        Already have an account?
                        <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
