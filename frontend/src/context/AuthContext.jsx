import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = `${API_BASE_URL}/api`;

    useEffect(() => {
        const storedUser = localStorage.getItem('sevo_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (idToken) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/google`, { idToken });
            setUser(data);
            localStorage.setItem('sevo_user', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sevo_user');
    };

    const updateProfile = async (updates) => {
        try {
            const token = user?.token;
            const { data } = await axios.put(`${API_URL}/users/profile`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newUser = { ...user, ...data };
            setUser(newUser);
            localStorage.setItem('sevo_user', JSON.stringify(newUser));
            return data;
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
