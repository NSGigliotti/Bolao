import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = decodeToken(token);
                // Check if token is expired? The decoding logic can handle basic expiration check if needed
                setUser(userData);
            } catch (error) {
                console.error("Invalid token found", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const userData = decodeToken(token);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Helper to decode JWT payload safely
    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);

            // Map typical claims to a user object
            return {
                id: decoded.nameid || decoded.sub,
                name: decoded.unique_name || decoded.name,
                role: decoded.role,
                // Add other fields as needed
                ...decoded
            };
        } catch (e) {
            throw new Error("Failed to decode token");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
