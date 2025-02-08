import React, { useState, useEffect, JSX } from "react";
import { useTheme } from "../../ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { API_URL } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

interface ModalPagamentoPlanoProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    price: string;
    userData: {
        full_name: string;
        cpf: string;
        email: string;
        telefone: string;
        endereco: string;
        cidade: string;
        estado: string;
        cep: string;
    };
}

export const ModalPagamentoPlano = ({
    isOpen,
    onClose,
    title,
    price,
    userData,
}: ModalPagamentoPlanoProps): JSX.Element | null => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
    const [createCompany, setCreateCompany] = useState<boolean>(false);
    const [companyName, setCompanyName] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    const fetchQrCode = async () => {
        if (!userData.full_name || userData.full_name.trim() === "") {
            toast.error("O campo Nome Completo é obrigatório.", {
                position: "top-center",
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/generate-qrcode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, price, userData }),
            });

            const data = await response.json();
            if (response.ok && data.qrCode) {
                setQrCode(data.qrCode);
                setPixCopyPaste(data.pixCopyPaste);
                setPaymentId(data.paymentId);
                setPaymentStatus("pending");
                setIsMonitoring(true);
            } else {
                toast.error("Erro ao gerar QR Code para pagamento.", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Erro ao buscar QR Code:", error);
            toast.error("Erro ao processar pagamento. Tente novamente mais tarde.", {
                position: "top-center",
            });
        }
    };

    const fetchPaymentStatus = async () => {
        if (!paymentId) return;

        try {
            const response = await fetch(`${API_URL}/api/payment-status/${paymentId}`);
            const data = await response.json();

            if (response.ok) {
                setPaymentStatus(data.status);

                if (data.status === "approved") {
                    setIsMonitoring(false);

                    if (data.message === "Pagamento aprovado, mas é necessário criar a empresa para finalizar." ||
                        data.message === "Pagamento aprovado. Usuário criado. Por favor, finalize a criação da empresa.") {
                        setCreateCompany(true);
                        toast.info("Por favor, crie sua empresa para finalizar.", {
                            position: "top-center",
                        });
                    } else {
                        toast.success("Pagamento aprovado e assinatura atualizada com sucesso!", {
                            position: "top-center",
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao consultar status:", error);
        }
    };

    const handleCreateCompany = async () => {
        if (!companyName.trim()) {
            toast.error("O nome da empresa é obrigatório.", {
                position: "top-center",
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/create-company`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ companyName, userEmail: userData.email }),
            });

            if (response.ok) {
                toast.success("Empresa criada e assinatura configurada com sucesso!", {
                    position: "top-center",
                });
                setCreateCompany(false);
                setPaymentStatus("approved");
            } else {
                toast.error("Erro ao criar a empresa. Tente novamente.", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error("Erro ao criar a empresa. Tente novamente.", {
                position: "top-center",
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchQrCode();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isMonitoring && paymentStatus === "pending") {
            const interval = setInterval(fetchPaymentStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [isMonitoring, paymentStatus]);

    const handleCopy = async () => {
        if (pixCopyPaste) {
            try {
                await navigator.clipboard.writeText(pixCopyPaste);
                setCopied(true);
                toast.success("Código Pix copiado!", {
                    position: "top-center",
                });
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                toast.error("Erro ao copiar código.", {
                    position: "top-center",
                });
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <ToastContainer />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl mx-4"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
                        <div className="absolute right-4 top-4">
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!qrCode && !paymentStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center gap-4 py-8"
                                >
                                    <Loader2 className="h-12 w-12 text-[#E1FF01] animate-spin" />
                                    <h2 className="text-2xl font-bold text-[#E1FF01]">
                                        Gerando QR Code
                                    </h2>
                                    <p className="text-gray-400 text-center">
                                        Aguarde enquanto preparamos seu pagamento...
                                    </p>
                                </motion.div>
                            )}

                            {qrCode && paymentStatus === "pending" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-[#E1FF01] mb-2">
                                            Pagamento via Pix
                                        </h2>
                                        <p className="text-gray-400">
                                            Escaneie o QR Code ou copie o código
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl mx-auto w-fit">
                                        <img
                                            src={qrCode}
                                            alt="QR Code Pix"
                                            className="w-64 h-64 mx-auto"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={pixCopyPaste || ""}
                                                readOnly
                                                className="flex-1 px-4 py-3 bg-gray-800 rounded-lg text-gray-200 border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20"
                                            />
                                            <button
                                                onClick={handleCopy}
                                                className="px-4 py-2 bg-[#E1FF01] hover:bg-[#cde600] text-gray-900 rounded-lg font-medium transition-colors flex items-center gap-2"
                                            >
                                                {copied ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : (
                                                    <Copy className="h-5 w-5" />
                                                )}
                                                {copied ? "Copiado!" : "Copiar"}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                                            <AlertCircle className="h-4 w-4 text-[#E1FF01]" />
                                            <p>O QR Code expira em 1 hora</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {createCompany && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6 py-4"
                                >
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-[#E1FF01] mb-2">
                                            Crie sua Empresa
                                        </h2>
                                        <p className="text-gray-400">
                                            Defina o nome da sua empresa para começar
                                        </p>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Nome da empresa"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 placeholder-gray-500"
                                    />

                                    <button
                                        onClick={handleCreateCompany}
                                        className="w-full py-3 bg-[#E1FF01] hover:bg-[#cde600] text-gray-900 rounded-lg font-bold transition-colors"
                                    >
                                        Criar Empresa
                                    </button>
                                </motion.div>
                            )}

                            {paymentStatus === "approved" && !createCompany && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center space-y-6 py-8"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-green-500 mb-2">
                                            Pagamento Aprovado!
                                        </h2>
                                        <p className="text-gray-400">
                                            Sua senha foi enviada para seu e-mail
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="w-full py-3 bg-[#E1FF01] hover:bg-[#cde600] text-gray-900 rounded-lg font-bold transition-colors"
                                    >
                                        Ir para Login
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ModalPagamentoPlano;