import React, { useState } from 'react';
import { API_URL } from "../../config";
import { X, UserPlus, Mail, UserCog } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalCadastroProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated?: () => void;
}

export const ModalCreateUser = ({ isOpen, onClose, onUserCreated }: ModalCadastroProps) => {
    if (!isOpen) return null;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSave = async () => {
        const company_id = localStorage.getItem("companyId");

        if (!name || !email || !role || !company_id) {
            toast.error("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, role, company_id }),
            });

            if (!response.ok) throw new Error("Erro ao criar usuário");

            toast.success("Usuário criado com sucesso!");
            if (onUserCreated) {
                onUserCreated();
            }
            onClose();
        } catch (error) {
            toast.error("Erro ao criar o usuário.");
            console.error(error);
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
                                Criar novo usuário
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Preencha o formulário para criar um novo usuário
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
                                <label className="text-sm font-medium text-gray-300 mb-1 block">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserPlus className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Insira o Nome Completo"
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
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Insira o E-mail"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-medium text-gray-300 mb-1 block">
                                    Cargo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCog className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e1ff01]/50 focus:border-transparent appearance-none"
                                    >
                                        <option value="" disabled hidden>Selecione o Cargo</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Moderador">Moderador</option>
                                        <option value="Recepcionista">Recepcionista</option>
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
                            onClick={handleSave}
                            className="px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium flex-1 sm:flex-none"
                        >
                            Salvar usuário
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
