import React, { useState, useEffect, useContext } from "react";
import logo from "../../imagens/logo.png";
import { API_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalLogin } from "../../components/ModalLogin";
import { ModalPlano } from "../../components/ModalPlano";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [attemptReconnect, setAttemptReconnect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedRememberMe = localStorage.getItem("rememberMe");
        if (savedEmail && savedRememberMe === "true") {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email);
            localStorage.setItem("rememberMe", "true");
        }

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", data.sessionToken);
                localStorage.setItem("fullName", data.full_name);
                localStorage.setItem("companyId", data.company_id);
                localStorage.setItem("role", data.role);

                login(data.sessionToken);
                toast.success("Login realizado com sucesso!");
                navigate("/eventos");
            } else if (data.reconnect) {
                toast.warning("Já existe um usuário logado. Tente novamente para realizar o login.");
                setAttemptReconnect(true);
            } else if (data.message === "Empresa não encontrada.") {
                setIsModalOpen(true);
            } else if (data.message === "A empresa do usuário não possui uma assinatura ativa.") {
                setIsModal2Open(true);
            } else {
                toast.error(data.message || "Erro ao realizar o login.");
            }
        } catch (error) {
            toast.error("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <ToastContainer />
            
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(225,255,1,0.1),transparent_50%)]" />
            </div>

            {/* Login Container */}
            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="mx-auto w-48 h-auto transform hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Login Form */}
                <form 
                    onSubmit={handleSubmit}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50"
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-[#e1ff01] mb-2">
                            Bem-vindo de volta!
                        </h2>
                        <p className="text-gray-400">
                            Entre com suas credenciais para acessar sua conta
                        </p>
                    </div>

                    {/* Email Field */}
                    <div className="mb-6 space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-[#e1ff01] 
                                         focus:ring-1 focus:ring-[#e1ff01] transition-all duration-200"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-6 space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Senha
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-[#e1ff01] 
                                         focus:ring-1 focus:ring-[#e1ff01] transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-300 
                                         focus:outline-none transition-colors duration-200"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between mb-6">
                        <label className="relative flex items-center group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-gray-500 rounded 
                                          bg-gray-700/50 flex items-center justify-center
                                          peer-checked:border-[#e1ff01] peer-checked:bg-[#e1ff01]
                                          transition-all duration-200">
                                <svg
                                    className="w-3 h-3 text-gray-900 opacity-0 peer-checked:opacity-100"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <span className="ml-3 text-sm text-gray-300 group-hover:text-gray-200 
                                         transition-colors duration-200">
                                Lembrar-me
                            </span>
                        </label>
                        <a
                            href="/recuperar"
                            className="text-sm text-[#e1ff01] hover:text-[#b8cc00] 
                                     transition-colors duration-200"
                        >
                            Esqueceu a senha?
                        </a>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full bg-[#e1ff01] text-gray-900 rounded-xl py-3.5 px-4
                                 overflow-hidden group font-medium
                                 transition-all duration-300 ease-out
                                 hover:bg-[#d4f000] active:scale-[0.98]
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 disabled:hover:bg-[#e1ff01] disabled:active:scale-100"
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-gray-900/30 
                                                  border-t-gray-900 rounded-full animate-spin" />
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-wide">Acessar Plataforma</span>
                                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 
                                                           transition-transform duration-300 ease-out" />
                                </>
                            )}
                        </div>
                        <div className="absolute inset-0 scale-0 rounded-xl group-hover:scale-100 
                                      transition-transform duration-300 ease-out bg-white/10" />
                    </button>

                    <p className="mt-6 text-center text-gray-400">
                        Não tem uma conta?{" "}
                        <a
                            href="/cadastro"
                            className="text-[#e1ff01] hover:text-[#b8cc00] font-medium 
                                     transition-colors duration-200"
                        >
                            Cadastre-se
                        </a>
                    </p>
                </form>
            </div>

            <ModalLogin isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ModalPlano isOpen={isModal2Open} onClose={() => setIsModal2Open(false)} />
        </div>
    );
};

export default Login;