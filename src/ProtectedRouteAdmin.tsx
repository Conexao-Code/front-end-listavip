import React, { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteAdminProps {
    children: JSX.Element;
}

export const ProtectedRouteAdmin: React.FC<ProtectedRouteAdminProps> = ({ children }) => {
    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login-admin" replace />;
    }

    return children;
};
