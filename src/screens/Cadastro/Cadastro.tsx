import React, { useState } from "react";
import logo from "../../imagens/logo.png";
import { API_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight, Eye, EyeOff, User } from 'lucide-react';

export const Cadastro = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Usuário registrado com sucesso.");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(data.message || "Erro ao registrar o usuário.");
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

            {/* Register Container */}
            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="mx-auto w-48 h-auto transform hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Register Form */}
                <form 
                    onSubmit={handleSubmit}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50"
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-[#e1ff01] mb-2">
                            Crie uma nova conta
                        </h2>
                        <p className="text-gray-400">
                            Insira suas credenciais para criar uma nova conta
                        </p>
                    </div>

                    {/* Full Name Field */}
                    <div className="mb-6 space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Nome Completo
                        </label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-[#e1ff01] 
                                         focus:ring-1 focus:ring-[#e1ff01] transition-all duration-200"
                                placeholder="Insira o seu nome"
                                required
                            />
                        </div>
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
                                placeholder="Insira seu email"
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
                                placeholder="Insira sua senha"
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

                    {/* Confirm Password Field */}
                    <div className="mb-6 space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Confirme sua senha
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-[#e1ff01] 
                                         focus:ring-1 focus:ring-[#e1ff01] transition-all duration-200"
                                placeholder="Insira sua senha novamente"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-300 
                                         focus:outline-none transition-colors duration-200"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
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
                                    <span>Criando conta...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-wide">Criar uma nova conta</span>
                                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 
                                                           transition-transform duration-300 ease-out" />
                                </>
                            )}
                        </div>
                        <div className="absolute inset-0 scale-0 rounded-xl group-hover:scale-100 
                                      transition-transform duration-300 ease-out bg-white/10" />
                    </button>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-gray-400">
                        Já tem uma conta?{" "}
                        <a
                            href="/login"
                            className="text-[#e1ff01] hover:text-[#b8cc00] font-medium 
                                     transition-colors duration-200"
                        >
                            Inicie sua sessão
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Cadastro;