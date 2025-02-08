import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
    isLoggedIn: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    loading: true,
    login: () => {},
    logout: () => {}
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const isento = localStorage.getItem("isento") === "true"; 

        if (token || isento) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        setLoading(false); 
    }, []);

    const login = (token: string) => {
        localStorage.setItem("authToken", token);
        setIsLoggedIn(true);
        navigate("/eventos");
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isento"); 
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
