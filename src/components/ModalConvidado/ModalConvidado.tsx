import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { X, Users, CheckCircle, Link as LinkIcon } from "lucide-react";
import { useTheme } from "../../ThemeContext";
import { toast, ToastContainer } from 'react-toastify';

export interface Birthday {
    id: number;
    name: string;
    whatsapp: string;
    event_image_url: string;
    event_date: string;
    created_at: string;
}

interface ModalConvidadoProps {
    isOpen: boolean;
    onClose: () => void;
    birthday: Birthday | null;
}

export const ModalConvidado = ({ isOpen, onClose, birthday }: ModalConvidadoProps) => {
    const [guestsCount, setGuestsCount] = useState<number | null>(null);
    const [confirmedGuests, setConfirmedGuests] = useState<number | null>(null);
    const { theme } = useTheme();
    const [fantasyName, setFantasyName] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (birthday && isOpen) {
            const companyId = localStorage.getItem("companyId");

            if (!companyId) {
                console.error("Company ID não encontrado no localStorage.");
                return;
            }

            fetch(`${API_URL}/api/birthday-details/${birthday.id}`, {
                headers: {
                    companyId,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setGuestsCount(data.guests_count);
                    setConfirmedGuests(data.confirmed_guests);
                    setFantasyName(data.fantasy_name);
                    setToken(data.token);
                })
                .catch((error) => {
                    console.error("Erro ao buscar os detalhes do aniversariante:", error);
                });
        }
    }, [birthday, isOpen]);

    if (!isOpen || !birthday) return null;

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCopyLink = () => {
        if (fantasyName && token) {
            const link = `${window.location.origin}/eventos/${encodeURIComponent(
                fantasyName
            )}/aniversario/${token}`;
            navigator.clipboard.writeText(link).then(
                () => toast.success('Link de divulgação copiado com sucesso!'),
                (err) => console.error("Erro ao copiar o link:", err)
            );
        } else {
            toast.error("Erro ao gerar o link. Verifique os dados do aniversariante.");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleClickOutside}
        >
            <ToastContainer />
            <div className="relative w-full max-w-2xl p-4 animate-in fade-in zoom-in duration-200">
                <div className="relative flex flex-col w-full bg-[#1A202C] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <div>
                            <h2 className="text-[#e1ff01] text-2xl font-bold mb-1">
                                Convidados
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Informações sobre o aniversariante
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-[#e1ff01] transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                        <Users className="w-6 h-6 text-[#e1ff01]" />
                                    </div>
                                    <span className="text-gray-300 font-medium">
                                        Total de Convidados
                                    </span>
                                </div>
                                <div className="text-4xl font-bold text-white">
                                    {guestsCount !== null ? guestsCount : "..."}
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-[#e1ff01] transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-[#e1ff01]" />
                                    </div>
                                    <span className="text-gray-300 font-medium">
                                        Confirmados
                                    </span>
                                </div>
                                <div className="text-4xl font-bold text-white">
                                    {confirmedGuests !== null ? confirmedGuests : "..."}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium flex-1 sm:flex-none"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium flex-1 sm:flex-none flex items-center justify-center gap-2"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Copiar Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
