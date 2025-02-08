import React, { JSX, useState } from "react";
import InputMask from "react-input-mask";
import logo from "../../imagens/logo.png";
import { API_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalPromoterCadastro } from "../../components/ModalPromoterCadastro";

export const CadastroPromoters = (): JSX.Element => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        cpf: "",
        telefone: "",
        password: "",
        confirmPassword: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const navigate = useNavigate();
    const { nomefantasia } = useParams<{ nomefantasia: string }>();
    const decodedFantasyName = nomefantasia
        ? decodeURIComponent(nomefantasia.replace(/_/g, ' '))
        : "";


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/register-promoter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    cpf: formData.cpf.replace(/\D/g, ''),
                    telefone: formData.telefone.replace(/\D/g, ''),
                    password: formData.password,
                    fantasy_name: decodedFantasyName
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Promoter registrado com sucesso.");
                handleModalOpen();
            } else {
                toast.error(data.message || "Erro ao registrar o promoter.");
            }
        } catch (error) {
            toast.error("Erro ao conectar com o servidor.");
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
                                Se candidate como promoter
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
                                Insira suas informações abaixo e aguarde um membro da equipe te aprovar como promoter.
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
                                { label: "Nome Completo", name: "full_name", placeholder: "Insira o seu nome", type: "text" },
                                { label: "Email", name: "email", placeholder: "Insira seu email", type: "email" },
                                { label: "CPF", name: "cpf", placeholder: "Insira seu CPF", type: "text", mask: "999.999.999-99" },
                                { label: "Telefone", name: "telefone", placeholder: "Insira seu número de telefone", type: "text", mask: "(99) 99999-9999" },
                                { label: "Senha", name: "password", placeholder: "Insira sua senha", type: "password" },
                                { label: "Confirme sua senha", name: "confirmPassword", placeholder: "Insira sua senha novamente", type: "password" },
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
                                    {field.mask ? (
                                        <InputMask
                                            mask={field.mask}
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
                                    ) : (
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
                                    )}
                                </div>
                            ))}
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
                            Se candidatar
                        </button>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "4px",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    color: "#ffffff",
                                    fontSize: "14px",
                                }}
                            >
                                Já é promoter?
                            </div>
                            <a
                                href="/login"
                                style={{
                                    color: "#e1ff01",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    textDecoration: "underline",
                                }}
                            >
                                Inicie sua sessão
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <ModalPromoterCadastro isOpen={isModalOpen} onClose={handleModalClose} fantasyName={decodedFantasyName} />
        </div>
    );

};
