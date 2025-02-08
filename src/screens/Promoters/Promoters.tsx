import React, { useState, useEffect } from "react";
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
  Link2,
  FileBarChart,
  Trash2,
  Users,
  Menu,
  X as XIcon,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface Promoter {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  total_sales?: number;
  revenue_generated?: number;
  token: string;
  companyName: string;
}

export const Promoter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [filteredPromoters, setFilteredPromoters] = useState<Promoter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = {
    desktop: 9,
    mobile: 2,
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { theme } = useTheme();

  useEffect(() => {
    const fetchPromoters = async () => {
      const company_id = localStorage.getItem("companyId");
      if (!company_id) {
        toast.error("Company ID não encontrado.");
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/promoters-list?company_id=${company_id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos promoters");
        }
        const data: Promoter[] = await response.json();
        setPromoters(data);
        setFilteredPromoters(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar dados dos promoters.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromoters();
  }, []);

  useEffect(() => {
    const filtered = promoters.filter(promoter =>
      promoter.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPromoters(filtered);
    setCurrentPage(1);
  }, [searchQuery, promoters]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/${id}/delete`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar o promoter");
      }
      toast.success("Promoter deletado com sucesso");
      setPromoters(prev => prev.filter(promoter => promoter.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar promoter");
    }
  };

  const handleCopyURL = (companyName: string, token: string) => {
    if (!companyName || !token) {
      toast.error("Informações do promoter incompletas.");
      return;
    }
    const formattedCompanyName = companyName.replace(/\s+/g, "-");
    const url = `${window.location.origin}/eventos/${encodeURIComponent(formattedCompanyName)}/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copiada para a área de transferência!");
  };

  const getPageItems = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredPromoters.slice(startIndex, endIndex);
  };

  const getTotalPages = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    return Math.ceil(filteredPromoters.length / perPage);
  };

  const PromoterCard = ({ promoter }: { promoter: Promoter }) => (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700/50 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
          <User className="w-5 h-5 text-[#e1ff01]" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{promoter.full_name}</h3>
          <p className="text-sm text-gray-400">{promoter.total_sales || 0} vendas</p>
          <p className="text-sm font-semibold text-[#e1ff01]">
            R$ {promoter.revenue_generated?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleCopyURL(promoter.companyName, promoter.token)}
          className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          Copiar URL
        </button>
        <button
          onClick={() => navigate(`/promoters/relatorio/${promoter.id}`)}
          className="w-full px-4 py-2 bg-[#e1ff01]/20 text-[#e1ff01] rounded-lg hover:bg-[#e1ff01]/30 transition-colors flex items-center justify-center gap-2"
        >
          <FileBarChart className="w-4 h-4" />
          Ver relatório
        </button>
        <button
          onClick={() => handleDelete(promoter.id)}
          className="w-full px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remover
        </button>
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
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <span className="px-4 py-2 text-sm text-white">
              Página {currentPage} de {totalPages}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col lg:flex-row h-screen"
      style={{ backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6" }}
    >
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
                <Settings className="w-6 h-6 text-[#e1ff01]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Promoters</h1>
                <p className="text-gray-400">
                  Monitore o desempenho e cadastros de cada promoter.
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
                  placeholder="Buscar promoters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => navigate("/promoters/aprovar")}
                className="w-full sm:w-auto px-4 py-3 bg-[#e1ff01] text-gray-900 rounded-lg hover:bg-[#b8cc00] transition-colors flex items-center justify-center gap-2"
                aria-label="Aprovar Promoters"
              >
                <Users className="w-5 h-5" />
                Aprovar Promoters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e1ff01]"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="max-h-[calc(98vh-300px)] overflow-y-auto hidden md:block bg-gray-800 rounded-2xl shadow-xl border border-gray-700/50">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Nome completo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Total de vendas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Receita Gerada
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {getPageItems(false).map((promoter) => (
                    <tr key={promoter.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {promoter.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {promoter.total_sales || 0} {promoter.total_sales === 1 ? "venda" : "vendas"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#e1ff01]">
                        R$ {promoter.revenue_generated?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyURL(promoter.companyName, promoter.token)}
                            className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center gap-1"
                          >
                            <Link2 className="w-4 h-4" />
                            URL
                          </button>
                          <button
                            onClick={() => navigate(`/promoters/relatorio/${promoter.id}`)}
                            className="px-3 py-1 bg-[#e1ff01]/20 text-[#e1ff01] rounded-lg hover:bg-[#e1ff01]/30 transition-colors flex items-center gap-1"
                          >
                            <FileBarChart className="w-4 h-4" />
                            Relatório
                          </button>
                          <button
                            onClick={() => handleDelete(promoter.id)}
                            className="px-3 py-1 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
              {getPageItems(true).map((promoter) => (
                <PromoterCard key={promoter.id} promoter={promoter} />
              ))}
            </div>

            <div className="hidden md:block">
              <Pagination isMobile={false} />
            </div>

            <div className="md:hidden">
              <Pagination isMobile={true} />
            </div>
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default Promoter;
