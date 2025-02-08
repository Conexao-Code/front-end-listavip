import React, { useState, useEffect, useCallback, JSX } from "react";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../ThemeContext";
import {
  Settings,
  User,
  Image,
  Droplet,
  Menu,
  Globe,
  X as XIcon,
} from "lucide-react";
import { InputField } from "./InputField"; // ajuste o caminho conforme necessário

interface CompanyData {
  domain: string;
  background_url: string;
  logo_url: string;
  background_color: string;
  blur_effect: string;
}

interface UserData {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  cpf: string;
  rg: string;
  pix_key: string;
  company: CompanyData;
  role: string;
}

export const Configuracao = (): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const [selectedColor, setSelectedColor] = useState("#e1ff01");
  const [blurEffect, setBlurEffect] = useState<string>("inactive");
  const [role, setRole] = useState<string>("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState("personal");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    nascimento: "",
    cpf: "",
    rg: "",
    chavePix: "",
    dominio: "",
    backgroundLink: "",
    logoLink: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const fullName = localStorage.getItem("fullName");
        if (!fullName) {
          console.error("Nome completo não encontrado");
          return;
        }
        const response = await fetch(
          `${API_URL}/api/user-infos?full_name=${encodeURIComponent(fullName)}`
        );
        if (response.ok) {
          const data: UserData = await response.json();
          setFormData({
            nome: data.full_name,
            email: data.email,
            telefone: data.phone,
            nascimento: data.birth_date,
            cpf: data.cpf,
            rg: data.rg,
            chavePix: data.pix_key,
            dominio: data.company.domain,
            backgroundLink: data.company.background_url,
            logoLink: data.company.logo_url,
          });
          setBlurEffect(data.company.blur_effect);
          setRole(data.role);
          setSelectedColor(data.company.background_color);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar informações");
      }
    };
    fetchUserInfo();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    []
  );

  const handleSaveChanges = async () => {
    try {
      const company_id = localStorage.getItem("companyId");
      let uploadedImageUrl = formData.backgroundLink;
      if (eventImage) {
        const formDataUpload = new FormData();
        formDataUpload.append("image", eventImage);
        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formDataUpload,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          uploadedImageUrl = uploadData.imageUrl;
        } else {
          toast.error("Erro no upload da imagem");
          return;
        }
      }
      const updateData = {
        company_id,
        full_name: formData.nome,
        email: formData.email,
        phone: formData.telefone,
        birth_date: formData.nascimento,
        cpf: formData.cpf,
        rg: formData.rg,
        pix_key: formData.chavePix,
        domain: formData.dominio,
        logo_url: formData.logoLink,
        background_url: uploadedImageUrl,
        background_color: selectedColor,
        blur_effect: blurEffect,
      };
      const response = await fetch(`${API_URL}/api/update-user-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        localStorage.setItem("fullName", formData.nome);
        toast.success("Alterações salvas com sucesso!");
      } else {
        toast.error("Erro ao salvar alterações");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao processar solicitação");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  const SectionHeader = useCallback(
    ({
      title,
      icon,
    }: {
      title: string;
      icon: JSX.Element;
    }) => (
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#e1ff01]/10 rounded-lg">{icon}</div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
    ),
    []
  );

  const ConfigCard = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50">
        {children}
      </div>
    ),
    []
  );

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-y-auto"
      style={{
        backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6",
      }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 px-4 lg:px-8 pt-24 pb-8 w-full mx-auto">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <div className="mb-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
              <Settings className="w-6 h-6 text-[#e1ff01]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Configurações
              </h1>
              <p className="text-gray-400">
                Gerencie suas preferências e configurações de conta
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navegação */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveSection("personal")}
              className={`w-full p-4 text-left rounded-xl transition-colors ${
                activeSection === "personal"
                  ? "bg-[#e1ff01]/10 text-[#e1ff01]"
                  : "bg-gray-800 hover:bg-gray-700/50 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span>Informações Pessoais</span>
              </div>
            </button>
            <button
              onClick={() => setActiveSection("appearance")}
              className={`w-full p-4 text-left rounded-xl transition-colors ${
                activeSection === "appearance"
                  ? "bg-[#e1ff01]/10 text-[#e1ff01]"
                  : "bg-gray-800 hover:bg-gray-700/50 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Droplet className="w-5 h-5" />
                <span>Aparência</span>
              </div>
            </button>
            <button
              onClick={() => setActiveSection("domain")}
              className={`w-full p-4 text-left rounded-xl transition-colors ${
                activeSection === "domain"
                  ? "bg-[#e1ff01]/10 text-[#e1ff01]"
                  : "bg-gray-800 hover:bg-gray-700/50 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span>Domínio</span>
              </div>
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === "personal" && (
              <ConfigCard>
                <SectionHeader
                  title="Informações Pessoais"
                  icon={<User className="w-6 h-6 text-[#e1ff01]" />}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Nome Completo"
                    name="nome"
                    value={formData.nome}
                    placeholder="Aloe Vera"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="E-mail"
                    name="email"
                    value={formData.email}
                    placeholder="AloeVera@gmail.com"
                    type="email"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Telefone"
                    name="telefone"
                    value={formData.telefone}
                    placeholder="+55 (11) 1234-1234"
                    type="tel"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Data de Nascimento"
                    name="nascimento"
                    value={formData.nascimento}
                    placeholder="DD/MM/AAAA"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    placeholder="123.456.789-00"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="RG"
                    name="rg"
                    value={formData.rg}
                    placeholder="12.345.678-9"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Chave PIX"
                    name="chavePix"
                    value={formData.chavePix}
                    placeholder="chave.pix@example.com"
                    onChange={handleInputChange}
                  />
                </div>
              </ConfigCard>
            )}

            {activeSection === "appearance" && (
              <ConfigCard>
                <SectionHeader
                  title="Personalização Visual"
                  icon={<Image className="w-6 h-6 text-[#e1ff01]" />}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">
                      Fundo do Painel
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="relative group">
                        <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 transition-all group-hover:border-[#e1ff01]">
                          <input
                            type="file"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            disabled={role !== "ceo"}
                          />
                          <div className="text-center">
                            <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-400 text-sm">
                              {eventImage
                                ? eventImage.name
                                : "Arraste ou clique para enviar"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Recomendado: 512x368px
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">
                      Efeitos Visuais
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-300">Efeito Blur</span>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            checked={blurEffect === "active"}
                            onChange={() =>
                              setBlurEffect((prev) =>
                                prev === "active" ? "inactive" : "active"
                              )
                            }
                            className="opacity-0 w-0 h-0"
                            disabled={role !== "ceo"}
                          />
                          <span
                            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                              blurEffect === "active"
                                ? "bg-[#e1ff01]"
                                : "bg-gray-600"
                            }`}
                          >
                            <span
                              className={`absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-transform ${
                                blurEffect === "active"
                                  ? "translate-x-6"
                                  : "translate-x-0"
                              }`}
                            ></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </ConfigCard>
            )}

            {activeSection === "domain" && (
              <ConfigCard>
                <SectionHeader
                  title="Configuração de Domínio"
                  icon={<Globe className="w-6 h-6 text-[#e1ff01]" />}
                />
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Subdomínio
                    </label>
                    <input
                      type="text"
                      name="dominio"
                      value={formData.dominio}
                      onChange={handleInputChange}
                      placeholder="seudominio"
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e1ff01] text-white"
                      disabled={role !== "ceo"}
                    />
                    <div className="mt-2 text-sm text-gray-400">
                      <p>Seu site ficará disponível em:</p>
                      <p className="mt-1 font-mono bg-gray-700/30 p-2 rounded">
                        {formData.dominio ? formData.dominio : "seudominio"}
                        <span className="text-[#e1ff01]">.lista.vip</span>
                      </p>
                    </div>
                  </div>
                </div>
              </ConfigCard>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-3 bg-[#e1ff01] text-gray-900 font-semibold rounded-lg hover:bg-[#d1d100] transition-colors flex items-center gap-2"
                disabled={role !== "ceo" && activeSection === "appearance"}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme={theme}
        />
      </main>
    </div>
  );
};

export default Configuracao;
