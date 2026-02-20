import { createContext, useState, useEffect, useContext } from 'react';
import { googleLogout } from '@react-oauth/google';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Ideally we check token validity, but for now we just assume logged in
            // Or decode JWT if we store user info there
            // But we didn't store user object, just token
            // Let's assume we can fetch user profile or store user object in localStorage too
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    }, [token]);

    const login = async (googleData) => {
        try {
            const { credential } = googleData;
            const res = await api.post('/auth/google', { token: credential });
            const { user, token } = res.data;

            localStorage.setItem('token', token); // Using credential as token if server returns it or new JWT
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const logout = () => {
        googleLogout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
