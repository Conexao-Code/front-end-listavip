import React, { JSX, useContext, useEffect } from "react";
import { useTheme } from "../../ThemeContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../../imagens/logo.png";
import logob from "../../imagens/logob.png";
import { Star, Users, User, Smile, DollarSign, Settings, LogOut, X } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import { API_URL } from "../../config";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps): JSX.Element => {
    const { theme } = useTheme();
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        const sessionToken = localStorage.getItem("authToken");
        try {
            const response = await fetch(`${API_URL}/api/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sessionToken })
            });
            if (response.ok) {
                logout();
                navigate("/login");
            } else {
                console.error("Falha ao realizar logout");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor de logout", error);
        }
    };

    const canAccessPage = (roles: string[]) => userRole && roles.includes(userRole);

    const menuItems = [
        { name: "Eventos", path: "/eventos", icon: Star, roles: ["ceo", "mod", "rec"] },
        { name: "Admin", path: "/admin", icon: Users, roles: ["ceo"] },
        { name: "Promotores", path: "/promoters", icon: User, roles: ["ceo", "mod"] },
        { name: "Clientes", path: "/clientes", icon: Smile, roles: ["ceo", "mod", "rec"] },
        { name: "Saldo", path: "/saldo", icon: DollarSign, roles: ["ceo"] }
    ];

    const bottomMenuItems = [
        { name: "Configurações", path: "/configuracao", icon: Settings, roles: ["ceo", "mod", "rec"] }
    ];

    const transformClass = isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

    const isMobile = window.innerWidth < 1024;
    const inlineTransform = isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)";

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity lg:hidden z-20 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            />
            <aside
                className={`fixed inset-y-0 left-0 lg:relative z-40 h-full w-64 transition-transform duration-200 ease-in-out transform ${transformClass
                    } bg-gray-800/95 backdrop-blur-md lg:bg-gray-800/25 shadow-xl lg:shadow-none flex flex-col`}
                style={{ transform: inlineTransform }}
            >
                <div className="flex items-center justify-center h-24 px-6 mb-8">
                    <img
                        className="h-8 w-auto transition-opacity duration-200"
                        alt="Logo"
                        src={theme === "dark" ? logo : logob}
                    />
                </div>
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) =>
                        canAccessPage(item.roles) ? (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={toggleSidebar}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                                    ? "bg-[#e1ff01]/10 text-[#e1ff01]"
                                    : "text-gray-300 hover:bg-gray-700/50 hover:text-[#e1ff01]"
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 transition-transform duration-200 ${isActive(item.path) ? "scale-110" : "scale-100"
                                        }`}
                                />
                                <span className="font-medium">{item.name}</span>
                                {isActive(item.path) && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e1ff01]" />
                                )}
                            </Link>
                        ) : null
                    )}
                </nav>
                <div className="px-4 pb-6 space-y-2">
                    <div className="h-px bg-gray-700/50 my-6" />
                    {bottomMenuItems.map((item) =>
                        canAccessPage(item.roles) ? (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={toggleSidebar}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                                    ? "bg-[#e1ff01]/10 text-[#e1ff01]"
                                    : "text-gray-300 hover:bg-gray-700/50 hover:text-[#e1ff01]"
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 transition-transform duration-200 ${isActive(item.path) ? "scale-110" : "scale-100"
                                        }`}
                                />
                                <span className="font-medium">{item.name}</span>
                                {isActive(item.path) && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e1ff01]" />
                                )}
                            </Link>
                        ) : null
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-[#e1ff01] transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
