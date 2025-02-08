import React, { JSX } from 'react';
import { useTheme } from "../../ThemeContext";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

interface ModalPromoterCadastroProps {
    isOpen: boolean;
    onClose: () => void;
    fantasyName: string; // Adiciona a prop para o nome fantasia
}

export const ModalPromoterCadastro = ({ isOpen, onClose, fantasyName }: ModalPromoterCadastroProps): JSX.Element | null => {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleNavigateToLogin = () => {
        const formattedFantasyName = fantasyName.replace(/\s+/g, '-');
        navigate(`/login/promoter/${formattedFantasyName}`);
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleClickOutside}
            style={{
                backdropFilter: 'blur(5px)',
            }}
        >
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl p-4">
                <div
                    className="relative flex flex-col w-full items-end gap-8 p-6 bg-[#1b2026] rounded-3xl overflow-hidden border border-solid border-[#575560] shadow-[0px_20px_24px_-4px_#00000052]"
                    style={{
                        backgroundColor: theme === "dark" ? "#22252A" : "#D6D6D6",
                    }}
                >
                    <IoMdClose
                        size={20}
                        onClick={onClose}
                        className="cursor-pointer transition-colors"
                        style={{
                            color: theme === "dark" ? "#F1F1F1" : "#000000",
                        }}
                    />

                    <div className="flex flex-col items-center gap-5 w-full">
                        <div className="flex flex-col items-center gap-2 w-full">
                            <div className="text-[#e1ff01] text-2xl font-bold text-center">Cadastro Concluído!</div>
                            <div
                                className="text-base font-medium text-center"
                                style={{
                                    color: theme === "dark" ? "#F1F1F1" : "#000000",
                                }}
                            >
                                Seu cadastro como promoter para a empresa <strong>{fantasyName}</strong> foi realizado com sucesso! Agora, aguarde um administrador aprovar sua conta.
                            </div>
                            <div
                                className="text-base font-medium text-center"
                                style={{
                                    color: theme === "dark" ? "#F1F1F1" : "#000000",
                                }}
                            >
                                Você receberá uma notificação por e-mail assim que sua conta for aprovada.
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full justify-center gap-8">
                        <button
                            className="h-10 flex-1 bg-[#e1ff01] text-[#302e38] font-bold py-2 px-4 rounded-2xl border-none transition-all hover:bg-[#d1e600] [font-family:'Poppins',Helvetica]"
                            onClick={handleNavigateToLogin}
                        >
                            Ir para Login
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};
