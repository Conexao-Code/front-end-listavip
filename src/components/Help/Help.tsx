import React, { JSX, useState } from "react";
import { API_URL } from "../../config";
import InputMask from "react-input-mask";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Help = (): JSX.Element => {
  const [formData, setFormData] = useState({
    primeiroNome: "",
    sobrenome: "",
    email: "",
    phoneNumber: "",
    mensagem: "",
    concorda: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.concorda) {
      toast.error("Você precisa concordar com a política.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
        setFormData({
          primeiroNome: "",
          sobrenome: "",
          email: "",
          phoneNumber: "",
          mensagem: "",
          concorda: false,
        });
      } else {
        throw new Error("Erro ao enviar a mensagem. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[900px] bg-[#1b2026] border border-solid border-[#575560] rounded-2xl p-8 mt-12"
    >

      <ToastContainer />
      <h2 className="text-[#e1ff01] text-2xl font-semibold text-center md:text-left">
        Precisando de ajuda?
      </h2>
      <p className="text-white mt-2 text-center md:text-left">
        Tem alguma dúvida ou precisa de mais informações? Preencha o formulário
        abaixo e entraremos em contato o mais breve possível!
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="text-white font-semibold text-sm">Primeiro nome</label>
            <input
              type="text"
              name="primeiroNome"
              value={formData.primeiroNome}
              onChange={handleChange}
              className="w-full h-11 mt-2 border border-[#575561] rounded-2xl bg-[#302f39] text-white placeholder-[#666666] p-3"
              placeholder="Primeiro nome"
              required
            />
          </div>
          <div className="flex-1">
            <label className="text-white font-semibold text-sm">Sobrenome</label>
            <input
              type="text"
              name="sobrenome"
              value={formData.sobrenome}
              onChange={handleChange}
              className="w-full h-11 mt-2 border border-[#575561] rounded-2xl bg-[#302f39] text-white placeholder-[#666666] p-3"
              placeholder="Sobrenome"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-white font-semibold text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-11 mt-2 border border-[#575561] rounded-2xl bg-[#302f39] text-white placeholder-[#666666] p-3"
            placeholder="Insira seu email"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            required
          />
          <p className="text-[#e1ff01] text-sm mt-1">Formato válido: exemplo@dominio.com</p>
        </div>

        {/* Input de Telefone */}
        <div className="flex flex-col">
          <label className="text-white font-semibold text-sm">Phone number</label>
          <InputMask
            mask="+55 (99) 9999-99999"
            maskChar={null}
            value={formData.phoneNumber}
            onChange={handleChange}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                type="tel"
                name="phoneNumber"
                className="w-full h-11 mt-2 border border-[#575561] rounded-2xl bg-[#302f39] text-white placeholder-[#666666] p-3"
                placeholder="+55 (11) 1234-1234"
              />
            )}
          </InputMask>
          <p className="text-[#e1ff01] text-sm mt-1">Formato válido: +55 (11) 1234-12345</p>
        </div>

        <div className="flex flex-col">
          <label className="text-white font-semibold text-sm">Mensagem</label>
          <textarea
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            className="w-full h-32 mt-2 border border-[#575561] rounded-2xl bg-[#302f39] text-white placeholder-[#666666] p-3 resize-none"
            placeholder="Escreva sua mensagem aqui"
            required
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            name="concorda"
            checked={formData.concorda}
            onChange={handleChange}
            id="concorda"
            className="mr-2 appearance-none w-5 h-5 rounded-full bg-[#302f39] border border-[#575561] checked:bg-[#e1ff01] checked:border-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e1ff01]"
            required
          />
          <label htmlFor="concorda" className="text-[#ffffff] text-sm">
            Você concorda com nossa{" "}
            <a className="text-[#e1ff01] hover:underline">Política?</a>
          </label>
        </div>


        <button
          type="submit"
          className="w-full h-12 mt-6 bg-[#e1ff01] text-[#22252a] font-semibold rounded-2xl transition hover:bg-[#a8bf00] hover:scale-105 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Mensagem"}
        </button>

        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </div>
    </form>
  );
};
