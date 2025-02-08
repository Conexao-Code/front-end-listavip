import React, { useState, useEffect, JSX } from "react";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { toast, ToastContainer } from 'react-toastify';
import { Settings, Search, ChevronLeft, ChevronRight, User, CheckCircle2, XCircle, Menu, X as XIcon, } from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';

interface Promoter {
    id: number;
    full_name: string;
    email: string;
    created_at: string;
}

export const AprovarPromoter = (): JSX.Element => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [promoters, setPromoters] = useState<Promoter[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { theme } = useTheme();
    const itemsPerPage = {
        desktop: 8,
        mobile: 4
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const fetchPromoters = async () => {
            try {
                const companyId = localStorage.getItem('companyId');
                if (!companyId) throw new Error('Company ID não encontrado');

                const response = await fetch(`${API_URL}/api/promoters?company_id=${companyId}`);
                if (!response.ok) throw new Error('Erro ao buscar promoters');

                const data = await response.json();
                setPromoters(data);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar promoters");
            }
        };
        fetchPromoters();
    }, []);

    const filteredPromoters = promoters.filter(promoter =>
        promoter.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promoter.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPageItems = (isMobile: boolean) => {
        const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
        const startIndex = (currentPage - 1) * perPage;
        return filteredPromoters.slice(startIndex, startIndex + perPage);
    };

    const getTotalPages = (isMobile: boolean) => {
        const perPage = isMobile ? itemsPerPage.mobile : itemsPerPage.desktop;
        return Math.ceil(filteredPromoters.length / perPage);
    };

    const handleApproval = async (id: number, action: 'approve' | 'reject') => {
        try {
            const response = await fetch(`${API_URL}/api/${id}/${action}`, { method: 'POST' });
            if (!response.ok) throw new Error(`Erro ao ${action === 'approve' ? 'aprovar' : 'recusar'}`);

            setPromoters(promoters.filter(p => p.id !== id));
            toast.success(`Promoter ${action === 'approve' ? 'aprovado' : 'recusado'} com sucesso`);
        } catch (error) {
            console.error(error);
            toast.error(`Erro ao processar solicitação`);
        }
    };

    const PromoterCard = ({ promoter }: { promoter: Promoter }) => (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-700/50 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <User className="w-5 h-5 text-[#e1ff01]" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">{promoter.full_name}</h3>
                    <p className="text-sm text-gray-400">{promoter.email}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cadastro:</span>
                    <span className="text-gray-300">
                        {new Date(promoter.created_at).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleApproval(promoter.id, 'reject')}
                        className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 
                               transition-colors flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-4 h-4" />
                        Recusar
                    </button>
                    <button
                        onClick={() => handleApproval(promoter.id, 'approve')}
                        className="w-full px-4 py-2 bg-[#e1ff01]/20 text-[#e1ff01] rounded-lg hover:bg-[#e1ff01]/30 
                               transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprovar
                    </button>
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
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-gray-700 text-white hover:bg-[#b8cc00] disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="px-4 py-2 text-sm text-white">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden"
            style={{ backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6" }}>
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
                                <Settings className="w-6 h-6 text-[#e1ff01]" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Aprovar Promoters</h1>
                                <p className="text-gray-400">
                                    Gerencie as solicitações de cadastro de promoters
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar promoters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                                       focus:ring-[#e1ff01]/50 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-gray-800 rounded-2xl shadow-xl border border-gray-700/50">
                    <table className="w-full">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Nome</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Email</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Data Cadastro</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {getPageItems(false).map((promoter) => (
                                <tr key={promoter.id} className="hover:bg-gray-700/30">
                                    <td className="px-6 py-4 text-white">{promoter.full_name}</td>
                                    <td className="px-6 py-4 text-gray-300">{promoter.email}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {new Date(promoter.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproval(promoter.id, 'reject')}
                                                className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 
                                                       transition-colors flex items-center gap-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Recusar
                                            </button>
                                            <button
                                                onClick={() => handleApproval(promoter.id, 'approve')}
                                                className="px-3 py-1 bg-[#e1ff01]/20 text-[#e1ff01] rounded-lg hover:bg-[#e1ff01]/30 
                                                       transition-colors flex items-center gap-1"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Aprovar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination isMobile={false} />
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {getPageItems(true).map((promoter) => (
                        <PromoterCard key={promoter.id} promoter={promoter} />
                    ))}
                    <Pagination isMobile={true} />
                </div>

                <ToastContainer />
            </main>
        </div>
    );
};