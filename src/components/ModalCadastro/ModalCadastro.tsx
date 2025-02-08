import React, { useState, useEffect } from 'react';
import { API_URL } from "../../config";
import { X, UserPlus, Phone, Calendar } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Event {
    id: number;
    event_name: string;
}

interface ModalCadastroProps {
    isOpen: boolean;
    onClose: () => void;
}

const maskPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 5) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        value = value.replace(/^(\d*)/, "($1");
    }
    return value;
};

export const ModalCadastro = ({ isOpen, onClose }: ModalCadastroProps) => {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [events, setEvents] = useState<Event[]>([]);

    const loadEvents = async () => {
        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
            toast.error("ID da empresa não encontrado.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/list-events/${companyId}`);
            const data = await response.json();
            setEvents(data.events);
        } catch (error) {
            toast.error("Erro ao carregar os eventos.");
            console.error('Erro ao carregar eventos:', error);
        }
    };

    const createBirthday = async () => {
        if (!name || !phone || !selectedEvent) {
            toast.warn("Por favor, preencha todos os campos.");
            return;
        }

        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
            toast.error("ID da empresa não encontrado.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/create-birthday`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    company_id: companyId,
                    event_id: selectedEvent,
                    name: name,
                    whatsapp: phone
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Aniversariante criado com sucesso!');
                onClose();
            } else {
                toast.error(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao criar o aniversariante:', error);
            toast.error('Erro ao criar o aniversariante.');
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadEvents();
        }
    }, [isOpen]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = maskPhone(e.target.value);
        setPhone(maskedValue);
    };

    if (!isOpen) return null;

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
                                Novo Aniversariante
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Preencha os dados do aniversariante
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
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                        <UserPlus className="w-5 h-5 text-[#e1ff01]" />
                                    </div>
                                    <label className="text-gray-300 font-medium" htmlFor="name">
                                        Nome Completo
                                    </label>
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Digite o nome completo"
                                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#e1ff01] focus:ring-1 focus:ring-[#e1ff01] transition-colors placeholder:text-gray-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                            <Phone className="w-5 h-5 text-[#e1ff01]" />
                                        </div>
                                        <label className="text-gray-300 font-medium" htmlFor="phone">
                                            WhatsApp
                                        </label>
                                    </div>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#e1ff01] focus:ring-1 focus:ring-[#e1ff01] transition-colors placeholder:text-gray-500"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                            <Calendar className="w-5 h-5 text-[#e1ff01]" />
                                        </div>
                                        <label className="text-gray-300 font-medium" htmlFor="event">
                                            Evento
                                        </label>
                                    </div>
                                    <select
                                        id="event"
                                        value={selectedEvent}
                                        onChange={(e) => setSelectedEvent(e.target.value)}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#e1ff01] focus:ring-1 focus:ring-[#e1ff01] transition-colors"
                                    >
                                        <option value="" disabled>Selecione o evento</option>
                                        {events.map((event) => (
                                            <option key={event.id} value={event.id}>
                                                {event.event_name}
                                            </option>
                                        ))}
                                    </select>
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
                            onClick={createBirthday}
                            className="px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium flex-1 sm:flex-none"
                        >
                            Salvar Aniversariante
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};