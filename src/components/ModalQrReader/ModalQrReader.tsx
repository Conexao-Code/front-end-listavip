import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { X, QrCode, CheckCircle, XCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalQrReaderProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (data: string | null) => Promise<void>;
}

interface ScanResult {
    status: string;
    details: any | null;
}

export const ModalQrReader = ({ isOpen, onClose }: ModalQrReaderProps) => {
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReading, setIsReading] = useState(true);
    const lastProcessedRef = useRef<{ qrCode: string | null; timestamp: number }>({ qrCode: null, timestamp: 0 });

    const handleScanResult = async (data: string | null) => {
        if (!isReading || isProcessing || !data) {
            return;
        }

        const currentTime = Date.now();
        if (
            lastProcessedRef.current.qrCode === data &&
            currentTime - lastProcessedRef.current.timestamp < 15000
        ) {
            return;
        }

        lastProcessedRef.current = { qrCode: data, timestamp: currentTime };
        setIsProcessing(true);
        setIsReading(false);

        try {
            const response = await fetch(data);

            if (response.ok) {
                const result = await response.json();
                const status = result.message || result.status;

                switch (status) {
                    case "Confirmado":
                        setScanResult({ status: "Confirmado", details: result });
                        break;
                    case "Cancelado":
                        setScanResult({ status: "Cancelado", details: result });
                        break;
                    case "Pagamento Antecipado":
                        setScanResult({ status: "Pagamento Antecipado", details: result });
                        break;
                    case "QR Code já foi utilizado para entrada.":
                        setScanResult({ status: "QR Code já utilizado", details: result });
                        break;
                    default:
                        setScanResult({ status: "Participação não encontrada", details: result });
                        break;
                }
            } else {
                setScanResult({ status: "Participação não encontrada", details: null });
            }
        } catch (error) {
            console.error("Erro ao processar o QR Code:", error);
            setScanResult({ status: "Erro ao verificar QR Code", details: null });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetry = () => {
        setScanResult(null);
        setIsReading(true);
    };

    const getStatusConfig = () => {
        switch (scanResult?.status) {
            case "Confirmado":
                return {
                    icon: <CheckCircle className="w-6 h-6 text-[#e1ff01]" />,
                    bgColor: "bg-[#e1ff01]/10",
                    textColor: "text-[#e1ff01]",
                    title: "Confirmado",
                    message: "Este usuário confirmou sua presença antecipadamente. No entanto, é necessário realizar o pagamento dos ingressos para completar a entrada."
                };
            case "Cancelado":
                return {
                    icon: <XCircle className="w-6 h-6 text-red-500" />,
                    bgColor: "bg-red-500/10",
                    textColor: "text-red-500",
                    title: "Cancelado",
                    message: "A participação do usuário foi cancelada. A entrada não está autorizada."
                };
            case "Pagamento Antecipado":
                return {
                    icon: <Info className="w-6 h-6 text-blue-500" />,
                    bgColor: "bg-blue-500/10",
                    textColor: "text-blue-500",
                    title: "Pagamento Antecipado",
                    message: "O pagamento foi realizado antecipadamente. A entrada do usuário está autorizada."
                };
            case "QR Code já utilizado":
                return {
                    icon: <RotateCcw className="w-6 h-6 text-orange-500" />,
                    bgColor: "bg-orange-500/10",
                    textColor: "text-orange-500",
                    title: "QR Code já utilizado",
                    message: "Este QR Code já foi utilizado para a entrada."
                };
            default:
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
                    bgColor: "bg-yellow-500/10",
                    textColor: "text-yellow-500",
                    title: "Participação não encontrada",
                    message: "Não foi possível localizar uma participação registrada para este evento. Verifique as informações e tente novamente."
                };
        }
    };

    if (!isOpen) return null;

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const statusConfig = getStatusConfig();

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
                                <QrCode className="w-6 h-6 text-[#e1ff01]" />
                            </div>
                            <div>
                                <h2 className="text-[#e1ff01] text-xl font-bold">
                                    {scanResult ? statusConfig.title : "Leitor QR Code"}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {scanResult ? "Resultado da verificação" : "Escaneie o QR Code do ingresso"}
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
                        {scanResult ? (
                            <div className="space-y-6">
                                <div className={`bg-gray-800/50 rounded-xl p-4 border border-gray-700`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 ${statusConfig.bgColor} rounded-lg`}>
                                            {statusConfig.icon}
                                        </div>
                                        <div>
                                            <p className={`font-medium mb-1 ${statusConfig.textColor}`}>
                                                {statusConfig.title}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {statusConfig.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
                                    <QrReader
                                        onResult={(result, error) => {
                                            if (result) {
                                                handleScanResult(result.getText());
                                            }
                                            if (error) {
                                                console.log("Erro ao capturar QR Code:", error);
                                            }
                                        }}
                                        constraints={{
                                            facingMode: "environment"
                                        }}
                                        containerStyle={{ width: '100%' }}
                                    />
                                </div>
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Posicione o QR Code no centro da câmera para leitura
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        {scanResult && (
                            <button
                                onClick={handleRetry}
                                className="flex-1 px-6 py-3 rounded-lg bg-[#e1ff01] text-gray-900 hover:bg-[#e1ff01]/90 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Escanear Novamente
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};