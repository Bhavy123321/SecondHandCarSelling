import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, UserCircle, Mail, Phone, Shield } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/User');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;

        try {
            await api.delete(`/User/${userId}`);
            setUsers(users.filter(u => u.userId !== userId));
        } catch (error) {
            console.error('Error deleting user', error);
            alert('Failed to delete user');
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
            <button onClick={fetchUsers} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                Retry
            </button>
        </div>
    );

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black">User Management</h1>
                <p className="text-slate-500 mt-1">Manage all registered users</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">Joined</th>
                                <th className="px-6 py-4 text-right text-sm font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserCircle className="text-primary" size={20} />
                                            </div>
                                            <span className="font-medium">{user.userName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.phone || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                                                user.role === 'Seller' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            <Shield size={12} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(user.createdDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.userId, user.userName)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
