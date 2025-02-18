import React, { JSX } from "react";
import { useNavigate } from "react-router-dom";

export const ConteudoMobile = (): JSX.Element => {
    const navigate = useNavigate();
    return (
        <div className="overflow-hidden w-[390px] h-[760px] relative">
            <div className="absolute w-[351px] h-[200px] left-5 rounded-[0px_0px_33px_0px] overflow-hidden">
                <div className="relative w-[385px] h-[200px]" onClick={() => navigate("/sobre")}>
                    <img
                        className="absolute w-[351px] h-[200px] top-0 left-0"
                        alt="Container"
                        src="https://c.animaapp.com/F0NSxna3/img/container.svg"
                    />

                    <img
                        className="absolute w-[351px] h-[200px] top-0 left-0"
                        alt="Mask group"
                        src="https://c.animaapp.com/F0NSxna3/img/mask-group.png"
                    />

                    <div className="absolute w-[357px] h-[194px] top-0 left-7">
                        <div className="absolute w-[353px] top-0 left-0 [font-family:'Poppins',Helvetica] font-bold text-[#1b2026] text-[40px] tracking-[0] leading-[normal]">
                            THE FUTURE SYSTEM.
                        </div>

                        <div className="absolute w-[353px] top-[170px] left-0 [font-family:'Poppins',Helvetica] font-medium text-[#1b2026] text-base tracking-[0] leading-[normal]">
                            > conheça nosso sistema
                        </div>
                    </div>

                    <img
                        className="absolute w-[141px] h-[145px] top-[41px] left-[207px]"
                        alt="Img"
                        src="https://c.animaapp.com/F0NSxna3/img/-.svg"
                    />
                </div>
            </div>

            <div className="absolute w-[949px] h-[751px] top-[220px] left-5">
                <div
                    className="absolute w-[169px] h-[138px] top-0 left-0 group cursor-pointer z-10"
                    onClick={() => navigate("/contato")}
                >
                    <div className="w-full h-full bg-[#e1ff01] rounded-[40px] group-hover:scale-110 transition-transform duration-300" />
                    <img
                        className="absolute w-[70px] h-[70px] top-[34px] left-[49px] group-hover:scale-110 transition-transform duration-300"
                        alt="Vector"
                        src="https://c.animaapp.com/F0NSxna3/img/vector-1@2x.png"
                    />
                </div>


                <img
                    className="absolute w-[341px] h-[277px] top-0 left-[5px] object-cover"
                    alt="Vector"
                    src="https://c.animaapp.com/F0NSxna3/img/vector-2@2x.png"
                />

                <img
                    className="absolute w-[119px] h-[198px] top-[187px] left-[219px] z-10"
                    alt="Preos"
                    onClick={() => navigate("/planos")}
                    src="https://c.animaapp.com/F0NSxna3/img/pre-os.svg"
                />

                <div className="absolute w-[889px] h-[426px] top-[325px] left-[60px]">


                    <div className="absolute w-[341px] h-[242px] -top-9 left-[-55px] bg-[url(https://c.animaapp.com/bywmmQcs/img/vector.svg)] bg-[100%_100%]" 
                            onClick={() => navigate("/planos")}>
                        <img
                            className="absolute w-[105px] h-[105px] top-[131px] left-[220px]"
                            alt="Boto"
                            src="https://c.animaapp.com/bywmmQcs/img/bot-o.svg"
                        />

                        <div className="flex flex-col w-[184px] h-[140px] items-start gap-[43px] absolute top-[25px] left-1">
                            <p className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-[#1b2026] text-base text-center tracking-[0] leading-[normal]">
                                CONTROLE TOTAL PARA SEUS EVENTOS
                            </p>

                            <p className="relative self-stretch mb-[-34.00px] [font-family:'Poppins',Helvetica] font-medium text-[#1b2026] text-sm text-center tracking-[0] leading-[normal]">
                                Descubra a solução completa para gerenciamento eficiente e sucesso
                                garantido
                            </p>
                        </div>
                    </div>

                    <div className="flex w-[105px] h-[42px] items-end justify-center gap-2.5 px-[50px] py-2.5 absolute top-[5px] left-[165px] bg-black rounded-[36px] z-50" onClick={() => navigate("/planos")}>
                        <div className="relative w-fit mt-[-3.00px] ml-[-20.50px] mr-[-20.50px] [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[normal]">
                            Preço
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
