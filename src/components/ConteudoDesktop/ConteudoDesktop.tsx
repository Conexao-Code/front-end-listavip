import React, { JSX } from "react";
import { useNavigate } from "react-router-dom";

export const ConteudoDesktop = (): JSX.Element => {

    const navigate = useNavigate();
    return (
        <div className="relative w-[1839px] h-[760px] top-[-110] left-0.5">
            <div className="absolute w-[1839px] h-[1080px] top-0 left-0 bg-cover bg-[50%_50%]">
                <div className="absolute w-[1838px] h-[1024px] top-0 left-0 bg-[100%_100%]"
                    style={{
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                    }}>
                    <img
                        className="absolute w-[747px] h-[509px] top-[433px] left-[959px] object-cover"
                        alt="Vector"
                        src="https://c.animaapp.com/2qRT4LdN/img/vector-2.png"
                    />
                    <img
                        className="absolute w-[190px] h-[185px] top-[734px] left-[1047px]"
                        alt="Img"
                        src="https://c.animaapp.com/2qRT4LdN/img/--1.svg"
                    />
                </div>
            </div>

            <div className="absolute w-[969px] h-[489px] top-[113px] left-[78px]"
                style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}

                onClick={() => navigate("/planos")}>
                <div className="relative w-[800px] h-[455px] left-[19px]">
                    <img
                        className="absolute w-[633px] h-[455px] top-0 left-0"
                        alt="Container"
                        src="https://c.animaapp.com/2qRT4LdN/img/container.svg"
                    />

                    <img
                        className="absolute w-[800px] h-[455px] top-0 left-0"
                        alt="Mask group"
                        src="https://c.animaapp.com/2qRT4LdN/img/mask-group.png"
                    />

                    <img
                        className="absolute w-[310px] h-[363px] top-[47px] left-[131px]"
                        alt="Img"
                        src="https://c.animaapp.com/2qRT4LdN/img/-.svg"
                    />

                    <img
                        className="absolute w-[77px] h-[77px] top-[369px] left-[700px]"
                        alt="Boto"
                        src="https://c.animaapp.com/2qRT4LdN/img/bot-o.svg"
                    />

                    <div className="absolute w-[342px] h-[427px] top-[19px] left-[19px]">
                        <div className="absolute w-[338px] top-0 left-0 [font-family:'Poppins',Helvetica] font-bold text-[#1b2026] text-[40px] tracking-[0] leading-[normal]">
                            THE FUTURE SYSTEM.
                        </div>

                        <div className="absolute w-[338px] top-[398px] left-0 [font-family:'Poppins',Helvetica] font-medium text-[#1b2026] text-xl tracking-[0] leading-[normal]">
                            > conheça nosso sistema
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute w-[567px] h-[283px] top-[117px] left-[967px] bg-[#e1ff01] rounded-[40px]"
                style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}

                onClick={() => navigate("/planos")}>
                <img
                    className="absolute w-[467px] h-[283px] top-0 left-[275px]"
                    alt="Container"
                    src="https://c.animaapp.com/2qRT4LdN/img/container-1.svg"
                />
                <div
                    className="flex w-[105px] h-[42px] items-end justify-center gap-2.5 px-[50px] py-2.5 absolute bottom-[10px] left-[10px] bg-black rounded-[36px] z-50"
                >
                    <div className="relative w-fit mt-[-3px] ml-[-20.5px] mr-[-20.5px] [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
                        Preço
                    </div>
                </div>
                <img
                    className="absolute w-[70px] h-[73px] top-5 left-[18px]"
                    alt="Boto"
                    src="https://c.animaapp.com/2qRT4LdN/img/bot-o-1.svg"
                />
            </div>

            <div className="absolute w-[889px] h-[426px] top-[624px] left-[78px]"
                style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}

                onClick={() => navigate("/planos")}>
                <div className="relative w-[795px] h-[350px] top-[-33px] left-4 bg-[#e1ff01] rounded-[40px] bg-[url(https://c.animaapp.com/2qRT4LdN/img/mask-group-1.png)] bg-[100%_100%]">
                    <div className="flex flex-col w-[421px] h-[202px] items-start gap-2.5 absolute top-8 left-[353px]">
                        <p className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-[#1b2026] text-[32px] tracking-[0] leading-[normal]">
                            CONTROLE TOTAL PARA SEUS EVENTOS
                        </p>

                        <p className="relative w-[286px] [font-family:'Poppins',Helvetica] font-medium text-[#1b2026] text-lg tracking-[0] leading-[normal]">
                            Descubra a solução completa para gerenciamento eficiente e
                            sucesso garantido
                        </p>
                    </div>

                    <img
                        className="absolute w-[336px] h-[350px] top-0 left-0 object-cover"
                        alt="Container"
                        src="https://c.animaapp.com/2qRT4LdN/img/container-2@2x.png"
                    />

                    <img
                        className="absolute w-[92px] h-[85px] top-[243px] left-[682px]"
                        alt="Boto"
                        src="https://c.animaapp.com/2qRT4LdN/img/bot-o-2.svg"
                    />
                </div>
            </div>



            <div
                style={{
                    position: "absolute",
                    top: "443px",
                    left: "967px",
                    zIndex: 10,
                    width: "351px",
                    height: "244px",
                    backgroundColor: "#e1ff01",
                    borderRadius: "40px",
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}

                onClick={() => navigate("/contato")}
            >
                <img
                    style={{
                        position: "absolute",
                        width: "137px",
                        height: "133px",
                        top: "56px",
                        left: "119px",
                        transition: "transform 0.3s ease-in-out",
                    }}
                    alt="Vector"
                    src="https://c.animaapp.com/2qRT4LdN/img/vector-3@2x.png"
                />
            </div>



        </div>
    );
};
