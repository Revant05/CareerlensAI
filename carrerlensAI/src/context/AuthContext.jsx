import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Auth from Token
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/me');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setAuthToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            setUser(res.data.user);
            toast.success(`Welcome back, ${res.data.user.name}!`);
            return true;
        } catch (err) {
            const msg = err.response?.data?.msg || 'Login failed';
            toast.error(msg);
            return false;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            setUser(res.data.user);
            toast.success('Account created! Welcome!');
            return true;
        } catch (err) {
            const msg = err.response?.data?.msg || 'Signup failed';
            toast.error(msg);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Helper to set Axios Header
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export const useAuth = () => useContext(AuthContext);
