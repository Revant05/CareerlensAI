import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Auth from LocalStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('careerlens_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // --- Actions ---

    const login = (email, password) => {
        // Simulating API Call
        const users = JSON.parse(localStorage.getItem('careerlens_users_db') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const { password: _password, ...userWithoutPass } = foundUser;
            setUser(userWithoutPass);
            localStorage.setItem('careerlens_user', JSON.stringify(userWithoutPass));
            toast.success(`Welcome back, ${foundUser.name}!`);
            return true;
        } else {
            toast.error('Invalid credentials');
            return false;
        }
    };

    const signup = (name, email, password) => {
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('careerlens_users_db') || '[]');
        if (users.find(u => u.email === email)) {
            toast.error('User already exists');
            return false;
        }

        const newUser = { id: Date.now(), name, email, password }; // Note: Storing password in plain text for demo only!
        users.push(newUser);
        localStorage.setItem('careerlens_users_db', JSON.stringify(users));

        toast.success('Account created! Please login.');
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('careerlens_user');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
