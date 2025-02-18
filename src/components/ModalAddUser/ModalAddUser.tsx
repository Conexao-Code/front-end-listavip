import React, { JSX, useState } from 'react';
import { useTheme } from "../../ThemeContext";
import { API_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdClose } from "react-icons/io";
import { FiUser, FiMail, FiSmartphone, FiCreditCard, FiUserCheck } from "react-icons/fi";

interface ModalAddUserProps {
    isOpen: boolean;
    onClose: () => void;
    eventName: string;
    onSuccess: () => void;
}

const maskCpf = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
};

export const ModalAddUser = ({ isOpen, onClose, eventName, onSuccess }: ModalAddUserProps): JSX.Element | null => {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [genero, setGenero] = useState('');

    const { theme } = useTheme();

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWhatsapp(maskPhone(e.target.value));
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(maskCpf(e.target.value));
    };

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Por favor, insira um e-mail válido.");
            return;
        }

        try {
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
                }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                onClose();
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao enviar os dados.');
        }
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
                                Adicionar à lista
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Preencha o formulário para adicionar à lista do evento
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <IoMdClose className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-sm font-medium text-gray-300 mb-1 block">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={nomeCompleto}
                                        onChange={(e) => setNomeCompleto(e.target.value)}
                                        placeholder="Insira o Nome Completo"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-medium text-gray-300 mb-1 block">
                                    CPF
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCreditCard className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="123.123.123-00"
                                        value={cpf}
                                        onChange={handleCpfChange}
                                        maxLength={14}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-medium text-gray-300 mb-1 block">
                                    E-mail
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="exemplo@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-300 mb-1 block">
                                        Whatsapp
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiSmartphone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="absolute inset-y-0 left-10 flex items-center">
                                            <select
                                                className="text-[#E1FF01] bg-transparent outline-none text-sm pr-2"
                                                style={{ fontWeight: "bold" }}
                                            >
                                                <option value="BR">BR</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="(11) 12345-6789"
                                            value={whatsapp}
                                            onChange={handlePhoneChange}
                                            maxLength={15}
                                            className="w-full pl-24 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                                        />
                                    </div>
                                </div>


                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-300 mb-1 block">
                                        Gênero
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUserCheck className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={genero}
                                            onChange={(e) => setGenero(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent appearance-none"
                                        >
                                            <option value="" disabled hidden>Selecione o Gênero</option>
                                            <option value="male">Masculino</option>
                                            <option value="female">Feminino</option>
                                        </select>
                                    </div>
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
                            onClick={handleSubmit}
                            className="px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium flex-1 sm:flex-none"
                        >
                            Adicionar à lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
