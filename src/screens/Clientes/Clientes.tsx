import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import {
  Users,
  Phone,
  Calendar,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X as XIcon,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

interface Client {
  id: number;
  name: string;
  phone: string;
  gender: string;
  visits_count: number;
  last_visit: string;
}

export const Clientes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { theme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Ajusta a quantidade de itens por página com base na largura da janela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(10);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      const company_id = localStorage.getItem("companyId");
      if (!company_id) {
        toast.error("Company ID não encontrado.");
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/api/clients-list?company_id=${company_id}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos clientes");
        }
        const data: Client[] = await response.json();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar dados dos clientes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
    );
    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchQuery, clients]);

  const translateGender = (gender: string) => {
    return gender === "male"
      ? "Masculino"
      : gender === "female"
      ? "Feminino"
      : "Outro";
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const ClientCard = ({ client }: { client: Client }) => (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700/50 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
          <User className="w-5 h-5 text-[#e1ff01]" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{client.name}</h3>
          <p className="text-sm text-gray-400">
            {translateGender(client.gender)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
          <Phone className="w-5 h-5 text-[#e1ff01]" />
        </div>
        <p className="text-[#e1ff01] font-medium">{client.phone}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
          <Calendar className="w-5 h-5 text-[#e1ff01]" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Última visita</p>
          <p className="text-white">
            {client.last_visit ? formatDate(client.last_visit) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-y-auto"
      style={{
        backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6",
      }}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                <Users className="w-6 h-6 text-[#e1ff01]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Clientes</h1>
                <p className="text-gray-400">
                  Registros detalhados dos nossos clientes para oferecer um
                  atendimento personalizado e eficiente.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
              />
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
            <div className="hidden md:block bg-gray-800 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gray-800/50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Nome completo
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          WhatsApp
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Gênero
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Última Visita
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {currentClients.map((client) => (
                        <tr
                          key={client.id}
                          className="hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {client.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e1ff01]">
                            {client.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {translateGender(client.gender)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {client.last_visit
                              ? formatDate(client.last_visit)
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};
