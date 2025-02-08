import React, { useState, useEffect, JSX, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  Tag,
  TrendingUp,
  Menu,
  X as XIcon,
} from "lucide-react";
import { ChartOptions } from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export const RelatorioInfoEvento = (): JSX.Element => {
  const { id: event_id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<{
    event_name: string;
    category: string;
    event_date: string;
    revenue_men: string;
    revenue_women: string;
    total_revenue: string;
    total_participants: number;
    hourly_data: { time: string; men: number; women: number }[];
  } | null>(null);

  const { theme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      const company_id = localStorage.getItem("companyId");
      if (!company_id) {
        toast.error("ID da empresa não encontrado.");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/event-info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_id, event_id }),
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar informações do evento.");
        }
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Erro ao carregar dados do evento.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [event_id]);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  const aggregatedData = useMemo(() => {
    if (!eventData?.hourly_data) return { labels: [], menData: [], womenData: [] };
    const groups: { [key: string]: { men: number; women: number; timestamp: number } } = {};
    eventData.hourly_data.forEach((item) => {
      const d = new Date(item.time);
      const isoDate = d.toISOString().substring(0, 10);
      if (!groups[isoDate]) {
        groups[isoDate] = { men: 0, women: 0, timestamp: d.getTime() };
      }
      groups[isoDate].men += item.men;
      groups[isoDate].women += item.women;
    });
    const sortedKeys = Object.keys(groups).sort(
      (a, b) => groups[a].timestamp - groups[b].timestamp
    );
    const labels = sortedKeys.map((key) => {
      const d = new Date(key);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    });
    const menData = sortedKeys.map((key) => groups[key].men);
    const womenData = sortedKeys.map((key) => groups[key].women);
    return { labels, menData, womenData };
  }, [eventData]);

  const statsCards = [
    {
      title: "Vendas para Mulheres",
      value: eventData?.revenue_women ? `R$ ${eventData.revenue_women}` : "R$ 0",
      icon: <Users className="w-5 h-5 text-[#e1ff01]" />,
    },
    {
      title: "Vendas para Homens",
      value: eventData?.revenue_men ? `R$ ${eventData.revenue_men}` : "R$ 0",
      icon: <Users className="w-5 h-5 text-[#e1ff01]" />,
    },
    {
      title: "Total de Vendas",
      value: eventData?.total_revenue ? `R$ ${eventData.total_revenue}` : "R$ 0",
      icon: <DollarSign className="w-5 h-5 text-[#e1ff01]" />,
    },
    {
      title: "Total de Participantes",
      value: eventData?.total_participants !== undefined
        ? eventData.total_participants.toString()
        : "0",
      icon: <TrendingUp className="w-5 h-5 text-[#e1ff01]" />,
    },
  ];

  const chartData = {
    labels: aggregatedData.labels,
    datasets: [
      {
        label: "Homens",
        data: aggregatedData.menData,
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#4A90E2",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Mulheres",
        data: aggregatedData.womenData,
        borderColor: "#E1FF01",
        backgroundColor: "rgba(225, 255, 1, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#E1FF01",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: theme === "dark" ? "#FFFFFF" : "#000000",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor:
          theme === "dark"
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
        titleColor: theme === "dark" ? "#FFFFFF" : "#000000",
        bodyColor: theme === "dark" ? "#FFFFFF" : "#000000",
        padding: 12,
        borderColor:
          theme === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          title: (context: any) => `Data: ${context[0].label}`,
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y} participantes`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
          font: {
            size: 11,
          },
          padding: 8,
          callback: (value) =>
            typeof value === "number" ? value.toFixed(0) : value,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-hidden"
      style={{ backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6" }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 px-4 lg:px-8 pt-24 pb-8 w-full mx-auto overflow-y-auto">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e1ff01]"></div>
          </div>
        ) : (
          <>
            <div className="mb-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-[#e1ff01]" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Relatório do Evento
                    </h1>
                    {eventData && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[#e1ff01] font-semibold">
                          {eventData.event_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">
                            {eventData.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">
                            {formatEventDate(eventData.event_date)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50"
                >
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
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">
                  Participantes por Dia
                </h2>
              </div>
              <div className="h-[400px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default RelatorioInfoEvento;
