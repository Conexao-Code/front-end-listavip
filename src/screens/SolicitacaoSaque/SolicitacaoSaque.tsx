import React, { useState, useEffect, JSX } from "react";
import { useParams } from "react-router-dom";
import { SidebarAdmin } from "../../components/SidebarAdmin";
import { Header } from "../../components/Header";
import { ModalSaque } from "../../components/ModalSaque";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { FiCalendar } from "react-icons/fi";
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface WithdrawStats {
    total_solicitacoes: number;
    solicitacoes_pendentes: number;
    solicitacoes_aprovadas: number;
    valor_total_solicitacoes: number;
}

interface WithdrawRequest {
    id: number; // Adicionado
    nome_usuario: string;
    valor_requisicao: string;
    status_requisicao: string;
    data_solicitacao: string;
}


interface DailyRevenue {
    dia: number;
    valor_faturado: number;
}

export const SolicitacaoSaque = (): JSX.Element => {
    const { id: event_id } = useParams<{ id: string }>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tableDate, setTableDate] = useState<Date | null>(new Date());
    const [chartDate, setChartDate] = useState<Date | null>(new Date());
    const { theme } = useTheme();
    const [withdrawStats, setWithdrawStats] = useState<WithdrawStats>({
        total_solicitacoes: 0,
        solicitacoes_pendentes: 0,
        solicitacoes_aprovadas: 0,
        valor_total_solicitacoes: 0
    });
    const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchStatsData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/financial-data?`);
            const data = await response.json();

            if (response.ok) {
                setWithdrawStats(data.solicitacoesTotais);
            } else {
                toast.error("Erro ao buscar dados estatísticos");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor", error);
            toast.error("Erro ao conectar com o servidor");
        }
    };

    const fetchTableData = async () => {
        const month = tableDate ? tableDate.getMonth() + 1 : new Date().getMonth() + 1;
        const year = tableDate ? tableDate.getFullYear() : new Date().getFullYear();

        try {
            const response = await fetch(`${API_URL}/api/financial-data?mes=${month}&ano=${year}`);
            const data = await response.json();

            if (response.ok) {
                setWithdrawRequests(data.listaSolicitacoes);
            } else {
                toast.error("Erro ao buscar dados financeiros");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor", error);
            toast.error("Erro ao conectar com o servidor");
        }
    };

    const fetchChartData = async () => {
        const month = chartDate ? chartDate.getMonth() + 1 : new Date().getMonth() + 1;
        const year = chartDate ? chartDate.getFullYear() : new Date().getFullYear();

        try {
            const response = await fetch(`${API_URL}/api/financial-data?mes=${month}&ano=${year}`);
            const data = await response.json();

            if (response.ok) {
                setDailyRevenue(data.faturamentoDiario);
            } else {
                toast.error("Erro ao buscar dados de faturamento");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor", error);
            toast.error("Erro ao conectar com o servidor");
        }
    };

    const rejectRequest = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/reject-withdraw-request/${id}`, {
                method: "PATCH",
            });

            if (response.ok) {
                toast.success("Solicitação recusada com sucesso.");
                fetchTableData();
                fetchStatsData();
            } else {
                toast.error("Erro ao recusar solicitação de saque.");
            }
        } catch (error) {
            console.error("Erro ao recusar solicitação de saque", error);
            toast.error("Erro ao recusar solicitação de saque.");
        }
    };

    const approveRequest = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/approve-withdraw-request/${id}`, {
                method: "PATCH",
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Solicitação aprovada!");
                fetchTableData();
                fetchStatsData();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Erro ao aprovar solicitação de saque.");
            }
        } catch (error) {
            console.error("Erro ao aprovar solicitação de saque", error);
            toast.error("Erro ao aprovar solicitação de saque.");
        }
    };




    useEffect(() => {
        fetchStatsData();
    }, []);

    useEffect(() => {
        fetchTableData();
    }, [tableDate]);

    useEffect(() => {
        fetchChartData();
    }, [chartDate]);

    const chartData = {
        labels: dailyRevenue.map(item => new Date(2024, chartDate?.getMonth() || 0, item.dia).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: "Faturamento Diário",
                data: dailyRevenue.map(item => item.valor_faturado),
                borderColor: "#E1FF01",
                backgroundColor: "rgba(225, 255, 1, 0.1)",
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true, titleColor: "#fff", bodyColor: "#fff" },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            },
        },
        elements: { point: { radius: 3 } },
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden" style={{ backgroundColor: theme === "dark" ? "#22252A" : "#D6D6D6" }}>
            <SidebarAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <ToastContainer />
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 mt-[70px] w-full max-w-[1880px] mx-auto">
                <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-left w-full">
                        <h1 className="font-semibold [font-family:'Poppins',Helvetica] text-3xl" style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}>Solicitação de saque</h1>
                    </div>
                </div>

                <img className="w-full h-3 object-cover mt-4" alt="Divisor" src="https://c.animaapp.com/tyxgDvEv/img/divisor-7.svg" />

                <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-4 mt-2">
                    {[{ label: "Total de solicitações", value: withdrawStats.total_solicitacoes }, { label: "Solicitações pendentes", value: withdrawStats.solicitacoes_pendentes }, { label: "Solicitações aprovadas", value: withdrawStats.solicitacoes_aprovadas }, { label: "Valor total de solicitações", value: `R$ ${parseFloat(withdrawStats.valor_total_solicitacoes?.toString() || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }]
                        .map((item, index) => (
                            <div key={index} className="border border-solid border-[#575560] flex flex-col rounded-lg p-6 w-full max-w-[350px] lg:max-w-[420px] text-left" style={{ backgroundColor: theme === "dark" ? "rgba(51, 50, 60, 0.25)" : "#CACBCB" }}>
                                <div className="flex items-center mb-2">
                                    <p className="text-[#E1FF01] font-medium text-sm whitespace-nowrap">{item.label}</p>
                                </div>
                                <span className="text-2xl font-bold whitespace-nowrap" style={{ color: theme === "dark" ? "#F1F1F1" : "#000000", fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>{item.value}</span>
                            </div>
                        ))}
                </div>

                <div className="mt-6 p-4 overflow-x-auto w-full rounded-lg border border-solid border-[#575560]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#E1FF01] font-bold text-lg">Lista de solicitações</h2>
                        <div className="flex justify-end w-full lg:w-auto">
                            <DatePicker
                                selected={tableDate}
                                onChange={date => setTableDate(date)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                customInput={
                                    <button className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: "#E1FF01", color: "#22252A" }}>
                                        <FiCalendar className="mr-1 sm:mr-2" size={16} />
                                        {tableDate ? tableDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : "Selecionar Mês"}
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
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs rounded-tl-lg rounded-bl-lg sm:text-sm w-1/4">Usuário</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Valor</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Status</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-xs sm:text-sm w-1/4">Data da Solicitação</th>
                                        <th className="p-2 sm:p-3 font-medium text-[#F1F1F1] text-center rounded-tr-lg rounded-br-lg text-xs sm:text-sm w-1/4">Ação</th>
                                    </tr>
                                </thead>
                            </table>

                            <div style={{ maxHeight: '120px', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="scrollbar-hidden">
                                <style>
                                    {`
        .scrollbar-hidden::-webkit-scrollbar {
            display: none;
        }
        `}
                                </style>
                                <table className="w-full bg-transparent" style={{ tableLayout: 'fixed' }}>
                                    <tbody>
                                        {withdrawRequests.map((request, index) => {
                                            let statusColor;
                                            let statusText;

                                            switch (request.status_requisicao) {
                                                case "pending":
                                                    statusColor = "#F1F1F1";
                                                    statusText = "Pendente";
                                                    break;
                                                case "accepted":
                                                    statusColor = "#E1FF01";
                                                    statusText = "Aprovado";
                                                    break;
                                                case "rejected":
                                                    statusColor = "#F50058";
                                                    statusText = "Recusado";
                                                    break;
                                                default:
                                                    statusColor = "#F1F1F1";
                                                    statusText = request.status_requisicao;
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">{request.nome_usuario}</td>
                                                    <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm">
                                                        <span style={{ color: "#E1FF01" }}>R$</span>{" "}
                                                        <span style={{ color: "#F1F1F1" }}>{parseFloat(request.valor_requisicao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </td>
                                                    <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm" style={{ color: statusColor }}>{statusText}</td>
                                                    <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-[#F1F1F1]">{new Date(request.data_solicitacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                    <td className="p-2 font-bold sm:p-3 text-xs sm:text-sm text-center flex justify-center items-center sm:space-x-2 space-y-2 sm:space-y-0 flex-col sm:flex-row">
                                                        {request.status_requisicao === "pending" && (
                                                            <>
                                                                <button
                                                                    className="font-bold px-3 py-1 rounded-2xl hover:bg-[#a8bf00]"
                                                                    style={{ backgroundColor: "#E1FF01", color: "#000000" }}
                                                                    onClick={() => approveRequest(request.id)}
                                                                >
                                                                    Aprovar
                                                                </button>
                                                                <button
                                                                    className="font-bold px-3 py-1 rounded-2xl hover:bg-[#B4B4B4]"
                                                                    style={{ backgroundColor: "#F1F1F1", color: "#000000" }}
                                                                    onClick={() => rejectRequest(request.id)}
                                                                >
                                                                    Recusar
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-lg border border-solid border-[#575560]">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                        <h2 className="text-[#E1FF01] font-bold text-lg">Faturamento do Mês</h2>
                        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
                            <DatePicker
                                selected={chartDate}
                                onChange={date => setChartDate(date)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                customInput={
                                    <button className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: "#E1FF01", color: "#22252A" }}>
                                        <FiCalendar className="mr-1 sm:mr-2" size={16} />
                                        {chartDate ? chartDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : "Selecionar Mês"}
                                    </button>
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full h-38 sm:h-64 md:h-35 lg:h-34">
                        <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
