import React, { JSX, useState } from "react";
import { Menu } from "../../components/Menu";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { SiVisa } from "react-icons/si";
import { useLocation } from "react-router-dom";
import { ModalPagamentoPlano } from "../../components/ModalPagamentoPlano";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../config";
import { motion } from "framer-motion";
import { Zap, Shield } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";

export const Pagamentos = (): JSX.Element => {
    const location = useLocation();
    const { title, price } = location.state || {};
    const [selectedPayment, setSelectedPayment] = useState<string>("");
    const [cep, setCep] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [cardNumber, setCardNumber] = useState<string>("");
    const [cardValidity, setCardValidity] = useState<string>("");
    const [cardCvv, setCardCvv] = useState<string>("");
    const [address, setAddress] = useState({
        endereco: "",
        cidade: "",
        estado: ""
    });
    const [email, setEmail] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [isModal2Open, setIsModal2Open] = useState(false);

    const getCurrentDate = () => {
        const now = new Date();
        const months = [
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];
        return `${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value);
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFullName(e.target.value);
    const currentDate = getCurrentDate();

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawCep = e.target.value.replace(/\D/g, "");
        setCep(rawCep.replace(/(\d{5})(\d{3})/, "$1-$2"));
        if (rawCep.length === 8) fetchAddress(rawCep);
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawCpf = e.target.value.replace(/\D/g, "");
        setCpf(
            rawCpf
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        );
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(
            e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
        );
    };

    const handleCardValidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardValidity(
            e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})$/, "$1/$2")
        );
    };

    const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
    };

    const fetchAddress = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setAddress({
                    endereco: data.logradouro,
                    cidade: data.localidade,
                    estado: data.uf
                });
            } else {
                setAddress({ endereco: "", cidade: "", estado: "" });
                toast.error("CEP não encontrado", {
                    position: "top-center",
                    autoClose: 3000
                });
            }
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
        }
    };

    const handleModal2Open = () => {
        if (!fullName.trim()) {
            toast.error("Por favor, insira seu nome completo", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            toast.error("Por favor, insira um e-mail válido", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }
        if (!cpf || cpf.length !== 14) {
            toast.error("Por favor, insira um CPF válido", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }
        if (!cep || cep.length !== 9) {
            toast.error("Por favor, insira um CEP válido", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }
        if (!address.endereco || !address.cidade || !address.estado) {
            toast.error("Por favor, preencha corretamente o endereço", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }
        setIsModal2Open(true);
    };

    const handleModal2Close = () => setIsModal2Open(false);

    const handlePayment = async () => {
        toast.info(
            "A funcionalidade de pagamento por cartão está temporariamente desativada. Nosso sistema realiza uma verificação do ambiente em que o back-end está instalado para garantir a segurança das transações. Assim que o ambiente de produção for validado, os pagamentos estarão disponíveis.",
            { position: "top-center", autoClose: 15000 }
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden">
            <Menu />
            <ToastContainer />

            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#E1FF01]/10 mb-8">
                        <Zap className="w-6 h-6 text-[#E1FF01]" />
                        <span className="text-[#E1FF01] font-medium text-lg">
                            Pagamento Seguro
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Finalize Seu <span className="text-[#E1FF01]"> Plano</span>
                    </h1>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Escolha a Forma de Pagamento
                        </h2>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`p-6 rounded-2xl border-2 bg-gray-800/30 cursor-pointer transition-all ${selectedPayment === "pix"
                                    ? "border-[#E1FF01]"
                                    : "border-gray-700 hover:border-[#E1FF01]/50"
                                }`}
                            onClick={() => setSelectedPayment("pix")}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#E1FF01]/10 rounded-xl">
                                    <FaMoneyCheckAlt className="text-2xl text-[#E1FF01]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Pix Instantâneo
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Pagamento processado imediatamente
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`p-6 rounded-2xl border-2 bg-gray-800/30 cursor-pointer transition-all ${selectedPayment === "credit-card"
                                    ? "border-[#E1FF01]"
                                    : "border-gray-700 hover:border-[#E1FF01]/50"
                                }`}
                            onClick={() => setSelectedPayment("credit-card")}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#E1FF01]/10 rounded-xl">
                                    <SiVisa className="text-2xl text-[#E1FF01]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Cartão de Crédito
                                    </h3>
                                    <p className="text-gray-400 text-sm">Parcele em até 12x</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="p-6 bg-gray-800/50 rounded-2xl border border-[#E1FF01]/20">
                            <div className="flex items-center gap-4">
                                <Shield className="w-6 h-6 text-[#E1FF01]" />
                                <div>
                                    <h4 className="font-semibold text-white">
                                        Segurança Garantida
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        Criptografia SSL 256-bit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800/30 border-2 border-gray-700 rounded-2xl p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{title}</h2>
                                <p className="text-gray-400">Plano selecionado</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-[#E1FF01]">R${price}</div>
                                <p className="text-gray-400 text-sm">por mês</p>
                            </div>
                        </div>

                        {selectedPayment === "credit-card" && (
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Titular do Cartão</label>
                                    <input
                                        type="text"
                                        placeholder="Nome completo"
                                        className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2">CPF</label>
                                        <input
                                            type="text"
                                            placeholder="000.000.000-00"
                                            value={cpf}
                                            onChange={handleCpfChange}
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">E-mail</label>
                                        <input
                                            type="email"
                                            placeholder="exemplo@email.com"
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-6 space-y-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Número do Cartão</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-300 mb-2">Validade</label>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                value={cardValidity}
                                                onChange={handleCardValidityChange}
                                                className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-300 mb-2">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="000"
                                                value={cardCvv}
                                                onChange={handleCardCvvChange}
                                                className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-[#E1FF01] text-gray-900 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#cde600] transition-colors"
                                    onClick={handlePayment}
                                >
                                    <span>Confirmar Pagamento</span>
                                    <FaArrowRightLong />
                                </motion.button>
                            </form>
                        )}

                        {selectedPayment === "pix" && (
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Nome completo"
                                        value={fullName}
                                        onChange={handleFullNameChange}
                                        className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2">CPF</label>
                                        <input
                                            type="text"
                                            placeholder="000.000.000-00"
                                            value={cpf}
                                            onChange={handleCpfChange}
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">E-mail</label>
                                        <input
                                            type="email"
                                            placeholder="exemplo@email.com"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2">CEP</label>
                                        <input
                                            type="text"
                                            placeholder="00000-000"
                                            value={cep}
                                            onChange={handleCepChange}
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Endereço</label>
                                        <input
                                            type="text"
                                            placeholder="Rua, número"
                                            value={address.endereco}
                                            onChange={(e) =>
                                                setAddress((prev) => ({
                                                    ...prev,
                                                    endereco: e.target.value
                                                }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Cidade</label>
                                        <input
                                            type="text"
                                            placeholder="Cidade"
                                            value={address.cidade}
                                            onChange={(e) =>
                                                setAddress((prev) => ({
                                                    ...prev,
                                                    cidade: e.target.value
                                                }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Estado</label>
                                        <input
                                            type="text"
                                            placeholder="UF"
                                            value={address.estado}
                                            onChange={(e) =>
                                                setAddress((prev) => ({
                                                    ...prev,
                                                    estado: e.target.value
                                                }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-[#E1FF01] text-gray-900 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#cde600] transition-colors"
                                    onClick={handleModal2Open}
                                >
                                    <span>Gerar QR Code Pix</span>
                                    <FaArrowRightLong />
                                </motion.button>

                                <div className="p-4 bg-gray-900/50 rounded-lg border border-[#E1FF01]/20">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#E1FF01]">⚠️</span>
                                        <p className="text-sm text-gray-400">
                                            O QR Code ficará disponível por 1 hora
                                        </p>
                                    </div>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            <ModalPagamentoPlano
                isOpen={isModal2Open}
                onClose={handleModal2Close}
                title={title || "Plano"}
                price={price || "0,00"}
                userData={{
                    full_name: fullName,
                    cpf,
                    email,
                    telefone: "",
                    endereco: address.endereco,
                    cidade: address.cidade,
                    estado: address.estado,
                    cep
                }}
            />
        </div>
    );
};

export default Pagamentos;
