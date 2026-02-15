import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Search, Heart, Bell, User, LogOut, Plus } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                                <Car size={24} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">AutoPremium</h2>
                        </Link>
                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center w-96">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    className="w-full h-11 pl-11 pr-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary text-sm transition-all outline-none"
                                    placeholder="Search make, model, or body type..."
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Nav Links & Actions */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <nav className="hidden xl:flex items-center gap-8">
                            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Buy Cars</Link>
                            {(user?.role === 'Seller' || user?.role === 'Admin') && (
                                <Link to="/sell" className="text-sm font-medium hover:text-primary transition-colors">Sell Your Car</Link>
                            )}
                        </nav>
                        <div className="flex items-center gap-3">
                            <button className="hidden sm:flex items-center justify-center size-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <Heart size={20} />
                            </button>
                            <button className="hidden sm:flex items-center justify-center size-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <Bell size={20} />
                            </button>

                            {(user?.role === 'Seller' || user?.role === 'Admin') && (
                                <Link to="/sell" className="hidden sm:flex h-11 px-6 items-center gap-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                                    <Plus size={18} />
                                    List a Car
                                </Link>
                            )}

                            <div className="flex items-center gap-3 ml-2">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold">{user?.userName}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                                </div>
                                <button onClick={handleLogout} className="flex items-center justify-center size-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-[1440px] w-full mx-auto px-6 py-8">
                {children}
            </main>

            <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-12">
                <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                            <Car size={16} />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">AutoPremium</h2>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <a className="hover:text-primary transition-colors" href="#">About Us</a>
                        <a className="hover:text-primary transition-colors" href="#">Careers</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    </div>
                    <div className="mt-8 md:mt-0 text-xs text-slate-400">
                        © 2026 AutoPremium Global Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
