import React, { useState, useEffect, useContext, JSX } from "react";
import { Header } from "../../components/Header";
import { API_URL } from "../../config";
import { Sidebar } from "../../components/Sidebar";
import { ModalCadastro } from "../../components/ModalCadastro";
import { ModalConvidado } from "../../components/ModalConvidado";
import { useTheme } from "../../ThemeContext";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, Calendar, Gift, User, Menu, X as XIcon, } from 'lucide-react';

interface Event {
  id: number;
  event_image_url: string;
  event_date: string;
  event_name: string;
}

interface Birthday {
  id: number;
  name: string;
  whatsapp: string;
  event_image_url: string;
  event_date: string;
  created_at: string;
}

export const Eventos = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("eventos");
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getItemsPerPage = () => {
    if (windowWidth <= 768) return 4;
    if (windowWidth <= 1000) return 4;
    if (windowWidth <= 1023) return 4;
    if (windowWidth <= 1100) return 8;
    if (windowWidth <= 1290) return 8;
    return 8;
  };

  const itemsPerPage = getItemsPerPage();

  const fetchEvents = async () => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      setError("ID da empresa não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/list-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_id: companyId }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar eventos.");
      }

      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar eventos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBirthdays = async () => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      setError("ID da empresa não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/list-birthdays/${companyId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar aniversariantes.");
      }

      const data = await response.json();

      if (Array.isArray(data.birthdays)) {
        setBirthdays(data.birthdays);
      } else {
        console.error("Formato de dados inesperado:", data);
        setError("Erro ao processar os aniversariantes.");
      }
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar aniversariantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "eventos") {
      fetchEvents();
    } else if (activeTab === "aniversariantes") {
      fetchBirthdays();
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModal2Open = () => {
    setIsModal2Open(true);
  };

  const handleModal2Close = () => {
    setIsModal2Open(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageBirthdays, setCurrentPageBirthdays] = useState(1);

  const totalPagesEvents = Math.ceil(events.length / itemsPerPage);
  const totalPagesBirthdays = Math.ceil(birthdays.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPagesEvents) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const nextPageBirthdays = () => {
    if (currentPageBirthdays < totalPagesBirthdays) {
      setCurrentPageBirthdays(prev => prev + 1);
    }
  };

  const prevPageBirthdays = () => {
    if (currentPageBirthdays > 1) {
      setCurrentPageBirthdays(prev => prev - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const startIndexBirthdays = (currentPageBirthdays - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);
  const currentBirthdays = birthdays.slice(startIndexBirthdays, startIndexBirthdays + itemsPerPage);

  const getCardClasses = () => {
    const baseClasses = `
      group relative overflow-hidden rounded-2xl bg-gray-800 
      shadow-xl transition-all duration-500 cursor-pointer
      shine-effect
    `;

    if (windowWidth <= 768) {
      return `${baseClasses} 
              mobile-press
              active:shadow-inner
              transform transition-all duration-300
              hover:shadow-2xl
              active:scale-95`;
    }

    return `${baseClasses} 
            card-hover-effect
            hover:shadow-2xl
            [&_img]:grayscale hover:[&_img]:grayscale-0
            [&_img]:transition-all [&_img]:duration-500
            hover:[&_img]:scale-110
            float-animation
            hover:tilt-animation`;
  };

  const getImageClasses = () => {
    const baseClasses = "h-full w-full object-cover transition-all duration-500";

    if (windowWidth <= 768) {
      return baseClasses;
    }

    return `${baseClasses} transform group-hover:scale-110`;
  };

  const getDateBadgeClasses = () => {
    const baseClasses = `
      absolute top-4 right-4 flex flex-col items-center 
      bg-[#e1ff01] rounded-xl p-2 shadow-lg
      transition-all duration-300
    `;

    if (windowWidth <= 768) {
      return `${baseClasses} active:scale-95`;
    }

    return `${baseClasses} group-hover:scale-110 group-hover:rotate-3`;
  };

  const getContentClasses = () => {
    const baseClasses = `
      absolute bottom-0 left-0 right-0 p-4
      transition-all duration-300
    `;

    if (windowWidth <= 768) {
      return baseClasses;
    }

    return `${baseClasses} group-hover:transform group-hover:translate-y-[-4px]`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden" style={{
      backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6",
    }}>
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
                {activeTab === "eventos" ? (
                  <Calendar className="w-6 h-6 text-[#e1ff01]" /> // Ícone para eventos
                ) : (
                  <Gift className="w-6 h-6 text-[#e1ff01]" /> // Ícone para aniversariantes
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{activeTab === "eventos" ? "Eventos" : "Aniversariantes"}</h1>
                <p className="text-gray-400">
                  {activeTab === "eventos"
                    ? "Visualize e gerencie todos os eventos cadastrados."
                    : "Acompanhe e celebre os aniversários."
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeTab === "eventos") {
                  navigate('/eventos/criar');
                } else {
                  handleModalOpen();
                }
              }}
              className="inline-flex items-center px-4 py-2 bg-[#e1ff01] hover:bg-[#b8cc00] 
               rounded-full text-black font-semibold transition-all duration-300 
               transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>{activeTab === "eventos" ? "Novo evento" : "Novo aniversariante"}</span>
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-700/30 p-1 rounded-lg w-fit">
            <button
              onClick={() => handleTabChange("eventos")}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${activeTab === "eventos"
                ? "bg-[#e1ff01] text-black font-semibold"
                : "text-gray-300 hover:bg-gray-700/50"
                }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Eventos
            </button>
            <button
              onClick={() => handleTabChange("aniversariantes")}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${activeTab === "aniversariantes"
                ? "bg-[#e1ff01] text-black font-semibold"
                : "text-gray-300 hover:bg-gray-700/50"
                }`}
            >
              <User className="w-4 h-4 mr-2" />
              Aniversariantes
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e1ff01]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
            {activeTab === "eventos" &&
              currentEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/eventos/detalhes/${event.id}`)}
                  className={getCardClasses()}
                >
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={`${API_URL}/api${event.event_image_url}`}
                      alt={event.event_name}
                      className={getImageClasses()}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>

                  <div className={getDateBadgeClasses()}>
                    <span className="text-2xl font-bold text-black">
                      {new Date(event.event_date).getDate()}
                    </span>
                    <span className="text-sm font-medium text-black">
                      {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>

                  <div className={getContentClasses()}>
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-[#e1ff01] transition-colors">
                      {event.event_name}
                    </h3>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {new Date(event.event_date).toLocaleDateString('pt-BR', {
                        weekday: 'long'
                      })}
                    </p>
                  </div>
                </div>
              ))}

            {activeTab === "aniversariantes" &&
              currentBirthdays.map((birthday) => (
                <div
                  key={birthday.id}
                  onClick={() => {
                    setSelectedBirthday(birthday);
                    handleModal2Open();
                  }}
                  className={getCardClasses()}
                >
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={`${API_URL}/api${birthday.event_image_url}`}
                      alt={birthday.name}
                      className={getImageClasses()}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>

                  <div className={getDateBadgeClasses()}>
                    <span className="text-2xl font-bold text-black">
                      {new Date(birthday.event_date).getDate()}
                    </span>
                    <span className="text-sm font-medium text-black">
                      {new Date(birthday.event_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>

                  <div className={getContentClasses()}>
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-[#e1ff01] transition-colors">
                      {birthday.name}
                    </h3>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {new Date(birthday.event_date).toLocaleDateString('pt-BR', {
                        weekday: 'long'
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && !error && (activeTab === "eventos" ? totalPagesEvents : totalPagesBirthdays) > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={activeTab === "eventos" ? prevPage : prevPageBirthdays}
                disabled={activeTab === "eventos" ? currentPage === 1 : currentPageBirthdays === 1}
                className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center">
                <span className="px-4 py-2 text-sm text-white">
                  Página {activeTab === "eventos" ? currentPage : currentPageBirthdays} de{" "}
                  {activeTab === "eventos" ? totalPagesEvents : totalPagesBirthdays}
                </span>
              </div>

              <button
                onClick={activeTab === "eventos" ? nextPage : nextPageBirthdays}
                disabled={
                  activeTab === "eventos"
                    ? currentPage === totalPagesEvents
                    : currentPageBirthdays === totalPagesBirthdays
                }
                className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </main>

      <ModalCadastro isOpen={isModalOpen} onClose={handleModalClose} />
      <ModalConvidado
        isOpen={isModal2Open}
        onClose={handleModal2Close}
        birthday={selectedBirthday}
      />
    </div>
  );
};

export default Eventos;