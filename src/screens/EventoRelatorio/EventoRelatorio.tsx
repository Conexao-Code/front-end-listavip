import React, { useState, useEffect, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { ModalAddUser } from "../../components/ModalAddUser";
import { toast, ToastContainer } from "react-toastify";
import { ModalQrReader } from "../../components/ModalQrReader";
import { ModalConfirmarExclusao } from "../../components/ModalConfirmarExclusao";
import {
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Camera,
  Link,
  BarChart3,
  Trash2,
  Edit,
  Menu,
  X as XIcon,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  Ticket,
  ClipboardX,
  Info,
  UserPlus
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

interface Participant {
  full_name: string;
  cpf: string;
  promoter_name: string;
  telefone: string;
  status: string;
}

interface SalesData {
  event_name: string;
  confirmed_participants: number;
  total_sales: string;
  daily_sales: string;
  total_validated_sales: number;
  participants: Participant[];
}

export const EventoRelatorio = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesData, setSalesData] = useState<SalesData>({
    event_name: "",
    confirmed_participants: 0,
    total_validated_sales: 0,
    total_sales: "0.00",
    daily_sales: "0.00",
    participants: []
  });

  const itemsPerPage = {
    desktop: 6,
    mobile: 4
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleQrModalOpen = () => setIsQrModalOpen(true);
  const handleQrModalClose = () => setIsQrModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleModalOpen3 = (eventId: string) => {
    setCurrentEventId(eventId);
    setIsModalOpen3(true);
  };

  const handleModalClose3 = () => {
    setCurrentEventId(null);
    setIsModalOpen3(false);
  };

  const handleEditEvent = () => {
    if (id) {
      navigate(`/eventos/editar/${id}`);
    } else {
      toast.error("ID do evento não encontrado.");
    }
  };

  const handleCopyLink = () => {
    const eventId = id;
    if (!eventId) {
      toast.error("ID do evento não encontrado");
      return;
    }
    const link = `${window.location.origin}/convite/${eventId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Link de divulgação copiado com sucesso!"))
      .catch(() => toast.error("Erro ao copiar o link de divulgação"));
  };

  const handleScan = async (data: string | null) => {
    if (data) {
      try {
        const response = await fetch(data);
        if (response.ok) {
          const result = await response.json();
          toast.success(`Status do usuário: ${result.status}`);
          refreshSalesData();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Erro ao verificar QR Code");
        }
      } catch (error) {
        console.error("Erro ao verificar QR Code:", error);
        toast.error("Erro ao verificar QR Code");
      }
      handleQrModalClose();
    }
  };

  const refreshSalesData = async () => {
    try {
      const company_id = localStorage.getItem("companyId");
      if (!company_id || !id) {
        toast.error("Company ID ou Event ID não encontrados");
        return;
      }

      const response = await fetch(`${API_URL}/api/event-sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id, event_id: id })
      });

      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao carregar dados de vendas");
      }
    } catch (error) {
      console.error("Erro ao buscar dados de vendas:", error);
      toast.error("Erro ao carregar dados de vendas");
    }
  };

  const handleDeleteEvent = async () => {
    if (!currentEventId) return;
    try {
      const response = await fetch(`${API_URL}/api/event/${currentEventId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Evento excluído com sucesso!");
        setIsModalOpen3(false);
        navigate("/eventos");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao excluir evento.");
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento.");
    }
  };

  useEffect(() => {
    refreshSalesData();
  }, [id]);

  const filteredParticipants = salesData.participants.filter((participant) =>
    participant.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPageItems = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    const startIndex = (currentPage - 1) * perPage;
    return filteredParticipants.slice(startIndex, startIndex + perPage);
  };

  const getTotalPages = (isMobile: boolean) => {
    const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
    return Math.ceil(filteredParticipants.length / perPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-[#e1ff01]/10 text-[#e1ff01] hover:bg-[#e1ff01]/20";
      case "Cancelado":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "Reservado":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    }
  };

  const reservationsCount = salesData.participants.filter(
    (participant) => participant.status === "Reservado"
  ).length;

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
      <div className="p-4 bg-gray-700/30 rounded-full mb-4">
        <ClipboardX className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Nenhum registro encontrado
      </h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">
        Não encontramos nenhum participante registrado. Comece adicionando um novo cadastro.
      </p>
      <button
        onClick={handleModalOpen}
        className="flex items-center gap-2 px-6 py-3 bg-[#e1ff01] text-black rounded-lg hover:bg-[#b8cc00] transition-all duration-200 transform hover:scale-105"
      >
        <UserPlus className="w-5 h-5" />
        <span>Adicionar Participante</span>
      </button>
    </div>
  );

  const ParticipantCard = ({ participant }: { participant: Participant }) => (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50 space-y-4 transition-all duration-200 hover:border-[#e1ff01]/30">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#e1ff01]/10 rounded-lg">
          <Settings className="w-6 h-6 text-[#e1ff01]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{participant.full_name}</h3>
          <div className="flex items-center gap-2">
            {participant.promoter_name ? (
              <p className="text-sm text-gray-400">{participant.promoter_name}</p>
            ) : (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>N/A</span>
                <div className="group relative">
                  <Info className="w-4 h-4 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Promoter não atribuído
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
          <span className="text-sm text-gray-400">WhatsApp</span>
          <span className="text-white font-medium">{participant.telefone}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
          <span className="text-sm text-gray-400">Status</span>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(participant.status)}`}>
            {participant.status}
          </span>
        </div>
      </div>
    </div>
  );

  const Pagination = ({ isMobile = false }) => {
    const totalPages = getTotalPages(isMobile);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-y-auto bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 px-4 lg:px-8 pt-24 pb-8 w-full mx-auto">
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
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                <Settings className="w-6 h-6 text-[#e1ff01]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{salesData.event_name}</h1>
                <p className="text-gray-400">Gestão de Evento</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/eventos/relatorio/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Ver Relatório</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/40 text-white rounded-lg hover:bg-blue-600/60 transition-all duration-200"
              >
                <Link className="w-5 h-5" />
                <span>Copiar Link</span>
              </button>
              <button
                onClick={handleQrModalOpen}
                className="flex items-center gap-2 px-4 py-2 bg-[#e1ff01] text-black rounded-lg hover:bg-[#b8cc00] transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                <span>Abrir Câmera</span>
              </button>
              <button
                onClick={() => handleModalOpen3(id || "")}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
                <span>Excluir</span>
              </button>
              <button
                onClick={handleEditEvent}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
              >
                <Edit className="w-5 h-5" />
                <span>Editar</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50 transition-all duration-200 hover:border-[#e1ff01]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <p className="text-gray-400">Presenças confirmadas</p>
              </div>
              <p className="text-2xl font-bold text-white">{salesData.confirmed_participants}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50 transition-all duration-200 hover:border-[#e1ff01]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                  <Info className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <p className="text-gray-400">Reservas</p>
              </div>
              <p className="text-2xl font-bold text-white">{reservationsCount}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50 transition-all duration-200 hover:border-[#e1ff01]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <p className="text-gray-400">Vendas Antecipadas</p>
              </div>
              <p className="text-2xl font-bold text-white">{salesData.total_validated_sales}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50 transition-all duration-200 hover:border-[#e1ff01]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <p className="text-gray-400">Total de Vendas</p>
              </div>
              <p className="text-2xl font-bold text-white">R$ {salesData.total_sales}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50 transition-all duration-200 hover:border-[#e1ff01]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                  <Ticket className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <p className="text-gray-400">Venda Diária</p>
              </div>
              <p className="text-2xl font-bold text-white">R$ {salesData.daily_sales}</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-800 border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-200 hover:border-[#e1ff01]/30">
            <div className="pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar participantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleModalOpen}
              className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Adicionar cadastro</span>
              </div>
            </button>
          </div>
          <div className="hidden md:block overflow-hidden bg-gray-800 rounded-xl border border-gray-700/50">
            {filteredParticipants.length > 0 ? (
              <div className="max-h-[calc(98vh-300px)] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Nome completo</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Promoter</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">WhatsApp</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {getPageItems(false).map((participant, index) => (
                      <tr key={index} className="hover:bg-gray-700/30 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {participant.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {participant.promoter_name || (
                            <div className="flex items-center gap-1 text-gray-500">
                              <span>-</span>
                              <div className="group relative">
                                <Info className="w-4 h-4 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Promoter não atribuído
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {participant.telefone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(participant.status)}`}>
                            {participant.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState />
            )}
            <Pagination isMobile={false} />
          </div>
          <div className="md:hidden space-y-4">
            {filteredParticipants.length > 0 ? (
              <>
                {getPageItems(true).map((participant, index) => (
                  <ParticipantCard key={index} participant={participant} />
                ))}
                <Pagination isMobile={true} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
        <ModalAddUser
          isOpen={isModalOpen}
          onClose={handleModalClose}
          eventName={salesData.event_name}
          onSuccess={refreshSalesData}
        />
        <ModalQrReader isOpen={isQrModalOpen} onClose={handleQrModalClose} onScan={handleScan} />
        <ModalConfirmarExclusao
          isOpen={isModalOpen3}
          onClose={handleModalClose3}
          onConfirmDelete={handleDeleteEvent}
        />
        <ToastContainer />
      </main>
    </div>
  );
};

export default EventoRelatorio;
