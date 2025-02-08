import React, { JSX, useContext } from "react";
import { useTheme } from "../../ThemeContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../../imagens/logo.png";
import logob from "../../imagens/logob.png";
import { FaStar, FaBars } from "react-icons/fa6";
import { FaRegFaceSmile } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { MdExitToApp } from "react-icons/md";
import { AuthContext } from "../../AuthContext";
import { FaMoneyBill, FaChartLine, FaRegStar   } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";



interface SidebarAdminProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export const SidebarAdmin = ({ isOpen, toggleSidebar }: SidebarAdminProps): JSX.Element => {
    const { theme } = useTheme();
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const baseColor = theme === "dark" ? "#FFFFFF" : "#2B2B2B";
    const hoverColor = "#E1FF01";

    const linkStyles = (path: string) => ({
        color: isActive(path) ? hoverColor : baseColor,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '15px',
        borderRadius: '14px',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
    });

    const iconStyles = (path: string) => ({
        color: isActive(path) ? hoverColor : baseColor,
        transition: 'color 0.3s ease',
    });

    const handleLogout = async () => {
        try {
            logout();
            navigate("/login-admin");
        } catch (error) {
            console.error("Erro ao conectar com o servidor de logout", error);
        }
    };

    return (
        <>
            <div className="lg:hidden absolute top-5 left-5 z-50">
                <FaBars
                    size={25}
                    color={theme === "dark" ? "#FFFFFF" : "#2B2B2B"}
                    onClick={toggleSidebar}
                    className="cursor-pointer"
                />
            </div>

            <div
                className={`fixed lg:relative z-40 transform ${isOpen ? "translate-x-0" : "hidden lg:block"
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:w-[210px] w-[210px] lg:h-screen h-screen ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                style={{
                    backgroundColor: theme === "dark"
                        ? (isOpen ? "rgba(51, 50, 60, 0.55)" : "rgba(51, 50, 60, 0.25)")
                        : (isOpen ? "rgba(233, 233, 233, 0.55)" : "rgba(233, 233, 233, 0.25)")
                }}
            >
                <div className="absolute w-full h-full">
                    <div className="flex flex-col items-start gap-5 relative top-[106px] left-[18px]">
                        
                        {/* Link para Eventos */}
                        <Link
                            to="/saque-requests"
                            style={linkStyles("/saque-requests")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = hoverColor;
                                e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = isActive("/saque-requests") ? hoverColor : baseColor;
                                e.currentTarget.querySelector('svg')!.style.color = isActive("/saque-requests") ? hoverColor : baseColor;
                            }}
                        >
                            <FaMoneyBill size={20} style={iconStyles("/saque-requests")} />
                            <div className="font-bold text-sm">Ver saques</div>
                        </Link>

                        {/* Link para Admin */}
                        <Link
                            to="/relatorios"
                            style={linkStyles("/relatorios")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = hoverColor;
                                e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = isActive("/relatorios") ? hoverColor : baseColor;
                                e.currentTarget.querySelector('svg')!.style.color = isActive("/relatorios") ? hoverColor : baseColor;
                            }}
                        >
                            <FaChartLine size={20} style={iconStyles("/relatorios")} />
                            <div className="font-bold text-sm">Relatórios</div>
                        </Link>

                        {/* Link para Promotores */}
                        <Link
                            to="/ver-eventos"
                            style={linkStyles("/ver-eventos")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = hoverColor;
                                e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = isActive("/ver-eventos") ? hoverColor : baseColor;
                                e.currentTarget.querySelector('svg')!.style.color = isActive("/ver-eventos") ? hoverColor : baseColor;
                            }}
                        >
                            <FaRegStar size={20} style={iconStyles("/ver-eventos")} />
                            <div className="font-bold text-sm">Ver eventos</div>
                        </Link>

                        <Link
                            to="/clientes-admin"
                            style={linkStyles("/clientes-admin")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = hoverColor;
                                e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = isActive("/clientes-admin") ? hoverColor : baseColor;
                                e.currentTarget.querySelector('svg')!.style.color = isActive("/clientes-admin") ? hoverColor : baseColor;
                            }}
                        >
                            <FiUsers size={20} style={iconStyles("/clientes-admin")} />
                            <div className="font-bold text-sm">Clientes</div>
                        </Link>

                        <img
                            className="hidden lg:block relative self-stretch lg:w-[180px] w-[210px] h-[5.77px] mt-[-2.89px] ml-[-2.89px] mr-[-2.89px] object-cover"
                            alt="Divisor"
                            src="https://c.animaapp.com/tyxgDvEv/img/divisor-8.svg"
                        />

                        <Link
                            to="/configuracao-admin"
                            style={linkStyles("/configuracao-admin")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = hoverColor;
                                e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = isActive("/configuracao-admin") ? hoverColor : baseColor;
                                e.currentTarget.querySelector('svg')!.style.color = isActive("/configuracao-admin") ? hoverColor : baseColor;
                            }}
                        >
                            <IoSettingsOutline size={20} style={iconStyles("/configuracao-admin")} />
                            <div className="font-bold text-sm">Configurações</div>
                        </Link>

                        <div
                            onClick={handleLogout}
                            style={linkStyles("/logout")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = hoverColor;
                                e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = baseColor;
                                e.currentTarget.querySelector('svg')!.style.color = baseColor;
                            }}
                        >
                            <MdExitToApp size={20} style={iconStyles("/logout")} />
                            <div className="font-bold text-sm">Sair</div>
                        </div>
                    </div>
                </div>

                <img
                    className="absolute w-[145px] h-[34px] top-10 left-[20px] object-cover"
                    alt="Logo"
                    src={theme === "dark" ? logo : logob}
                />
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};
