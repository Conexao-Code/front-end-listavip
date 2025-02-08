import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import InputMask from "react-input-mask";

interface Plano {
  titulo: string;
  descricao: string;
  valor: string;
  features: string[];
}

interface BoxPlanosProps {
  initialPlans: Plano[]; 
}

export const BoxPlanos = forwardRef(({ initialPlans }: BoxPlanosProps, ref) => {
  const [planos, setPlanos] = useState<Plano[]>(initialPlans || []); 

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedPlanos = [...planos];
    (updatedPlanos[index] as any)[field] = value;
    setPlanos(updatedPlanos);
  };

  const handleFeatureChange = (
    planoIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const updatedPlanos = [...planos];
    updatedPlanos[planoIndex].features[featureIndex] = value;
    setPlanos(updatedPlanos);
  };

  const addFeature = (index: number) => {
    const updatedPlanos = [...planos];
    updatedPlanos[index].features.push("");
    setPlanos(updatedPlanos);
  };

  const removeFeature = (planoIndex: number, featureIndex: number) => {
    const updatedPlanos = [...planos];
    if (updatedPlanos[planoIndex].features.length > 1) {
      updatedPlanos[planoIndex].features.splice(featureIndex, 1);
    }
    setPlanos(updatedPlanos);
  };

  useImperativeHandle(ref, () => ({
    getPlanos: () => planos,
  }));

  return (
    <div className="w-full max-w-[1880px] mx-auto p-4 space-y-6">
      {Array.isArray(planos) && planos.length > 0 ? ( 
        planos.map((plano, index) => (
          <div
            key={index}
            className="border border-solid border-[#575560] rounded-lg p-4 h-[400px] overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#575561 #302f39",
            }}
          >
            <style>
              {`
      div::-webkit-scrollbar {
        width: 8px;
      }
      div::-webkit-scrollbar-thumb {
        background-color: #575561;
        border-radius: 4px;
      }
      div::-webkit-scrollbar-track {
        background-color: #302f39;
      }
    `}
            </style>
            <h3 className="text-lg font-semibold text-[#e1ff01]">{plano.titulo}</h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-white font-medium text-sm block">Descrição</label>
                <textarea
                  value={plano.descricao}
                  onChange={(e) =>
                    handleInputChange(index, "descricao", e.target.value)
                  }
                  className="w-full h-20 mt-2 p-3 border border-[#575561] rounded-lg bg-[#302f39] text-white placeholder-[#666666] resize-none"
                  placeholder="Digite a descrição do plano"
                />
              </div>
              <div>
                <label className="text-white font-medium text-sm block">Valor (R$)</label>
                <InputMask
                  mask="R$ 999,99"
                  value={plano.valor}
                  onChange={(e) =>
                    handleInputChange(index, "valor", e.target.value)
                  }
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      className="w-full mt-2 p-3 border border-[#575561] rounded-lg bg-[#302f39] text-white placeholder-[#666666]"
                      placeholder="Digite o valor"
                    />
                  )}
                </InputMask>
              </div>
              <div>
                <label className="text-white font-medium text-sm block">Features</label>
                {plano.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center mt-2 relative"
                  >
                    <input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, featureIndex, e.target.value)
                      }
                      className="flex-1 p-3 border border-[#575561] rounded-lg bg-[#302f39] text-white placeholder-[#666666]"
                      placeholder={`Feature ${featureIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index, featureIndex)}
                      className={`absolute right-2 flex items-center justify-center transition ${plano.features.length === 1
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                        }`}
                      disabled={plano.features.length === 1}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature(index)}
                  className="mt-3 bg-[#e1ff01] text-[#22252a] px-4 py-2 rounded-lg font-medium hover:bg-[#a8bf00] transition"
                >
                  Adicionar nova feature
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white text-center">Nenhum plano disponível.</p>
      )}
    </div>
  );
});
