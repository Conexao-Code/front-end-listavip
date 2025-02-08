import React, { useState, useEffect } from 'react';
import { API_URL } from "../../config";
import { X, Wallet, Key, CreditCard, AlertCircle, ArrowRight } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';
import 'react-toastify/dist/ReactToastify.css';

interface ModalSaqueProps {
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export const ModalSaque = ({ isOpen, onClose, fetchData }: ModalSaqueProps) => {
    const [userData, setUserData] = useState<{ chave_pix: string | null; full_name: string } | null>(null);
    const [pixKey, setPixKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditingPix, setIsEditingPix] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchUserData = async () => {
                try {
                    const session_token = localStorage.getItem('authToken');
                    const company_id = localStorage.getItem('companyId');

                    if (!session_token || !company_id) {
                        throw new Error("Token de sessão ou ID da empresa não encontrado.");
                    }

                    const response = await fetch(`${API_URL}/api/user-info?session_token=${session_token}&company_id=${company_id}`);
                    const data = await response.json();

                    if (response.ok) {
                        setUserData(data);
                    } else {
                        console.error("Erro ao buscar informações do usuário:", data.message);
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do servidor:", error);
                }
            };

            fetchUserData();
        }
    }, [isOpen]);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSetPixKey = async () => {
        setIsSubmitting(true);
        try {
            const session_token = localStorage.getItem('authToken');
            const company_id = localStorage.getItem('companyId');

            if (!session_token || !company_id) {
                throw new Error("Token de sessão ou ID da empresa não encontrado.");
            }

            const response = await fetch(`${API_URL}/api/set-pix-key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_token,
                    company_id,
                    chave_pix: pixKey
                })
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(prev => prev ? { ...prev, chave_pix: pixKey } : null);
                toast.success("Chave PIX definida com sucesso!");
                setIsEditingPix(false);
            } else {
                console.error("Erro ao definir chave PIX:", data.message);
                toast.error("Erro ao definir chave PIX");
            }
        } catch (error) {
            console.error("Erro ao enviar chave PIX:", error);
            toast.error("Erro ao enviar chave PIX");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdrawRequest = async () => {
        setIsSubmitting(true);
        try {
            const session_token = localStorage.getItem('authToken');
            const company_id = localStorage.getItem('companyId');

            if (!session_token || !company_id || !withdrawAmount) {
                throw new Error("Dados insuficientes para solicitar o saque.");
            }

            const response = await fetch(`${API_URL}/api/create-withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_token,
                    company_id,
                    amount: parseFloat(withdrawAmount.replace('R$', '').replace('.', '').replace(',', '.'))
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Solicitação de saque enviada com sucesso!");
                setWithdrawAmount('');
                fetchData();
                onClose();
            } else {
                console.error("Erro ao solicitar saque:", data.message);
                toast.error(data.message || "Erro ao solicitar saque");
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação de saque:", error);
            toast.error("Erro ao enviar solicitação de saque");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleClickOutside}
        >
            <ToastContainer />
            <div className="relative w-full max-w-lg p-4 animate-in fade-in zoom-in duration-200">
                <div className="relative flex flex-col w-full bg-[#1A202C] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                {isEditingPix ? (
                                    <CreditCard className="w-6 h-6 text-[#e1ff01]" />
                                ) : (
                                    <Wallet className="w-6 h-6 text-[#e1ff01]" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-[#e1ff01] text-xl font-bold">
                                    {isEditingPix ? "Configurar Chave PIX" : "Solicitar Saque"}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {isEditingPix
                                        ? "Configure sua chave para receber pagamentos"
                                        : userData?.full_name
                                        ? `Olá, ${userData.full_name}`
                                        : "Carregando..."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6">
                        {userData?.chave_pix && !isEditingPix ? (
                            <div className="space-y-6">
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                                <Key className="w-5 h-5 text-[#e1ff01]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Chave PIX atual</p>
                                                <p className="text-white font-medium">{userData.chave_pix}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsEditingPix(true)}
                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                            <Wallet className="w-5 h-5 text-[#e1ff01]" />
                                        </div>
                                        <label className="text-gray-300 font-medium">
                                            Valor do Saque
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <span className="text-[#e1ff01] font-medium">R$</span>
                                        </div>
                                        <CurrencyInput
                                            value={withdrawAmount}
                                            onValueChange={(value) => setWithdrawAmount(value || '')}
                                            placeholder="0,00"
                                            className="w-full pl-12 p-3 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:border-[#e1ff01] focus:ring-1 focus:ring-[#e1ff01] transition-colors"
                                            decimalsLimit={2}
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        O valor mínimo para saque é de R$ 50,00
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-[#e1ff01]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium mb-1">Configure sua chave PIX</p>
                                            <p className="text-gray-400 text-sm">
                                                Para realizar saques, é necessário configurar uma chave PIX válida para recebimento.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                                            <Key className="w-5 h-5 text-[#e1ff01]" />
                                        </div>
                                        <label className="text-gray-300 font-medium">
                                            Sua Chave PIX
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={pixKey}
                                        onChange={(e) => setPixKey(e.target.value)}
                                        placeholder="Digite sua chave PIX"
                                        className="w-full p-3 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:border-[#e1ff01] focus:ring-1 focus:ring-[#e1ff01] transition-colors placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700">
                        {userData?.chave_pix && !isEditingPix ? (
                            <button
                                onClick={handleWithdrawRequest}
                                disabled={!withdrawAmount || parseFloat(withdrawAmount.replace('R$', '').replace(',', '.')) <= 0 || isSubmitting}
                                className="w-full px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Wallet className="w-5 h-5" />
                                {isSubmitting ? "Processando..." : "Solicitar Saque"}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSetPixKey}
                                    disabled={isSubmitting || !pixKey}
                                    className="flex-1 px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Key className="w-5 h-5" />
                                    {isSubmitting ? "Salvando..." : "Definir Chave PIX"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};