import React, { useState, useEffect, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    LineChart,
    Users,
    Ticket,
    DollarSign,
    CheckCircle2,
    CalendarDays, Menu, X as XIcon,
} from "lucide-react";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface PromoterData {
    nome: string;
    created_at: string;
    media_vendas_diarias: string;
    total_ingressos_vendidos: number;
    total_presencas_confirmadas: number;
    total_vendas: string;
    daily_data: { day: string; men: number; women: number }[];
    eventos: { event_name: string; category: string; event_date: string }[];
}

export const RelatorioPromoter = (): JSX.Element => {
    const { id: event_id } = useParams<{ id: string }>();
    const { id: urlPromoterId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [promoterData, setPromoterData] = useState<PromoterData>({
        nome: '',
        created_at: '',
        media_vendas_diarias: '',
        total_ingressos_vendidos: 0,
        total_presencas_confirmadas: 0,
        total_vendas: '',
        daily_data: [],
        eventos: []
    });

    const { theme } = useTheme();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const role = localStorage.getItem("role");
        const localPromoterId = localStorage.getItem("promoterId");

        if (role === "promoter" && localPromoterId && localPromoterId !== urlPromoterId) {
            navigate(`/promoters/relatorio/${localPromoterId}`);
            window.location.reload();
        }
    }, [urlPromoterId, navigate]);

    const fetchPromoterData = async () => {
        try {
            setIsLoading(true);
            const companyId = localStorage.getItem('companyId');
            const promoterId = event_id;

            if (!companyId || !promoterId || !selectedDate) {
                toast.error("Informações de promotor, empresa ou data estão faltando.");
                return;
            }

            const month = selectedDate.getMonth() + 1;
            const year = selectedDate.getFullYear();

            const response = await fetch(`${API_URL}/api/promoter-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_id: companyId,
                    promoter_id: promoterId,
                    month,
                    year
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar informações do promoter.");
            }

            const data = await response.json();
            setPromoterData(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados do promoter.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoterData();
    }, [selectedDate]);

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const chartData = {
        labels: promoterData?.daily_data.map(item => {
            const date = new Date(selectedDate!.getFullYear(), selectedDate!.getMonth(), parseInt(item.day));
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        }) || [],
        datasets: [
            {
                label: "Homens",
                data: promoterData?.daily_data.map(item => item.men) || [],
                borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: "Mulheres",
                data: promoterData?.daily_data.map(item => item.women) || [],
                borderColor: "#E1FF01",
                backgroundColor: "rgba(225, 255, 1, 0.1)",
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                },
            },
            y: {
                grid: {
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                },
            },
        },
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setCurrentPage(1);
    };

    const formatRegistrationDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const statsCards = [
        {
            title: "Média de vendas diárias",
            value: promoterData.media_vendas_diarias,
            icon: <LineChart className="w-5 h-5 text-[#e1ff01]" />,
        },
        {
            title: "Total ingressos vendidos",
            value: promoterData.total_ingressos_vendidos,
            icon: <Ticket className="w-5 h-5 text-[#e1ff01]" />,
        },
        {
            title: "Total presenças confirmadas",
            value: promoterData.total_presencas_confirmadas,
            icon: <CheckCircle2 className="w-5 h-5 text-[#e1ff01]" />,
        },
        {
            title: "Total de vendas",
            value: `R$ ${promoterData.total_vendas}`,
            icon: <DollarSign className="w-5 h-5 text-[#e1ff01]" />,
        }
    ];

    // Pagination logic for eventos
    const totalPages = Math.ceil(promoterData.eventos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEventos = promoterData.eventos.slice(startIndex, endIndex);

    const EventCard = ({ evento }: { evento: PromoterData['eventos'][0] }) => (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 
                    hover:shadow-2xl border border-gray-700/50 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">{evento.event_name}</h3>
                    <p className="text-sm text-[#e1ff01]">{evento.category}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <p className="text-white">{formatEventDate(evento.event_date)}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden"
            style={{ backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6" }}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="flex-1 px-4 lg:px-8 pt-24 pb-8 w-full mx-auto overflow-y-auto">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className="mb-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                <Users className="w-6 h-6 text-[#e1ff01]" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Relatório do Promoter</h1>
                                <p className="text-gray-400">
                                    {promoterData.nome} - Cadastrado em {formatRegistrationDate(promoterData.created_at)}
                                </p>
                            </div>
                        </div>

                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            customInput={
                                <button className="px-4 py-2 bg-[#e1ff01] text-gray-900 rounded-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {selectedDate?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </button>
                            }
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e1ff01]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                            {statsCards.map((card, index) => (
                                <div key={index} className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                            {card.icon}
                                        </div>
                                        <p className="text-gray-400">{card.title}</p>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{card.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Presenças Confirmadas</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                        <span className="text-sm text-gray-400">Homens</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#e1ff01]"></div>
                                        <span className="text-sm text-gray-400">Mulheres</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50">
                            <h2 className="text-xl font-bold text-white mb-6">Eventos Promovidos</h2>

                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-gray-700">
                                            <th className="pb-4 text-gray-400">Evento</th>
                                            <th className="pb-4 text-gray-400">Categoria</th>
                                            <th className="pb-4 text-gray-400">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentEventos.map((evento, index) => (
                                            <tr key={index} className="border-b border-gray-700/50">
                                                <td className="py-4 text-white">{evento.event_name}</td>
                                                <td className="py-4 text-[#e1ff01]">{evento.category}</td>
                                                <td className="py-4 text-white">{formatEventDate(evento.event_date)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden grid grid-cols-1 gap-4">
                                {currentEventos.map((evento, index) => (
                                    <EventCard key={index} evento={evento} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#e1ff01] hover:text-gray-900
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <span className="px-4 py-2 text-sm text-white">
                                            Página {currentPage} de {totalPages}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#e1ff01] hover:text-gray-900
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
            <ToastContainer />
        </div>
    );
};