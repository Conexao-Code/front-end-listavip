import React, { JSX, useState } from 'react';
import { useTheme } from "../../ThemeContext";
import { API_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { X, User, Phone, Mail, CreditCard, Users } from "lucide-react";

interface ModalConfirmarProps {
    isOpen: boolean;
    onClose: (data: { name: string; cpf: string; email: string; phone: string; gender: string; ticketPrice: string; qrCodeUrl?: string } | null) => void;
    eventName: string;
    ticketPriceMen: string;
    ticketPriceWomen: string;
    promoterToken?: string;
    eventColor: string;
}

const maskPhone = (value: string) => {
    return value.replace(/\D/g, "")
        .replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const ModalConfirmar = ({
    isOpen,
    onClose,
    eventName,
    ticketPriceMen,
    ticketPriceWomen,
    promoterToken,
    eventColor
}: ModalConfirmarProps): JSX.Element | null => {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [genero, setGenero] = useState('');
    const [email, setEmail] = useState('');
    const { theme } = useTheme();
    const { token: tokenaniversario } = useParams<{ token: string }>();

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose(null);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWhatsapp(maskPhone(e.target.value));
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(maskCPF(e.target.value));
    };

    const handleSubmit = async () => {
        try {
            const ticketPrice = genero === 'masculino' ? ticketPriceMen : genero === 'feminino' ? ticketPriceWomen : '';

            if (!ticketPrice) {
                toast.error('Por favor, selecione um gênero válido.');
                return;
            }

            const response = await fetch(`${API_URL}/api/add-client`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nomeCompleto,
                    cpf: cpf,
                    phone: whatsapp,
                    email: email,
                    gender: genero,
                    event_name: eventName,
                    token: promoterToken,
                    tokenaniversario,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                onClose({
                    name: nomeCompleto,
                    cpf: cpf,
                    phone: whatsapp,
                    email: email,
                    gender: genero,
                    ticketPrice: ticketPrice,
                    qrCodeUrl: result.qrCodeUrl,
                });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao enviar os dados.');
        }
    };

    if (!isOpen) return null;

    const hexToRgba = (hex: string, opacity: number): string => {
        const normalizedHex = hex.replace('#', '');
        let r: number, g: number, b: number;
        if (normalizedHex.length === 3) {
            r = parseInt(normalizedHex[0] + normalizedHex[0], 16);
            g = parseInt(normalizedHex[1] + normalizedHex[1], 16);
            b = parseInt(normalizedHex[2] + normalizedHex[2], 16);
        } else if (normalizedHex.length === 6) {
            r = parseInt(normalizedHex.substring(0, 2), 16);
            g = parseInt(normalizedHex.substring(2, 4), 16);
            b = parseInt(normalizedHex.substring(4, 6), 16);
        } else {
            return hex;
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto sm:overflow-y-hidden bg-black/40 backdrop-blur-sm"
            onClick={handleClickOutside}
        >
            <ToastContainer />
            <div className="relative w-full max-w-2xl min-h-screen sm:min-h-0 p-4 animate-in fade-in zoom-in duration-200">
                <div className="relative flex flex-col w-full bg-[#1A202C] rounded-2xl overflow-hidden shadow-2xl border border-gray-700 my-auto">
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
                        <div>
                            <h2 style={{ color: eventColor }} className="text-xl sm:text-2xl font-bold mb-1">
                                Confirmar Presença
                            </h2>
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Preencha seus dados para {eventName}
                            </p>
                        </div>
                        <button
                            onClick={() => onClose(null)}
                            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-none">
                        <div className="space-y-4" style={{ "--event-color": eventColor } as React.CSSProperties}>
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}
                                    >
                                        <User className="w-5 h-5" style={{ color: eventColor }} />
                                    </div>
                                    <label
                                        className="text-gray-300 text-sm sm:text-base font-medium"
                                        htmlFor="nomeCompleto"
                                    >
                                        Nome Completo
                                    </label>
                                </div>
                                <input
                                    id="nomeCompleto"
                                    type="text"
                                    value={nomeCompleto}
                                    onChange={(e) => setNomeCompleto(e.target.value)}
                                    placeholder="Digite seu nome completo"
                                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors placeholder:text-gray-500 focus:border-[var(--event-color)] focus:ring-1 focus:ring-[var(--event-color)]"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}
                                        >
                                            <CreditCard className="w-5 h-5" style={{ color: eventColor }} />
                                        </div>
                                        <label
                                            className="text-gray-300 text-sm sm:text-base font-medium"
                                            htmlFor="cpf"
                                        >
                                            CPF
                                        </label>
                                    </div>
                                    <input
                                        id="cpf"
                                        type="text"
                                        value={cpf}
                                        onChange={handleCpfChange}
                                        placeholder="000.000.000-00"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors placeholder:text-gray-500 focus:border-[var(--event-color)] focus:ring-1 focus:ring-[var(--event-color)]"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}
                                        >
                                            <Phone className="w-5 h-5" style={{ color: eventColor }} />
                                        </div>
                                        <label
                                            className="text-gray-300 text-sm sm:text-base font-medium"
                                            htmlFor="whatsapp"
                                        >
                                            WhatsApp
                                        </label>
                                    </div>
                                    <input
                                        id="whatsapp"
                                        type="text"
                                        value={whatsapp}
                                        onChange={handlePhoneChange}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors placeholder:text-gray-500 focus:border-[var(--event-color)] focus:ring-1 focus:ring-[var(--event-color)]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}
                                        >
                                            <Mail className="w-5 h-5" style={{ color: eventColor }} />
                                        </div>
                                        <label
                                            className="text-gray-300 text-sm sm:text-base font-medium"
                                            htmlFor="email"
                                        >
                                            E-mail
                                        </label>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="exemplo@email.com"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors placeholder:text-gray-500 focus:border-[var(--event-color)] focus:ring-1 focus:ring-[var(--event-color)]"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}
                                        >
                                            <Users className="w-5 h-5" style={{ color: eventColor }} />
                                        </div>
                                        <label
                                            className="text-gray-300 text-sm sm:text-base font-medium"
                                            htmlFor="genero"
                                        >
                                            Gênero
                                        </label>
                                    </div>
                                    <select
                                        id="genero"
                                        value={genero}
                                        onChange={(e) => setGenero(e.target.value)}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors focus:border-[var(--event-color)] focus:ring-1 focus:ring-[var(--event-color)]"
                                    >
                                        <option value="">Selecione o gênero</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-700">
                        <button
                            onClick={() => onClose(null)}
                            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium flex-1 sm:flex-none"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 rounded-lg text-gray-900 transition-colors font-medium flex-1 sm:flex-none"
                            style={{ backgroundColor: eventColor }}
                        >
                            Confirmar Presença
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
