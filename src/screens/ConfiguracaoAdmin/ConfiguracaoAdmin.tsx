import React, { useState, useEffect, useRef, JSX } from "react";
import { SidebarAdmin } from "../../components/SidebarAdmin";
import { BoxPlanos } from "../../components/BoxPlanos";
import { API_URL } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../ThemeContext";

interface BoxPlanosRef {
    getPlanos: () => any[];
}

export const ConfiguracaoAdmin = (): JSX.Element => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useTheme();
    const [accessToken, setAccessToken] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [serviceFee, setServiceFee] = useState<string>("");
    const [plansConfig, setPlansConfig] = useState<any[]>([]);

    const boxPlanosRef = useRef<BoxPlanosRef>(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleServiceFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, "");
        if (input !== "") {
            const intValue = parseInt(input, 10);
            if (intValue >= 1 && intValue <= 100) {
                setServiceFee(`${intValue}%`);
            } else if (intValue > 100) {
                setServiceFee("100%");
            }
        } else {
            setServiceFee("");
        }
    };

    const fetchConfig = async () => {
        try {
            const response = await fetch(`${API_URL}/api/config`);
            if (response.ok) {
                const data = await response.json();
                setAccessToken(data.accessToken);
                setClientId(data.clientId);
                setClientSecret(data.clientSecret);
                setServiceFee(`${data.serviceFee}%`);

                const plansArray = [
                    { titulo: "Plano Básico", ...data.plansConfig.basic, valor: data.plansConfig.basic.price },
                    { titulo: "Plano Intermediário", ...data.plansConfig.intermediate, valor: data.plansConfig.intermediate.price },
                    { titulo: "Plano Corporativo", ...data.plansConfig.corporate, valor: data.plansConfig.corporate.price },
                ];
                setPlansConfig(plansArray);
            } else {
                toast.error("Erro ao carregar configurações.");
            }
        } catch (error) {
            console.error("Erro ao buscar configurações:", error);
            toast.error("Erro ao buscar configurações.");
        }
    };

    const saveConfig = async () => {
        try {
            // Garante que o ref não é nulo antes de acessar `getPlanos`
            if (boxPlanosRef.current) {
                const updatedPlansConfig = boxPlanosRef.current.getPlanos();
                const plansConfigObject = updatedPlansConfig.reduce((acc: any, plan: any) => {
                    const key = plan.titulo
                        .toLowerCase()
                        .replace("plano ", "")
                        .replace(" ", "");
                    acc[key] = {
                        titulo: plan.titulo,
                        descricao: plan.descricao,
                        price: plan.valor,
                        features: plan.features,
                    };
                    return acc;
                }, {});

                const response = await fetch(`${API_URL}/api/config`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken,
                        clientId,
                        clientSecret,
                        serviceFee: Number(serviceFee.replace("%", "")),
                        plansConfig: plansConfigObject,
                    }),
                });

                if (response.ok) {
                    toast.success("Configurações salvas com sucesso.");
                } else {
                    toast.error("Erro ao salvar configurações.");
                }
            } else {
                toast.error("Referência para BoxPlanos não encontrada.");
            }
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            toast.error("Erro ao salvar configurações.");
        }
    };


    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <div
            className="flex flex-col lg:flex-row h-screen"
            style={{
                backgroundColor: theme === "dark" ? "#22252A" : "#D6D6D6",
            }}
        >
            <SidebarAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <ToastContainer />
            <div className="flex-1 overflow-y-auto p-6 mt-[70px] w-full max-w-[1880px] mx-auto">
                <div className="mb-6">
                    <h1
                        className="text-4xl font-bold text-[#f1f1f1] [font-family:'Poppins',Helvetica]"
                        style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
                    >
                        Configurações
                    </h1>
                    <p
                        className="text-base font-medium text-[#ffffff66] [font-family:'Poppins',Helvetica]"
                        style={{
                            color: theme === "dark" ? "#ffffff66" : "#545454",
                        }}
                    >
                        Ajuste e personalize a experiência de seus clientes.
                    </p>
                </div>

                <img
                    className="w-full h-3 object-cover mt-4"
                    alt="Divisor"
                    src="https://c.animaapp.com/tyxgDvEv/img/divisor-7.svg"
                />

                <div className="border-b border-[#575560] pb-4 mb-6">
                    <h3 className="text-xl font-bold text-[#e1ff01] mb-4">
                        Gateway de pagamento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="w-full">
                            <label
                                className="text-sm font-bold"
                                style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
                            >
                                AccesToken
                            </label>
                            <input
                                type="text"
                                value={accessToken}
                                onChange={(e) => setAccessToken(e.target.value)}
                                placeholder="AccesToken"
                                className="rounded-2xl w-full p-3 bg-transparent border focus:outline-none focus:ring-2 focus:ring-[#e1ff01]"
                                style={{
                                    backgroundColor: theme === "dark" ? "#2f2e39" : "#CACBCB",
                                    borderColor: theme === "dark" ? "#575560" : "#DDDDDD",
                                    color: theme === "dark" ? "#F1F1F1" : "#000000",
                                }}
                            />
                        </div>

                        <div className="w-full">
                            <label
                                className="text-sm font-bold"
                                style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
                            >
                                ClientId
                            </label>
                            <input
                                type="text"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                placeholder="ClientId"
                                className="rounded-2xl w-full p-3 bg-transparent border focus:outline-none focus:ring-2 focus:ring-[#e1ff01]"
                                style={{
                                    backgroundColor: theme === "dark" ? "#2f2e39" : "#CACBCB",
                                    borderColor: theme === "dark" ? "#575560" : "#DDDDDD",
                                    color: theme === "dark" ? "#F1F1F1" : "#000000",
                                }}
                            />
                        </div>

                        <div className="w-full">
                            <label
                                className="text-sm font-bold"
                                style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
                            >
                                ClientSecret
                            </label>
                            <input
                                type="text"
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder="ClientSecret"
                                className="rounded-2xl w-full p-3 bg-transparent border focus:outline-none focus:ring-2 focus:ring-[#e1ff01]"
                                style={{
                                    backgroundColor: theme === "dark" ? "#2f2e39" : "#CACBCB",
                                    borderColor: theme === "dark" ? "#575560" : "#DDDDDD",
                                    color: theme === "dark" ? "#F1F1F1" : "#000000",
                                }}
                            />
                        </div>

                        <div className="w-full">
                            <label
                                className="text-sm font-bold"
                                style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
                            >
                                Taxa de Serviço (%)
                            </label>
                            <input
                                type="text"
                                value={serviceFee}
                                onChange={handleServiceFeeChange}
                                placeholder="Taxa de Serviço"
                                className="rounded-2xl w-full p-3 bg-transparent border focus:outline-none focus:ring-2 focus:ring-[#e1ff01]"
                                style={{
                                    backgroundColor: theme === "dark" ? "#2f2e39" : "#CACBCB",
                                    borderColor: theme === "dark" ? "#575560" : "#DDDDDD",
                                    color: theme === "dark" ? "#F1F1F1" : "#000000",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {plansConfig.length > 0 && <BoxPlanos ref={boxPlanosRef} initialPlans={plansConfig} />}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={saveConfig}
                        className="px-6 py-3 rounded-full font-bold text-sm"
                        style={{ backgroundColor: "#E1FF01", color: "#22252A" }}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};
