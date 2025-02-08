import React, { useState, useEffect, JSX } from "react";
import { Sidebar } from "../../components/Sidebar";
import { API_URL } from "../../config";
import { useTheme } from "../../ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import {
  Calendar,
  PlusCircle,
  Image as ImageIcon,
  Palette,
  Tag,
  DollarSign,
  Music,
  Settings,
  Users,
  Menu,
  X as XIcon,
} from "lucide-react";

const formatCurrency = (value: string): string => {
  value = value.replace(/\D/g, "");
  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(value) / 100
  );
  return result;
};

interface EventSection {
  title: string;
  icon: JSX.Element;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    <div className="flex items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent focus:outline-none text-white"
      />
    </div>
  </div>
);

export const EditarEvento = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("informações básicas");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [valorHomens, setValorHomens] = useState("0,00");
  const [valorMulheres, setValorMulheres] = useState("0,00");
  const [selectedColor, setSelectedColor] = useState("#e1ff01");
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  const [eventByBatch, setEventByBatch] = useState(false);
  const [addNamesToList, setAddNamesToList] = useState(false);
  const [attractions, setAttractions] = useState<string[]>([]);
  const [attractionInputValue, setAttractionInputValue] = useState<string>("");

  const sections: EventSection[] = [
    { title: "Informações Básicas", icon: <Settings className="w-5 h-5" /> },
    { title: "Ingressos", icon: <DollarSign className="w-5 h-5" /> },
    { title: "Personalização", icon: <Palette className="w-5 h-5" /> },
  ];

  const predefinedColors = ["#e1ff01", "#c8c8c8", "#f1f1f1"];

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/event/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEventName(data.event_name);
          setEventDate(new Date(data.event_date).toISOString().split("T")[0]);
          setEventType(data.event_type);
          setCategories(data.category ? data.category.split(", ") : []);
          setValorHomens(
            parseFloat(data.ticket_price_men).toFixed(2).replace(".", ",")
          );
          setValorMulheres(
            parseFloat(data.ticket_price_women).toFixed(2).replace(".", ",")
          );
          setSelectedColor(data.event_color || "#e1ff01");
          setCustomColor(data.event_color ? data.event_color : null);
          setEventImageUrl(data.event_image_url || null);
          setAttractions(data.attractions ? data.attractions.split(", ") : []);
          setEventByBatch(data.event_batch === "active");
          setAddNamesToList(data.guest_list === "active");
        } else {
          toast.error("Erro ao carregar as informações do evento.");
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados do evento.");
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && inputValue.trim() !== "") {
      if (categories.length < 3) {
        setCategories([...categories, inputValue.trim()]);
        setInputValue("");
      }
      e.preventDefault();
    }
  };

  const handleAttractionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttractionInputValue(e.target.value);
  };

  const handleAttractionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && attractionInputValue.trim() !== "") {
      if (attractions.length < 4) {
        setAttractions([...attractions, attractionInputValue.trim()]);
        setAttractionInputValue("");
      }
      e.preventDefault();
    }
  };

  const handleValorHomensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorHomens(formatCurrency(e.target.value));
  };

  const handleValorMulheresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorMulheres(formatCurrency(e.target.value));
  };

  const handlePredefinedColorClick = (color: string) => {
    setSelectedColor(color);
    setCustomColor(null);
  };

  const handleCustomColorClick = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
    setCustomColor(color.hex);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (
      !eventName.trim() ||
      !eventDate ||
      parseFloat(valorHomens.replace(",", ".")) <= 0 ||
      parseFloat(valorMulheres.replace(",", ".")) <= 0 ||
      categories.length === 0
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let imageUrl = eventImageUrl;
      if (eventImage) {
        const formData = new FormData();
        formData.append("image", eventImage);
        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (!uploadResponse.ok)
          throw new Error("Erro ao fazer upload da imagem");
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }
      const response = await fetch(`${API_URL}/api/event/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          event_date: eventDate,
          event_type: eventType,
          category: categories.join(", "),
          ticket_price_men: parseFloat(valorHomens.replace(",", ".")),
          ticket_price_women: parseFloat(valorMulheres.replace(",", ".")),
          event_color: customColor || selectedColor,
          event_image_url: imageUrl,
          attractions: attractions.join(", "),
          event_batch: eventByBatch ? "active" : "inactive",
          guest_list: addNamesToList ? "active" : "inactive",
        }),
      });
      if (response.ok) {
        toast.success("Evento atualizado com sucesso!");
        setTimeout(() => navigate("/eventos"), 1000);
      } else {
        throw new Error("Erro ao atualizar evento");
      }
    } catch (error) {
      toast.error("Erro ao atualizar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-hidden"
      style={{
        backgroundColor: theme === "dark" ? "#1A202C" : "#D6D6D6",
      }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 px-4 lg:px-8 pt-24 pb-8 w-full mx-auto overflow-y-auto">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="mb-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
              <PlusCircle className="w-6 h-6 text-[#e1ff01]" />
            </div>
            <div>
              <h1
                className="text-4xl font-bold"
                style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
              >
                Editar Evento
              </h1>
              <p className="text-gray-400">
                Altere os detalhes do seu evento
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(section.title.toLowerCase())}
                className={`w-full p-4 text-left rounded-xl transition-colors flex items-center gap-3 ${
                  activeSection === section.title.toLowerCase()
                    ? "bg-[#e1ff01]/10 text-[#e1ff01]"
                    : "bg-gray-800 hover:bg-gray-700/50 text-white"
                }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 space-y-6">
            {activeSection === "informações básicas" && (
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <Settings className="w-6 h-6 text-[#e1ff01]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Informações Básicas
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <InputField
                    label="Nome do Evento"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Digite o nome do evento"
                  />
                  <InputField
                    label="Data do Evento"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    type="date"
                    placeholder=""
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Categorias
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#e1ff01] text-gray-900 rounded-lg text-sm"
                        >
                          {category}
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={
                          categories.length < 3 ? "Digite e pressione espaço" : ""
                        }
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent focus:outline-none text-white"
                        disabled={categories.length >= 3}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Atrações
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      {attractions.map((attraction, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#e1ff01] text-gray-900 rounded-lg text-sm"
                        >
                          {attraction}
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={
                          attractions.length < 4 ? "Digite e pressione Enter" : ""
                        }
                        value={attractionInputValue}
                        onChange={handleAttractionInputChange}
                        onKeyDown={handleAttractionKeyDown}
                        className="flex-1 bg-transparent focus:outline-none text-white"
                        disabled={attractions.length >= 4}
                      />
                    </div>
                  </div>
                  <InputField
                    label="Tipo de Evento"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="Digite o tipo do evento"
                  />
                  <div className="md:col-span-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eventByBatch}
                          onChange={(e) => setEventByBatch(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:outline-none transition-all peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e1ff01]"></div>
                        <span className="ml-3 text-sm font-medium text-gray-300">
                          Evento por lote
                        </span>
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addNamesToList}
                          onChange={(e) => setAddNamesToList(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:outline-none transition-all peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e1ff01]"></div>
                        <span className="ml-3 text-sm font-medium text-gray-300">
                          Adicionar nomes na lista
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "ingressos" && (
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-[#e1ff01]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Ingressos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Valor para Homens
                    </label>
                    <div className="flex items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <span className="text-[#e1ff01] mr-2">R$</span>
                      <input
                        type="text"
                        value={valorHomens}
                        onChange={handleValorHomensChange}
                        className="flex-1 bg-transparent focus:outline-none text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Valor para Mulheres
                    </label>
                    <div className="flex items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <span className="text-[#e1ff01] mr-2">R$</span>
                      <input
                        type="text"
                        value={valorMulheres}
                        onChange={handleValorMulheresChange}
                        className="flex-1 bg-transparent focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "personalização" && (
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#e1ff01]/10 rounded-lg">
                    <Palette className="w-6 h-6 text-[#e1ff01]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Personalização
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="w-full md:w-[48%]">
                    <h3
                      className="text-sm font-bold text-[#f1f1f1] mb-1"
                      style={{ color: theme === "dark" ? "#F1F1F1" : "#000000" }}
                    >
                      Cor do Evento
                    </h3>
                    <div className="flex items-center gap-2.5">
                      {customColor && (
                        <div
                          className="relative w-[38px] h-[38px] rounded-[19px] border-4 border-solid border-[#302e38] cursor-pointer shadow-[0px_0px_0px_2px_#e1ff01]"
                          style={{ backgroundColor: customColor }}
                          onClick={handleCustomColorClick}
                        />
                      )}
                      {predefinedColors.map((color, index) => (
                        <div
                          key={index}
                          className={`relative w-[38px] h-[38px] rounded-[19px] border-4 border-solid border-[#302e38] cursor-pointer ${
                            selectedColor === color && !customColor
                              ? "shadow-[0px_0px_0px_2px_#e1ff01]"
                              : ""
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handlePredefinedColorClick(color)}
                        />
                      ))}
                      <div className="relative">
                        <div
                          className="w-[38px] h-[38px] cursor-pointer"
                          onClick={handleCustomColorClick}
                        >
                          <img
                            className="w-full h-full"
                            alt="Escolher cor personalizada"
                            src="https://c.animaapp.com/z4rpfJ0E/img/-.svg"
                          />
                        </div>
                        {isPickerOpen && (
                          <div className="absolute top-full left-0 mt-2 md:top-0 md:left-full md:ml-4 z-50">
                            <SketchPicker
                              color={selectedColor}
                              onChange={handleColorChange}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      Imagem do Evento
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-[#e1ff01] transition-colors">
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                          id="event-image"
                        />
                        <label
                          htmlFor="event-image"
                          className="cursor-pointer bg-[#e1ff01] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#b8cc00] transition-colors"
                        >
                          Escolher Imagem
                        </label>
                        <p className="mt-2 text-sm text-gray-400">
                          {eventImage ? eventImage.name : "PNG, JPG até 10MB"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => navigate("/eventos")}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#e1ff01] text-gray-900 hover:bg-[#b8cc00]"
                }`}
              >
                {isSubmitting ? "Salvando..." : "Salvar Evento"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};
