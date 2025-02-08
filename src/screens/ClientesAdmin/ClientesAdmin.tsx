import React, { useState, useEffect, JSX } from "react";
import { SidebarAdmin } from "../../components/SidebarAdmin";
import { Header } from "../../components/Header";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CompanyInfo {
    id: number;
    fantasy_name: string;
    registration_date: string;
    status: string;
    last_payment: string | null;
    event_count: number;
}

export const ClientesAdmin = (): JSX.Element => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [companies, setCompanies] = useState<CompanyInfo[]>([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const { theme } = useTheme();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${API_URL}/api/company-info`);
                if (response.ok) {
                    const data = await response.json();
                    setCompanies(data);
                } else {
                    toast.error("Erro ao carregar informações das empresas.");
                }
            } catch (error) {
                console.error("Erro ao buscar informações das empresas", error);
                toast.error("Erro ao buscar informações das empresas.");
            }
        };

        fetchCompanies();
    }, []);

    const handleDashboardClick = (companyId: number) => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("companyId");
        localStorage.removeItem("fullName");

        localStorage.setItem("companyId", companyId.toString());
        localStorage.setItem("role", "ceo");
        localStorage.setItem("fullName", "Felipe");
        localStorage.setItem("isento", "true");

        window.location.assign("/eventos");
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen"
            style={{
                backgroundColor: theme === "dark" ? "#22252A" : "#D6D6D6",
            }}>
            <SidebarAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <ToastContainer />
            <div className="flex-1 overflow-y-auto p-6 mt-[70px] w-full max-w-[1880px] mx-auto">
                <div className="mb-6">
                    <h1 className="font-semibold mb-4 [font-family:'Poppins',Helvetica] text-[#E1FF01] text-lg sm:text-xl md:text-2xl lg:text-3xl whitespace-nowrap" style={{
                        color: theme === "dark" ? "#F1F1F1" : "#000000",
                    }}>
                        Clientes
                    </h1>
                </div>

                <img className="w-full h-3 object-cover mb-4" alt="Divisor" src="https://c.animaapp.com/tyxgDvEv/img/divisor-7.svg" />

                {/* Tabela com scroll horizontal para dispositivos móveis */}
                <div className="overflow-x-auto w-full mt-5">
                    <div className="min-w-full h-full bg-transparent text-center">
                        <table className="w-full bg-transparent" style={{ tableLayout: 'auto' }}>
                            <thead>
                                <tr className="bg-[#302F38]" style={{ backgroundColor: theme === "dark" ? "#42404a" : "#CACBCB" }}>
                                    <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm rounded-tl-lg rounded-bl-lg w-1/4"
                                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                        Cliente
                                    </th>
                                    <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4"
                                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                        Data de Cadastro
                                    </th>
                                    <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4"
                                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                        Status
                                    </th>
                                    <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4"
                                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                        Último pagamento
                                    </th>
                                    <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4"
                                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                        Eventos
                                    </th>
                                    <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4 rounded-tr-lg rounded-br-lg"
                                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                        Ação
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.length > 0 ? (
                                    companies.map((company) => (
                                        <tr key={company.id} className="border-b border-gray-600">
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1] whitespace-nowrap">
                                                {company.fantasy_name}
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1] whitespace-nowrap">
                                                {new Date(company.registration_date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1] whitespace-nowrap">
                                                {company.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm"
                                                style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>
                                                {company.last_payment ? new Date(company.last_payment).toLocaleDateString('pt-BR') : "Sem registro"}
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1] whitespace-nowrap">
                                                {company.event_count}
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-center whitespace-nowrap">
                                                <button
                                                    className="font-bold px-3 py-1 rounded-2xl hover:bg-[#a8bf00]"
                                                    style={{ backgroundColor: "#E1FF01", color: "#000000" }}
                                                    onClick={() => handleDashboardClick(company.id)}
                                                >
                                                    Ver dashboard
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-xs sm:text-sm text-[#F1F1F1]">
                                            Carregando informações das empresas...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
