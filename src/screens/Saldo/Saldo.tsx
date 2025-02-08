import React, { useState, useEffect, JSX } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import {
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Trash2,
  Menu,
  X as XIcon,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ModalSaque } from "../../components/ModalSaque";

interface WithdrawRequest {
  id: number;
  user_name: string;
  amount: string;
  status: string;
  request_date: string;
}

export const Saldo = (): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { theme } = useTheme();
  const [balance, setBalance] = useState("0.00");
  const [withdrawStats, setWithdrawStats] = useState({
    total_requests: 0,
    total_rejected: 0,
    total_accepted: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState("0.00");
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = {
    desktop: 8,
    mobile: 4,
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchData = async (month?: number, year?: number) => {
    try {
      const company_id = localStorage.getItem("companyId");
      if (!company_id) return toast.error("Company ID não encontrado");

      let url = `${API_URL}/api/participations/total-revenue?company_id=${company_id}`;
      if (month) url += `&month=${month}`;
      if (year) url += `&year=${year}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
        setWithdrawStats(data.withdrawStats);
        setTotalRevenue(data.totalRevenue.total);
        setWithdrawRequests(
          data.withdrawRequests.sort(
            (a: WithdrawRequest, b: WithdrawRequest) =>
              new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
          )
        );
      }
    } catch (error) {
      toast.error("Erro ao buscar dados");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRequests = withdrawRequests.filter((request) =>
    request.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPageItems = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    const startIndex = (currentPage - 1) * perPage;
    return filteredRequests.slice(startIndex, startIndex + perPage);
  };

  const getTotalPages = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    return Math.ceil(filteredRequests.length / perPage);
  };

  const WithdrawCard = ({ request }: { request: WithdrawRequest }) => (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-700/50 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
          <User className="w-5 h-5 text-[#e1ff01]" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{request.user_name}</h3>
          <p className="text-sm text-gray-400">
            {new Date(request.request_date).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white">Valor:</span>
          <span className="text-[#e1ff01] font-semibold">
            R$ {parseFloat(request.amount).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-white">Status:</span>
          <span
            style={{
              color:
                request.status === "pending"
                  ? "#1E90FF"
                  : request.status === "accepted"
                  ? "#E1FF01"
                  : "#F50058",
            }}
          >
            {request.status === "pending"
              ? "Pendente"
              : request.status === "accepted"
              ? "Aprovado"
              : "Recusado"}
          </span>
        </div>
      </div>
    </div>
  );

  const Pagination = ({ isMobile = false }) => {
    const totalPages = getTotalPages(isMobile);
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-4 py-2 text-sm text-white">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-hidden"
      style={{ backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6" }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 px-4 lg:px-8 pt-24 pb-8 w-full mx-auto">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                <Settings className="w-6 h-6 text-[#e1ff01]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Gestão de Saldo</h1>
                <p className="text-gray-400">
                  Monitoramento de saldo e histórico de saques
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar saques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-3 bg-[#e1ff01] text-gray-900 rounded-lg hover:bg-[#b8cc00] transition-colors flex items-center justify-center gap-2"
                aria-label="Novo Saque"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-base font-medium">Novo Saque</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Saldo Disponível",
                value: `R$ ${parseFloat(balance).toFixed(2)}`,
                color: "#e1ff01",
              },
              {
                label: "Total de Solicitações",
                value: withdrawStats.total_requests,
                color: "#fff",
              },
              {
                label: "Saques Aprovados",
                value: withdrawStats.total_accepted,
                color: "#e1ff01",
              },
              {
                label: "Saques Recusados",
                value: withdrawStats.total_rejected,
                color: "#F50058",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-2xl border border-gray-700/50"
              >
                <p className="text-gray-400 text-sm">{item.label}</p>
                <p className="text-xl font-bold mt-2" style={{ color: item.color }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block bg-gray-800 rounded-2xl shadow-xl border border-gray-700/50">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-300">
                  Usuário
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-300">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-300">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {getPageItems(false).map((request) => (
                <tr key={request.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-white">{request.user_name}</td>
                  <td className="px-6 py-4 text-[#e1ff01]">
                    R$ {parseFloat(request.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      style={{
                        color:
                          request.status === "pending"
                            ? "#1E90FF"
                            : request.status === "accepted"
                            ? "#E1FF01"
                            : "#F50058",
                      }}
                    >
                      {request.status === "pending"
                        ? "Pendente"
                        : request.status === "accepted"
                        ? "Aprovado"
                        : "Recusado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(request.request_date).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination isMobile={false} />
        </div>

        <div className="md:hidden grid grid-cols-1 gap-4">
          {getPageItems(true).map((request) => (
            <WithdrawCard key={request.id} request={request} />
          ))}
          <Pagination isMobile={true} />
        </div>

        <ModalSaque
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fetchData={fetchData}
        />
        <ToastContainer />
      </main>
    </div>
  );
};
