import React from 'react';
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalConfirmarExclusaoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelete: () => void;
}

export const ModalConfirmarExclusao = ({ isOpen, onClose, onConfirmDelete }: ModalConfirmarExclusaoProps) => {
    if (!isOpen) return null;

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDelete = () => {
        try {
            onConfirmDelete();
            toast.success('Evento excluído com sucesso!');
        } catch (error) {
            toast.error('Erro ao excluir o evento.');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleClickOutside}
        >
            <ToastContainer />
            <div className="relative w-full max-w-md p-4 animate-in fade-in zoom-in duration-200">
                <div className="relative flex flex-col w-full bg-[#1A202C] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-red-500 text-xl font-bold">
                                    Excluir Evento
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Esta ação não pode ser desfeita
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
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Confirmação necessária</p>
                                    <p className="text-gray-400 text-sm">
                                        Você está prestes a excluir este evento. Esta ação é permanente e não poderá ser revertida. 
                                        Todos os dados associados a este evento serão perdidos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            Excluir Evento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
