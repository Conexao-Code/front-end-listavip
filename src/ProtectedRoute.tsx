import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
    const { isLoggedIn, loading } = useContext(AuthContext);
    const userRole = localStorage.getItem("role");
    const isento = localStorage.getItem("isento") === "true";

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (isento) {
       return <>{children}</>;
    }

    if (userRole && !requiredRoles.includes(userRole)) {
       return <Navigate to="/eventos" replace />;
    }

    return <>{children}</>;
};
