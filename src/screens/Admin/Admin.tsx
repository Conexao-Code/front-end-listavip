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
  Menu,
  X as XIcon,
  Users,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ModalCreateUser } from "../../components/ModalCreateUser";

interface Admin {
  id: number;
  name: string;
  role: string;
}

export const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = {
    desktop: 10,
    mobile: 4,
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const { theme } = useTheme();

  const translateRole = (role: string) => {
    const roles: { [key: string]: string } = {
      Administrador: "Administrador",
      Moderador: "Moderador",
      Recepcionista: "Recepcionista",
    };
    return roles[role] || role;
  };

  const handleDeleteUser = async (id: number) => {
    const company_id = localStorage.getItem("companyId");
    try {
      const response = await fetch(
        `${API_URL}/api/users/${id}?company_id=${company_id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário");
      }
      toast.success("Usuário deletado com sucesso");
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar o usuário.");
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      const company_id = localStorage.getItem("companyId");
      if (!company_id) {
        toast.error("Company ID não encontrado.");
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/api/users-list?company_id=${company_id}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos usuários");
        }
        const data: Admin[] = await response.json();
        setAdmins(data);
        setFilteredAdmins(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar dados dos usuários.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    const filtered = admins.filter((admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAdmins(filtered);
    setCurrentPage(1);
  }, [searchQuery, admins]);

  const getPageItems = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredAdmins.slice(startIndex, endIndex);
  };

  const getTotalPages = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    return Math.ceil(filteredAdmins.length / perPage);
  };

  const AdminCard = ({ admin }: { admin: Admin }) => (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700/50 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
          <User className="w-5 h-5 text-[#e1ff01]" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{admin.name}</h3>
          <p className="text-sm text-gray-400">{translateRole(admin.role)}</p>
        </div>
      </div>
      <button
        onClick={() => handleDeleteUser(admin.id)}
        className="w-full px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
      >
        Remover usuário
      </button>
    </div>
  );

  const Pagination = ({ isMobile = false }: { isMobile?: boolean }) => {
    const totalPages = getTotalPages(isMobile);
    if (totalPages <= 1) return null;
    return (
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                <h1 className="text-4xl font-bold text-white">Administração</h1>
                <p className="text-gray-400">
                  Gerencie os usuários e suas permissões de acesso ao sistema.
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
                  placeholder="Buscar usuários..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-3 bg-[#e1ff01] text-gray-900 rounded-lg hover:bg-[#b8cc00] transition-colors flex items-center justify-center gap-2"
                aria-label="Novo Usuário"
              >
                <Users className="w-5 h-5" />
                Novo Usuário
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
                      Cargo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {getPageItems(false).map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {admin.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {translateRole(admin.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => handleDeleteUser(admin.id)}
                          className="px-3 py-1 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination isMobile={false} />
            </div>
            {/* Mobile Card View: Exibindo 2 cards por página (em 1 coluna) */}
            <div className="md:hidden grid grid-cols-1 gap-6">
              {getPageItems(true).map((admin) => (
                <AdminCard key={admin.id} admin={admin} />
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
      <ModalCreateUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={async () => {
          const company_id = localStorage.getItem("companyId");
          if (!company_id) {
            toast.error("Company ID não encontrado.");
            return;
          }
          try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/users-list?company_id=${company_id}`);
            if (!response.ok) {
              throw new Error("Erro ao buscar os dados dos usuários");
            }
            const data = await response.json();
            setAdmins(data);
            setFilteredAdmins(data);
          } catch (error) {
            console.error(error);
            toast.error("Erro ao buscar dados dos usuários.");
          } finally {
            setIsLoading(false);
          }
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default Admin;
