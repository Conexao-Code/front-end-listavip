import React, { JSX, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { API_URL } from "../../config";

interface ModalTicketAntecipadoProps {
  isOpen: boolean;
  onClose: () => void;
  ticketInfo: {
    name: string;
    cpf: string;
    phone: string;
    gender: string;
    email: string;
    ticketPrice: string;
    eventName: string;
    eventColor: string;
    qrCodeUrl?: string;
    qrCodeImage?: string;
  };
}


export const ModalTicketAntecipado = ({ isOpen, onClose, ticketInfo }: ModalTicketAntecipadoProps): JSX.Element | null => {
  const modalRef = React.useRef(null);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const captureAndSendEmail = async () => {
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current);
      const imageData = canvas.toDataURL("image/png");

      try {
        const response = await fetch(`${API_URL}/api/send-ticket-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData,
            email: ticketInfo.email,
          }),
        });

        if (response.ok) {
        } else {
          console.error("Erro ao enviar o e-mail:", await response.text());
        }

        const link = document.createElement("a");
        link.href = imageData;
        link.download = `${ticketInfo.eventName}-ticket.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error("Erro ao enviar o e-mail ou baixar a imagem:", error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      captureAndSendEmail();
    }
  }, [isOpen]);

  const fillColor = ticketInfo.eventColor || "#E1FF01";

  const formatName = (name: string) => {
    return name.length > 10 ? `${name.split(" ")[0]} ${name.split(" ")[1][0]}.` : name;
  };

  const formattedTicketPrice = `R$ ${parseFloat(ticketInfo.ticketPrice).toFixed(2).replace(".", ",")}`;

  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  }).replace(".", "");

  const formattedGender = ticketInfo.gender
    ? ticketInfo.gender.charAt(0).toUpperCase() + ticketInfo.gender.slice(1)
    : '';

  const svgBackground = `data:image/svg+xml,%3Csvg width='434' height='726' viewBox='0 0 434 726' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_dd_1_11400)'%3E%3Cmask id='path-1-inside-1_1_11400' fill='white'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M44 0C30.7452 0 20 10.7451 20 24V352.17C27.6664 355.167 33.1049 362.699 33.1049 371.518C33.1049 380.337 27.6664 387.87 20 390.867V661.816C20 675.071 30.7452 685.816 44 685.816H389.958C403.213 685.816 413.958 675.071 413.958 661.816V390.525C406.726 387.326 401.673 380.02 401.673 371.518C401.673 363.017 406.726 355.711 413.958 352.512V24C413.958 10.7452 403.213 0 389.958 0H44Z'/%3E%3C/path fill='%231B2026'/%3E%3C/path fill='%231B2026' mask='url(%23path-1-inside-1_1_11400)'/%3E%3C/g%3E%3C/defs%3E%3C/svg%3E`;

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClickOutside}
      style={{ backdropFilter: 'blur(5px)' }}>
      <div ref={modalRef} className="fixed w-[394px] h-[694px]">
        <div className="relative h-[694px]">
          <div className="absolute w-[394px] h-[686px] top-0 left-0">
            <div className="relative w-[434px] h-[726px] -left-5">
              {/* SVG de fundo */}
              <svg
                className="absolute top-0 left-0 w-full h-full"
                width="434"
                height="726"
                viewBox="0 0 434 726"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_dd_1_11400)">
                  <mask id="path-1-inside-1_1_11400" fill="white">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M44 0C30.7452 0 20 10.7451 20 24V352.17C27.6664 355.167 33.1049 362.699 33.1049 371.518C33.1049 380.337 27.6664 387.87 20 390.867V661.816C20 675.071 30.7452 685.816 44 685.816H389.958C403.213 685.816 413.958 675.071 413.958 661.816V390.525C406.726 387.326 401.673 380.02 401.673 371.518C401.673 363.017 406.726 355.711 413.958 352.512V24C413.958 10.7452 403.213 0 389.958 0H44Z"
                    />
                  </mask>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M44 0C30.7452 0 20 10.7451 20 24V352.17C27.6664 355.167 33.1049 362.699 33.1049 371.518C33.1049 380.337 27.6664 387.87 20 390.867V661.816C20 675.071 30.7452 685.816 44 685.816H389.958C403.213 685.816 413.958 675.071 413.958 661.816V390.525C406.726 387.326 401.673 380.02 401.673 371.518C401.673 363.017 406.726 355.711 413.958 352.512V24C413.958 10.7452 403.213 0 389.958 0H44Z"
                    fill="#1B2026"
                  />
                  <path
                    d="M20 352.17H19V352.853L19.636 353.102L20 352.17ZM20 390.867L19.636 389.935L19 390.184V390.867H20ZM413.958 390.525H414.958V389.874L414.363 389.611L413.958 390.525ZM413.958 352.512L414.363 353.426L414.958 353.163V352.512H413.958ZM21 24C21 11.2974 31.2975 1 44 1V-1C30.1929 -1 19 10.1929 19 24H21ZM21 352.17V24H19V352.17H21ZM19.636 353.102C26.9261 355.951 32.1049 363.119 32.1049 371.518H34.1049C34.1049 362.28 28.4068 354.382 20.364 351.239L19.636 353.102ZM32.1049 371.518C32.1049 379.918 26.9261 387.086 19.636 389.935L20.364 391.798C28.4068 388.655 34.1049 380.757 34.1049 371.518H32.1049ZM21 661.816V390.867H19V661.816H21ZM44 684.816C31.2974 684.816 21 674.519 21 661.816H19C19 675.623 30.1929 686.816 44 686.816V684.816ZM389.958 684.816H44V686.816H389.958V684.816ZM412.958 661.816C412.958 674.519 402.661 684.816 389.958 684.816V686.816C403.765 686.816 414.958 675.623 414.958 661.816H412.958ZM412.958 390.525V661.816H414.958V390.525H412.958ZM414.363 389.611C407.485 386.568 402.673 379.615 402.673 371.518H400.673C400.673 380.424 405.968 388.084 413.553 391.44L414.363 389.611ZM402.673 371.518C402.673 363.422 407.485 356.469 414.363 353.426L413.553 351.597C405.968 354.953 400.673 362.613 400.673 371.518H402.673ZM412.958 24V352.512H414.958V24H412.958ZM389.958 1C402.661 1 412.958 11.2975 412.958 24H414.958C414.958 10.1929 403.765 -1 389.958 -1V1ZM44 1H389.958V-1H44V1Z"
                    fill="#1B2026"
                    mask="url(#path-1-inside-1_1_11400)"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_1_11400"
                    x="0"
                    y="0"
                    width="433.958"
                    height="725.816"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="4"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect1_dropShadow_1_11400"
                    />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="4" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.03 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_1_11400"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="4"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect2_dropShadow_1_11400"
                    />
                    <feOffset dy="20" />
                    <feGaussianBlur stdDeviation="12" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_1_11400"
                      result="effect2_dropShadow_1_11400"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_1_11400"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
              <svg
                className="absolute w-[404px] h-[694px] top-0 left-3.5"
                viewBox="0 0 1195 2048"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  transform="translate(21,1024)"
                  d="m0 0h1162v16l-11 7-10 9-7 10-5 12-2 9v19l4 14 7 13 7 8 13 9 4 3v806l-3 16-8 17-12 14-13 9-11 5-11 3-8 1h-1029l-15-2-13-5-10-6-12-11-9-12-5-12-3-11-1-8v-796l1-7 9-6 11-8 8-10 6-12 3-13v-18l-3-12-6-12-7-9-9-8-12-7-1-1v-10z"
                  fill={fillColor}
                />
                <path
                  transform="translate(21,355)"
                  d="m0 0h1162v45l-1 1h-1161l-1-1v-44z"
                  fill={fillColor}
                />
                <path
                  transform="translate(71,2020)"
                  d="m0 0h1061l-2 2-13 2h-1029l-15-2z"
                  fill="#0C0909"
                />
                <path
                  transform="translate(21,1024)"
                  d="m0 0h1162v16l-3 1-1-13-1158-1z"
                  fill="#0C090A"
                />
                <path
                  transform="translate(1180,1152)"
                  d="m0 0 3 1v806l-2 12h-1z"
                  fill="#0C090A"
                />
              </svg>
            </div>
          </div>
          <button
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#1B2026] flex items-center justify-center text-white hover:bg-[#29313A] focus:outline-none z-50"
            onClick={handleClose}
          >
            ✕
          </button>
          <div className="absolute w-[357px] h-[617px] top-5 left-5">
            <div className="inline-flex flex-col items-start justify-center absolute top-0 left-0">
              <div className="relative w-full mt-[-1px] font-bold text-white text-5xl tracking-[0] leading-[normal] overflow-hidden text-ellipsis whitespace-nowrap text-left [font-family:'Poppins',Helvetica]">
                {ticketInfo.eventName}
              </div>

              <p className="relative w-fit [font-family:'Poppins',Helvetica] font-bold text-transparent text-xl text-center tracking-[0] leading-[normal]">
                <span className="text-white">TICKET </span>
                <span style={{ color: fillColor }}>1º LOTE</span>
              </p>
            </div>

            <div className="absolute w-[355px] h-[201px] top-32 left-0">
              <div className="flex w-[354px] items-start gap-[118px] absolute top-0 left-0">
                <div className="flex flex-col items-start gap-2.5 relative flex-1 grow">
                  <div
                    className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-base tracking-[0] leading-[normal]"
                    style={{ color: fillColor }}
                  >
                    Nome
                  </div>
                  <div
                    className="relative w-[123px] h-[30px] mr-[-36.17px] [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: ticketInfo.name.length > 15 ? '1rem' : '1.25rem' }}
                  >
                    {formatName(ticketInfo.name)}
                  </div>
                </div>

                <div className="flex flex-col w-[149px] items-start gap-2.5 relative">
                  <div
                    className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-base tracking-[0] leading-[normal]"
                    style={{ color: fillColor }}
                  >
                    CPF
                  </div>
                  <div
                    style={{
                      fontSize: ticketInfo.cpf.length > 15 ? '1rem' : '1.25rem',
                      whiteSpace: 'nowrap', // Evita quebra de linha
                      overflow: 'hidden', // Esconde texto excedente
                      textOverflow: 'ellipsis', // Adiciona "..." caso o texto seja muito longo
                    }}
                    className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal]"
                  >
                    {ticketInfo.cpf}
                  </div>
                </div>

              </div>

              <div className="flex w-[355px] items-center gap-[61px] absolute top-[65px] left-0">
                <div className="flex flex-col items-start gap-2.5 relative flex-1 grow">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-base tracking-[0] leading-[normal]"
                    style={{ color: fillColor }}>
                    Data
                  </div>
                  <div style={{ fontSize: ticketInfo.name.length > 15 ? '1rem' : '1.25rem' }} className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal]">
                    {formattedDate}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2.5 relative flex-1 grow">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-base tracking-[0] leading-[normal]"
                    style={{ color: fillColor }}>
                    Gênero
                  </div>
                  <div style={{ fontSize: ticketInfo.name.length > 15 ? '1rem' : '1.25rem' }} className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal]">
                    {formattedGender}
                  </div>
                </div>
              </div>

              <div className="flex w-[355px] items-center gap-[61px] absolute top-[131px] left-0">
                <div className="flex flex-col items-start gap-2.5 relative flex-1 grow">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-base tracking-[0] leading-[normal]"
                    style={{ color: fillColor }}>
                    Valor
                  </div>
                  <div style={{ fontSize: ticketInfo.name.length > 15 ? '1rem' : '1.25rem' }} className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal]">
                    {formattedTicketPrice}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2.5 relative flex-1 grow">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-base tracking-[0] leading-[normal]"
                    style={{ color: fillColor }}>
                    Lote
                  </div>
                  <div style={{ fontSize: ticketInfo.name.length > 15 ? '1rem' : '1.25rem' }} className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal]">
                    1º Lote
                  </div>
                </div>
              </div>
            </div>

            <img
              className="absolute w-[354px] h-0.5 top-[345px] left-0"
              alt="Divisor"
              src="https://c.animaapp.com/Ubf4OF4q/img/divisor.svg"
            />

            {ticketInfo.qrCodeUrl && (
              <div
                className="absolute top-[365px] left-[107px]"
                style={{
                  width: '249px',
                  height: '249px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >

                <div
                  style={{
                    width: '249px',
                    height: '249px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    position: 'absolute',
                    zIndex: 1,
                  }}
                ></div>
                <QRCodeCanvas
                  value={ticketInfo.qrCodeUrl}
                  size={220}
                  bgColor="transparent"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex w-[111px] h-[75px] items-center gap-2.5 p-2.5 absolute top-[461px] left-4 bg-[#1b2026] rounded-[20px_0px_0px_20px]">
            <p className="relative w-fit mt-[-9.35px] mb-[-7.35px] mr-[-4.61px] [font-family:'Poppins',Helvetica] font-semibold text-transparent text-base tracking-[0] leading-[normal]">
              <span className="text-white">
                Apresente <br />
                este{" "}
              </span>
              <span style={{ color: fillColor }}>
                ticket <br />
              </span>
              <span className="text-white">na entrada.</span>
            </p>
          </div>

          <button
            className="flex w-[173px] h-[33px] items-center justify-center gap-2.5 px-4 py-2.5 absolute top-[661px] left-[114px] bg-[#1b2026] rounded-[40px] transition duration-200 ease-in-out hover:bg-[#33323b] hover:shadow-lg active:bg-[#1a1a1f] cursor-pointer"
            onClick={captureAndSendEmail}
          >
            <span className="relative w-fit [font-family:'Poppins',Helvetica] font-semibold text-white text-[13px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
              Baixar ticket no celular
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
