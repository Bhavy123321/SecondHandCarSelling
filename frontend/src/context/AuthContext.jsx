import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Failed to parse saved user', err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (userName, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/Auth/login', { userName, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.title ||
                'Invalid username or password';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
