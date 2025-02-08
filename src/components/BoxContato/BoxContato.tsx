import React from "react";
import background from "../../imagens/bg.png";

export const BoxContato: React.FC = () => {
    return (
        <div
            className="relative bg-no-repeat bg-cover bg-center text-white rounded-2xl p-6 md:p-8 max-w-[1200px] mt-10 mx-auto"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: '100% 100%',
                backgroundBlendMode: 'overlay',
            }}
        >
            <h2 className="text-xl font-semibold mb-2 text-white text-center sm:text-left">Horário de atendimento</h2>
            <p className="text-sm text-[#cccccc] mb-4 text-center sm:text-left">Estamos disponíveis nos seguintes horários:</p>
            <div className="text-sm mb-4 text-center sm:text-left">
                <p className="mb-1 text-[#e1ff01] font-bold">Segunda a Sexta: 9h às 18h</p>
                <p className="mb-1 text-[#e1ff01] font-bold">Sáb: 10h às 14:00</p>
            </div>
            <p className="text-sm text-[#cccccc] text-center sm:text-left">
                Fora desses horários, você pode enviar um e-mail ou mensagem no WhatsApp que responderemos assim que possível.
            </p>
        </div>
    );
};
