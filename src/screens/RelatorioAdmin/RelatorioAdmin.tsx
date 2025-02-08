import React, { useState, useEffect, JSX } from "react";
import { SidebarAdmin } from "../../components/SidebarAdmin";
import { Header } from "../../components/Header";
import { useTheme } from "../../ThemeContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from "../../config";

interface RevenueData {
    method: string;
    total_revenue: number;
    count: number;
}

interface ClientData {
    metric: string;
    quantity: number;
}

export const RelatorioAdmin = (): JSX.Element => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useTheme();
    const [revenueDate, setRevenueDate] = useState<Date | null>(new Date());
    const [clientDate, setClientDate] = useState<Date | null>(new Date());
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [clientData, setClientData] = useState<ClientData[]>([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchRevenueData = async () => {
        try {
            if (revenueDate) {
                const month = revenueDate.getMonth() + 1;
                const year = revenueDate.getFullYear();
                const response = await fetch(`${API_URL}/api/payment-method-metrics?month=${month}&year=${year}`);
                if (response.ok) {
                    const data = await response.json();
                    setRevenueData([
                        { method: 'Cartão de crédito', total_revenue: data['Cartão de crédito'].total_revenue, count: data['Cartão de crédito'].count },
                        { method: 'Pix', total_revenue: data['Pix'].total_revenue, count: data['Pix'].count },
                    ]);
                } else {
                    toast.error("Erro ao carregar dados de faturamento.");
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados de faturamento", error);
            toast.error("Erro ao buscar dados de faturamento.");
        }
    };

    const fetchClientData = async () => {
        try {
            if (clientDate) {
                const month = clientDate.getMonth() + 1;
                const year = clientDate.getFullYear();
                const response = await fetch(`${API_URL}/api/client-metrics?month=${month}&year=${year}`);
                if (response.ok) {
                    const data = await response.json();
                    setClientData(data);
                } else {
                    toast.error("Erro ao carregar dados de clientes.");
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados de clientes", error);
            toast.error("Erro ao buscar dados de clientes.");
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [revenueDate]);

    useEffect(() => {
        fetchClientData();
    }, [clientDate]);

    return (
        <div
            className="flex flex-col lg:flex-row h-screen"
            style={{
                backgroundColor: theme === "dark" ? "#22252A" : "#D6D6D6",
            }}
        >
            <SidebarAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <ToastContainer />
            <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-6 mt-[70px] w-full max-w-[95vw] lg:max-w-[1880px] mx-auto">
                <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-left w-full">
                        <h1 className="font-semibold [font-family:'Poppins',Helvetica] text-3xl" style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>Relatórios de Faturamento e Clientes</h1>
                    </div>
                </div>

                <img className="w-full h-3 object-cover mt-4" alt="Divisor" src="https://c.animaapp.com/tyxgDvEv/img/divisor-7.svg" />

                <div className="mt-6 p-4 overflow-x-auto w-full rounded-lg border border-solid border-[#575560]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#F1F1F1] font-bold text-lg">Relatórios de Faturamento</h2>
                        <div className="flex justify-end w-full lg:w-auto">
                            <DatePicker
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                selected={revenueDate}
                                onChange={(date) => setRevenueDate(date)}
                                customInput={
                                    <button className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: "#E1FF01", color: "#22252A" }}>
                                        <FiCalendar className="mr-1 sm:mr-2" size={16} />
                                        {revenueDate ? revenueDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : "Selecionar Mês"}
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    <div className="min-w-full h-full bg-transparent text-center">
                        <div className="w-full">
                            <table className="w-full bg-transparent" style={{ tableLayout: 'fixed' }}>
                                <thead>
                                    <tr className="bg-[#302F38]" style={{ backgroundColor: theme === "dark" ? "#42404a" : "#CACBCB" }}>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs rounded-tl-lg rounded-bl-lg sm:text-sm w-1/4">Método de pagamento</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Faturamento</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Período</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Transações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revenueData.map((data) => (
                                        <tr key={data.method}>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">{data.method}</td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm">
                                                <span style={{ color: "#E1FF01" }}>R$</span>{" "}
                                                <span style={{ color: "#F1F1F1" }}>{data.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">
                                                {revenueDate?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">{data.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 overflow-x-auto w-full rounded-lg border border-solid border-[#575560]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#F1F1F1] font-bold text-lg">Quantidade de Clientes</h2>

                    </div>

                    <div className="min-w-full h-full bg-transparent text-center">
                        <div className="w-full">
                            <table className="w-full bg-transparent" style={{ tableLayout: 'fixed' }}>
                                <thead>
                                    <tr className="bg-[#302F38]" style={{ backgroundColor: theme === "dark" ? "#42404a" : "#CACBCB" }}>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs rounded-tl-lg rounded-bl-lg sm:text-sm w-1/4">Métrica</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientData.map((data) => (
                                        <tr key={data.metric}>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">{data.metric}</td>
                                            <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">{data.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
