import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Car } from 'lucide-react';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(userName, password);
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Invalid credentials');
        }
    };

    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Left Side: Immersive Brand Content (60%) - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>
                    {/* Placeholder for car image */}
                    <div className="w-full h-full bg-center bg-no-repeat bg-cover opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop')" }}></div>
                </div>

                <div className="relative z-20 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Car className="text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-black tracking-tight">AutoPremium</h2>
                </div>

                <div className="relative z-20 max-w-xl">
                    <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                        Find your next journey in our curated collection.
                    </h1>
                    <p className="text-white/80 text-lg font-medium leading-relaxed">
                        The world's most trusted marketplace for pre-owned luxury vehicles. Experience transparency and performance in every transaction.
                    </p>
                </div>

                <div className="relative z-20">
                    <p className="text-white/40 text-sm font-medium">© 2026 AutoPremium Global Inc.</p>
                </div>
            </div>

            {/* Right Side: Authentication Form (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-6 py-12 sm:px-12 bg-white dark:bg-background-dark">
                <div className="w-full max-w-md space-y-8">

                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <Car className="text-primary text-3xl" />
                            <h2 className="text-2xl font-black tracking-tight">AutoPremium</h2>
                        </div>
                    </div>

                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400">Enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="username">Username</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
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
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In to Account'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
                        Don't have an account?
                        <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
