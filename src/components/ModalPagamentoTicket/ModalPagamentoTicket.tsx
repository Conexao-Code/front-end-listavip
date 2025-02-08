import React, { useState, useEffect, JSX } from "react";
import { useTheme } from "../../ThemeContext";
import { API_URL } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { X, Copy, Loader2, QrCode, AlertCircle, CheckCircle2 } from "lucide-react";

interface ModalPagamentoTicketProps {
    isOpen: boolean;
    onClose: (shouldReopenAntecipado?: boolean) => void;
    ticketInfo: {
        name: string;
        cpf: string;
        phone: string;
        gender: string;
        email: string;
        ticketPrice: string;
        eventName: string;
        eventColor: string;
        qrCodeUrl?: string;
    };
    onPaymentApproved: (paymentInfo: {
        qrCodeImage: string;
        qrCodeUrl: string;
        name: string;
        cpf: string;
        gender: string;
        ticketPrice: string;
        eventName: string;
    }) => void;
}

const hexToRgba = (hex: string, opacity: number): string => {
    const normalizedHex = hex.replace("#", "");
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

export const ModalPagamentoTicket = ({
    isOpen,
    onClose,
    ticketInfo,
    onPaymentApproved,
}: ModalPagamentoTicketProps): JSX.Element | null => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState(false);
    const { eventColor } = ticketInfo;

    const fetchQrCode = async () => {
        try {
            const response = await fetch(`${API_URL}/api/generate-qrcodeticket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ticketInfo),
            });
            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qrCode);
                setPixCopyPaste(data.pixCopyPaste);
                setPaymentId(data.paymentId);
                setPaymentStatus(data.status);
                setIsMonitoring(true);
            } else {
                if (data.error === "O CPF fornecido é inválido. Por favor, verifique os dados e tente novamente.") {
                    toast.error(data.error);
                    setTimeout(() => {
                        onClose(true);
                    }, 2000);
                } else {
                    toast.error(data.error || "Erro ao gerar QR Code");
                }
            }
        } catch (error) {
            console.error("Erro ao buscar QR Code:", error);
            toast.error("Erro ao processar a solicitação.");
        }
    };

    const fetchPaymentStatus = async () => {
        if (!paymentId) return;
        try {
            const pathname = window.location.pathname;
            const pathSegments = pathname.split("/");
            const token = pathSegments.length >= 4 ? pathSegments[3] : null;
            const tokenAniversario = pathSegments.length === 5 ? pathSegments[4] : null;
            let apiUrl = `${API_URL}/api/payment-statusticket/${paymentId}`;
            if (token) apiUrl += `?token=${token}`;
            if (tokenAniversario)
                apiUrl += token ? `&tokenaniversario=${tokenAniversario}` : `?tokenaniversario=${tokenAniversario}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                setPaymentStatus(data.status);
                if (data.message === "Pagamento aprovado") {
                    toast.success("Pagamento aprovado!");
                    setIsMonitoring(false);
                    onClose();
                    onPaymentApproved({
                        qrCodeUrl: data.qrCodeUrl,
                        qrCodeImage: data.qrCodeImage,
                        name: ticketInfo.name,
                        cpf: ticketInfo.cpf,
                        gender: ticketInfo.gender,
                        ticketPrice: ticketInfo.ticketPrice,
                        eventName: ticketInfo.eventName,
                    });
                } else if (data.status === "rejected") {
                    toast.error("Pagamento rejeitado.");
                    setIsMonitoring(false);
                }
            } else {
                toast.error(data.error || "Erro ao verificar status do pagamento");
            }
        } catch (error) {
            console.error("Erro ao verificar status do pagamento:", error);
            toast.error("Erro ao verificar status.");
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
                setIsCopied(true);
                toast.success("Código Pix copiado!");
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                toast.error("Erro ao copiar código");
            }
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

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
                                Pagamento do Ingresso
                            </h2>
                            <p className="text-gray-300 text-xs sm:text-sm">
                                {ticketInfo.eventName} - {ticketInfo.ticketPrice}
                            </p>
                        </div>
                        <button
                            onClick={() => onClose()}
                            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 space-y-6">
                        {!qrCode && !paymentStatus && (
                            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                <div className="p-3 rounded-full" style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}>
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: eventColor }} />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Gerando QR Code</h3>
                                <p className="text-gray-400 text-center max-w-sm">
                                    Aguarde enquanto preparamos seu pagamento...
                                </p>
                            </div>
                        )}
                        {qrCode && paymentStatus === "pending" && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-3 rounded-full" style={{ backgroundColor: hexToRgba(eventColor, 0.1) }}>
                                        <QrCode className="w-8 h-8" style={{ color: eventColor }} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-white mb-2">Escaneie o QR Code</h3>
                                        <p className="text-gray-400 text-sm">Use o app do seu banco para escanear</p>
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 p-6 rounded-xl">
                                    <img
                                        src={qrCode}
                                        alt="QR Code para pagamento"
                                        className="w-48 h-48 mx-auto bg-white p-2 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Código Pix</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={pixCopyPaste || ""}
                                            readOnly
                                            className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className="px-4 py-2 rounded-lg text-gray-900 hover:opacity-90 transition-colors flex items-center gap-2"
                                            style={{ backgroundColor: eventColor }}
                                        >
                                            {isCopied ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                            <span className="hidden sm:inline">{isCopied ? "Copiado!" : "Copiar"}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-[rgba(0,0,0,0.1)] rounded-lg">
                                    <AlertCircle className="w-5 h-5" style={{ color: eventColor }} />
                                    <p className="text-sm text-gray-300">
                                        Após o pagamento, aguarde alguns instantes para a confirmação automática.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalPagamentoTicket;
