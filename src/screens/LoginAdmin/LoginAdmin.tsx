import React, { useState, useEffect, useContext, JSX } from "react";
import logo from "../../imagens/logo.png";
import { API_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

export const LoginAdmin = (): JSX.Element => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem("rememberedUsername");
        const savedRememberMe = localStorage.getItem("rememberMe");
        if (savedUsername && savedRememberMe === "true") {
            setFormData({ ...formData, username: savedUsername });
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setRememberMe(isChecked);

        if (isChecked) {
            localStorage.setItem("rememberedUsername", formData.username);
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberMe");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/login-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                const token = result.token;
                login(token);
                toast.success('Login realizado com sucesso!');
                navigate('/saque-requests');
            } else {
                toast.error(result.message || 'Erro ao realizar o login.');
            }
        } catch (error) {
            toast.error('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "100vh",
                backgroundColor: "#1b2026",
                overflow: "hidden",
            }}
        >
            <ToastContainer />
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "auto",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        opacity: 0.2,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        overflow: "hidden",
                    }}
                ></div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100vh",
                        backgroundColor: "#1b2026",
                        padding: "0 16px",
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            maxWidth: "500px",
                            padding: "30px",
                            zIndex: 50,
                            gap: "26px",
                            borderRadius: "20px",
                            border: "1px solid #707070",
                            backgroundColor: "#1b2026",
                            fontFamily: "'Poppins', sans-serif",
                            boxSizing: "border-box",
                            transition: "max-width 0.3s ease-in-out",
                        }}
                    >
                        <style>
                            {`
                                @media (max-width: 768px) {
                                    form {
                                        max-width: 400px; 
                                    }
                                }
                            `}
                        </style>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "auto",
                                maxWidth: "250px",
                                margin: "0 auto",
                            }}
                        >
                            <picture>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: "120px",
                                    }}
                                />
                            </picture>
                        </div>

                        <header
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "16px",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    color: "#e1ff01",
                                    fontSize: "24px",
                                    textAlign: "center",
                                    lineHeight: "32px",
                                }}
                            >
                                Entre na sua conta
                            </div>
                            <p
                                style={{
                                    fontWeight: "500",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    textAlign: "center",
                                    lineHeight: "20px",
                                }}
                            >
                                Insira suas credenciais para acessar o painel administrador.
                            </p>
                        </header>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                width: "100%",
                            }}
                        >
                            {[
                                { label: "Usuário", name: "username", placeholder: "Insira seu usuário", type: "text" },
                                { label: "Senha", name: "password", placeholder: "Insira sua senha", type: "password" },
                            ].map((field, index) => (
                                <div key={index} style={{ width: "100%" }}>
                                    <label
                                        style={{
                                            color: "#ffffff",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            display: "block",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        style={{
                                            width: "100%",
                                            height: "40px",
                                            borderRadius: "10px",
                                            backgroundColor: "#302f39",
                                            border: "1px solid #575561",
                                            color: "#ffffff",
                                            fontSize: "14px",
                                            padding: "0 10px",
                                        }}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={handleRememberMeChange}
                                    style={{
                                        marginRight: "8px",
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: rememberMe ? "#e1ff01" : "#302f39",
                                        border: "1px solid #575561",
                                        appearance: "none",
                                    }}
                                />
                                <label
                                    htmlFor="remember"
                                    style={{
                                        color: "#ffffff",
                                        fontSize: "14px",
                                    }}
                                >
                                    Lembrar de mim
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                height: "40px",
                                borderRadius: "10px",
                                backgroundColor: "#e1ff01",
                                border: "none",
                                color: "#22252a",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

};
