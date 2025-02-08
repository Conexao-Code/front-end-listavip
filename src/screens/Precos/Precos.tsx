import React, { useState, useEffect, JSX } from "react";
import { Menu } from "../../components/Menu";
import { FaArrowRightLong } from "react-icons/fa6";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { Check, Star, Zap } from 'lucide-react';

type FeatureType = {
  text: string;
  icon: string;
};

type PlanType = {
  title: string;
  description: string;
  price: string;
  features: FeatureType[];
  isPopular?: boolean;
  bgColor: string;
  borderColor: string;
};

const Feature = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 py-2 border-b border-gray-700/50 group">
    <div className="w-5 h-5 rounded-full bg-[#E1FF01]/10 flex items-center justify-center 
                  group-hover:bg-[#E1FF01]/20 transition-all duration-300">
      <Check className="w-3 h-3 text-[#E1FF01]" />
    </div>
    <p className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">
      {text}
    </p>
  </div>
);

const PlanCard = ({
  title,
  description,
  price,
  features,
  isPopular,
  bgColor,
  borderColor,
}: PlanType) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate("/pagamento", { state: { title, price } });
  };

  return (
    <div className={`relative flex flex-col h-full w-full md:w-[400px] rounded-3xl 
                    ${bgColor} border-2 ${borderColor}
                    transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
                    ${isPopular ? 'hover:border-[#E1FF01] scale-105 z-10' : 'hover:border-gray-500'}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 
                      bg-[#E1FF01] text-gray-900 text-sm font-bold px-6 py-1.5 
                      rounded-full flex items-center gap-2 shadow-xl">
          <Star className="w-4 h-4" />
          <span>Mais Vendido</span>
        </div>
      )}

      {/* Header */}
      <div className={`p-8 rounded-t-3xl ${isPopular ? 'bg-gray-800' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${isPopular ? 'bg-[#E1FF01]' : 'bg-gray-700'} 
                        flex items-center justify-center`}>
            <Zap className={`w-6 h-6 ${isPopular ? 'text-gray-900' : 'text-[#E1FF01]'}`} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <div className="mt-6 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold text-white">R${price}</span>
            <span className="text-gray-400 font-medium">/mês</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300
                    flex items-center justify-center gap-2 
                    ${isPopular 
                      ? 'bg-[#E1FF01] text-gray-900 hover:bg-[#b8cc00]' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                    }
                    transform hover:scale-[1.02] active:scale-[0.98]`}
        >
          <span>Começar agora</span>
          <FaArrowRightLong className={`transition-transform group-hover:translate-x-1`} />
        </button>
      </div>

      {/* Features */}
      <div className="p-8 pt-6">
        <div className="text-sm text-gray-400 uppercase font-semibold mb-4">O que está incluído</div>
        <div className="space-y-1">
          {features.map((feature, index) => (
            <Feature key={index} text={feature.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Precos = (): JSX.Element => {
  const [plans, setPlans] = useState<PlanType[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_URL}/api/plans`);
        if (response.ok) {
          const data = await response.json();
          const normalizedPlans: PlanType[] = [
            {
              title: "Plano Básico",
              description: data.basic.descricao,
              price: data.basic.price.replace("R$", "").trim(),
              features: data.basic.features.map((text: string) => ({
                text,
                icon: "https://c.animaapp.com/958aD3IT/img/icon-20.svg",
              })),
              bgColor: "bg-gray-800/80",
              borderColor: "border-gray-700",
            },
            {
              title: "Plano Intermediário",
              description: data.intermediate.descricao,
              price: data.intermediate.price.replace("R$", "").trim(),
              features: data.intermediate.features.map((text: string) => ({
                text,
                icon: "https://c.animaapp.com/958aD3IT/img/icon-12.svg",
              })),
              isPopular: true,
              bgColor: "bg-gray-800/90",
              borderColor: "border-[#E1FF01]/50",
            },
            {
              title: "Plano Corporativo",
              description: data.corporate.descricao,
              price: data.corporate.price.replace("R$", "").trim(),
              features: data.corporate.features.map((text: string) => ({
                text,
                icon: "https://c.animaapp.com/958aD3IT/img/icon-20.svg",
              })),
              bgColor: "bg-gray-800/80",
              borderColor: "border-gray-700",
            },
          ];
          setPlans(normalizedPlans);
        } else {
          console.error("Erro ao buscar os planos.");
        }
      } catch (error) {
        console.error("Erro ao buscar os planos:", error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      <Menu />

      <main className="container mx-auto px-4 py-20 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#E1FF01]/10 mb-6">
            <Zap className="w-5 h-5 text-[#E1FF01]" />
            <span className="text-[#E1FF01] font-medium">Escolha seu plano</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Preços <span className="text-[#E1FF01]">Transparentes</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Escolha o plano perfeito para suas necessidades. Sem surpresas, sem taxas ocultas.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-4">
            Precisa de ajuda para escolher o plano ideal?
          </p>
          <button 
            onClick={() => window.open('https://wa.me/5515991875600', '_blank')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white 
                     rounded-xl hover:bg-gray-700 transition-all duration-300
                     border border-gray-700 hover:border-gray-600"
          >
            <span>Fale com nossa equipe</span>
            <FaArrowRightLong />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Precos;