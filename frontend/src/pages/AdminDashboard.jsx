import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, Car, TrendingUp, Package } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCars: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, carsRes] = await Promise.all([
                    api.get('/User'),
                    api.get('/Car')
                ]);
                setStats({
                    totalUsers: usersRes.data.length,
                    totalCars: carsRes.data.length,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching stats', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', link: '/admin/users' },
        { title: 'Total Cars', value: stats.totalCars, icon: Car, color: 'bg-green-500', link: '/admin/cars' },
    ];

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage users and car listings</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            to={stat.link}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} size-12 rounded-xl flex items-center justify-center text-white`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-black mt-1">{stats.loading ? '...' : stat.value}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/admin/users"
                        className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary transition-colors"
                    >
                        <Users className="mb-2 text-primary" />
                        <h3 className="font-bold">Manage Users</h3>
                        <p className="text-sm text-slate-500">View, edit, and delete users</p>
                    </Link>
                    <Link
                        to="/admin/cars"
                        className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary transition-colors"
                    >
                        <Car className="mb-2 text-primary" />
                        <h3 className="font-bold">Manage Cars</h3>
                        <p className="text-sm text-slate-500">View and manage car listings</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
