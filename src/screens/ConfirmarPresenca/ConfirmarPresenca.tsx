import React, { JSX, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ModalConfirmar } from "../../components/ModalConfirmar";
import { ModalAntecipado } from "../../components/ModalAntecipado";
import { ModalTicket } from "../../components/ModalTicket";
import { ModalTicketAntecipado } from "../../components/ModalTicketAntecipado";
import { ModalPagamentoTicket } from "../../components/ModalPagamentoTicket";
import { API_URL } from "../../config";
import { Calendar, Music, ChevronRight } from 'lucide-react';

interface TicketInfo {
    qrCodeImage: string;
    name: string;
    cpf: string;
    gender: string;
    ticketPrice: string;
    eventName: string;
    qrCodeUrl: string;
}

export const ConfirmarPresenca = (): JSX.Element => {
    const { nomefantasia, token } = useParams<{ nomefantasia: string; token?: string }>();
    const [events, setEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [company, setCompany] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventName, setSelectedEventName] = useState('');
    const [selectedEventPriceWomen, setSelectedEventPriceWomen] = useState('');
    const [selectedEventPriceMen, setSelectedEventPriceMen] = useState('');
    const [isModalConfirmarOpen, setIsModalConfirmarOpen] = useState(false);
    const [isModalTicketOpen, setIsModalTicketOpen] = useState(false);
    const [selectedTicketInfo, setSelectedTicketInfo] = useState<any>({});
    const [selectedEventColor, setSelectedEventColor] = useState('');
    const [isModalAntecipadoOpen, setIsModalAntecipadoOpen] = useState(false);
    const [isModalPagamentoTicket, setIsModalPagamentoTicketOpen] = useState(false);
    const [isModalTicketAntecipadoOpen, setIsModalTicketAntecipadoOpen] = useState(false);

    const handleModalConfirmarOpen = (eventName: string, ticketPriceMen: string, ticketPriceWomen: string, eventColor: string) => {
        setIsModalConfirmarOpen(true);
        setSelectedEventName(eventName);
        setSelectedEventPriceMen(ticketPriceMen);
        setSelectedEventPriceWomen(ticketPriceWomen);
        setSelectedEventColor(eventColor);
    };

    const handleModalConfirmarClose = (data: { name: string, cpf: string, email: string; phone: string, gender: string, ticketPrice: string, qrCodeUrl?: string } | null) => {
        setIsModalConfirmarOpen(false);
        if (data) {
            setSelectedTicketInfo({
                ...data,
                eventName: selectedEventName,
                ticketPriceMen: selectedEventPriceMen,
                ticketPriceWomen: selectedEventPriceWomen,
                eventColor: selectedEventColor,
            });
            setIsModalTicketOpen(true);
        }
    };

    const handlePaymentApproved = (paymentInfo: TicketInfo) => {
        setIsModalPagamentoTicketOpen(false);
        setSelectedTicketInfo((prev: TicketInfo | null) => ({
            ...prev,
            qrCodeUrl: paymentInfo.qrCodeUrl,
            qrCodeImage: paymentInfo.qrCodeImage,
            name: paymentInfo.name,
            cpf: paymentInfo.cpf,
            gender: paymentInfo.gender,
            ticketPrice: paymentInfo.ticketPrice,
            eventName: paymentInfo.eventName,
        }));
        setIsModalTicketAntecipadoOpen(true);
    };

    const handleModalTicketAntecipadoClose = () => {
        setIsModalTicketAntecipadoOpen(false);
    };

    const handleModalAntecipadoOpen = (eventName: string, ticketPriceMen: string, ticketPriceWomen: string, eventColor: string) => {
        setIsModalAntecipadoOpen(true);
        setSelectedEventName(eventName);
        setSelectedEventPriceMen(ticketPriceMen);
        setSelectedEventPriceWomen(ticketPriceWomen);
        setSelectedEventColor(eventColor);
    };

    const handleModalAntecipadoClose = (data: { name: string, cpf: string, email: string; phone: string, gender: string, ticketPrice: string } | null) => {
        setIsModalAntecipadoOpen(false);
        if (data) {
            setSelectedTicketInfo({
                ...data,
                eventName: selectedEventName,
                ticketPriceMen: selectedEventPriceMen,
                ticketPriceWomen: selectedEventPriceWomen,
                eventColor: selectedEventColor,
            });
            setIsModalPagamentoTicketOpen(true);
        }
    };

    const handleModalPagamentoTicketClose = (shouldReopenAntecipado = false) => {
        setIsModalPagamentoTicketOpen(false);
        if (shouldReopenAntecipado) {
            setIsModalAntecipadoOpen(true);
        }
    };

    const handleModalTicketClose = () => {
        setIsModalTicketOpen(false);
    };

    useEffect(() => {
        const urlParams = window.location.pathname.split('/');
        const isInviteUrl = urlParams.includes('convite');
        const eventId = isInviteUrl ? urlParams[urlParams.length - 1] : null;

        const requestBody = isInviteUrl
            ? { event_id: eventId }
            : { fantasy_name: nomefantasia };

        if (nomefantasia || eventId) {
            fetch(`${API_URL}/api/list-events-by-fantasy-name`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        setError(data.message);
                    } else {
                        setEvents(data.events.slice(0, 2));
                        setCompany(data.company);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setError("Erro ao carregar eventos.");
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [nomefantasia]);


    return (
        <div
            className="relative w-full min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${company?.background_url ? `${API_URL}/api/${company.background_url}` : 'https://c.animaapp.com/Fr9I3Xv4/img/confirmar-presen-a.png'})`,
                backgroundColor: '#000000cf',
            }}
        >
            <div
                className="flex items-center justify-center min-h-screen w-full"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <div
                    className={`relative w-full h-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${company?.blur_effect === 'active' ? 'backdrop-blur-[15px]' : ''}`}
                >
                    <div className="grid gap-8 md:gap-10 grid-cols-1 w-full max-w-7xl mx-auto">
                        {events.slice(0, 2).map((event, index) => (
                            <div
                                key={index}
                                className="group transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Desktop Version */}
                                <div className="hidden lg:block relative w-full max-w-[824px] h-[374px] rounded-2xl overflow-hidden mx-auto bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                                    <div className="absolute inset-0">
                                        <div className="relative h-full flex">
                                            {/* Image Section */}
                                            <div className="relative flex-grow">
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent z-10" />
                                                <img
                                                    className="h-full w-full object-cover"
                                                    alt={event.event_name}
                                                    src={`${API_URL}/api/${event.event_image_url}`}
                                                    loading="lazy"
                                                />

                                                {/* Date Badge */}
                                                <div className="absolute left-6 top-6 flex items-center gap-3 z-20">
                                                    <div className="bg-white/90 backdrop-blur-sm p-1 rounded-2xl flex items-center gap-2 shadow-lg transition-transform group-hover:translate-y-1">
                                                        <div
                                                            className="rounded-xl p-3 w-16 text-center"
                                                            style={{ backgroundColor: event.event_color }}
                                                        >
                                                            <p className="text-xl font-bold leading-none">{new Date(event.event_date).getDate()}</p>
                                                            <p className="text-xs capitalize">{new Date(event.event_date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</p>
                                                        </div>
                                                        <div className="pr-4">
                                                            <Calendar className="w-4 h-4 mb-1 opacity-60" />
                                                            <p className="text-sm font-medium capitalize">
                                                                {new Date(event.event_date).toLocaleString('pt-BR', { weekday: 'short' }).replace('.', '')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-6 left-6 flex gap-4 z-20">
                                                    {event.guest_list === 'active' && (
                                                        <button
                                                            className="px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 hover:gap-3 group/btn"
                                                            style={{
                                                                backgroundColor: event.event_color,
                                                            }}
                                                            onClick={() => handleModalConfirmarOpen(
                                                                event.event_name,
                                                                event.ticket_price_men,
                                                                event.ticket_price_women,
                                                                event.event_color
                                                            )}
                                                        >
                                                            Nome na lista
                                                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                                        </button>
                                                    )}
                                                    {event.event_batch === 'active' && (
                                                        <button
                                                            className="px-6 py-3 bg-white backdrop-blur-sm rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 hover:gap-3 group/btn"
                                                            onClick={() => handleModalAntecipadoOpen(
                                                                event.event_name,
                                                                event.ticket_price_men,
                                                                event.ticket_price_women,
                                                                event.event_color
                                                            )}
                                                        >
                                                            Comprar antecipado
                                                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className="w-[300px] p-6 flex flex-col"
                                                style={{ backgroundColor: event.event_color }}
                                            >
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {event.category.split(",").map((cat: string, i: number) => (
                                                        <div key={i} className="px-3 py-1 text-xs bg-[#f3f4f6] backdrop-blur-sm rounded-full">
                                                            {cat.trim()}
                                                        </div>
                                                    ))}
                                                </div>

                                                <h2 className="text-2xl font-bold mb-6 text-center">
                                                    {event.event_name}
                                                </h2>

                                                {event.attractions && (
                                                    <div className="mb-6">
                                                        <div className="flex items-center gap-2 w-fit px-3 py-1 bg-[#f3f4f6] rounded-full text-sm mb-3 mx-auto">
                                                            <Music className="w-4 h-4" />
                                                            <span>Atrações</span>
                                                        </div>
                                                        <div className="bg-gray-900 backdrop-blur-sm rounded-xl p-4">
                                                            <div className="grid grid-cols-2 text-white gap-2 text-sm">
                                                                {event.attractions.split(',').map((attraction: string, index: number) => (
                                                                    <span key={index} className="truncate">{attraction.trim()}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-auto">
                                                    <div
                                                        style={{ border: '1px solid black' }}
                                                        className="flex items-center justify-between p-2 backdrop-blur-sm rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                className="w-[15.38px] h-[30.75px]"
                                                                alt="Mulher"
                                                                src="https://c.animaapp.com/Fr9I3Xv4/img/vector-7.svg"
                                                            />
                                                            <div>
                                                                <p className="text-xs opacity-80">Mulher</p>
                                                                <p className="text-lg font-bold">R$ {event.ticket_price_women}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-px h-10 bg-black"></div>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                className="w-[12.3px] h-[30.75px]"
                                                                alt="Homem"
                                                                src="https://c.animaapp.com/Fr9I3Xv4/img/vector-8.svg"
                                                            />
                                                            <div>
                                                                <p className="text-xs opacity-80">Homem</p>
                                                                <p className="text-lg font-bold">R$ {event.ticket_price_men}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="lg:hidden w-full max-w-[400px] mx-auto">
                                    <div
                                        className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                                        style={{ backgroundColor: event.event_color }}
                                    >
                                        <div className="relative h-[280px]">
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 z-10" />
                                            <img
                                                className="w-full h-full object-cover"
                                                alt={event.event_name}
                                                src={`${API_URL}/api/${event.event_image_url}`}
                                                loading="lazy"
                                            />
                                            <div className="absolute left-4 top-4 z-20">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 flex items-center gap-2 shadow-lg">
                                                    <div
                                                        className="rounded-xl p-2 w-14 h-14 flex flex-col items-center justify-center"
                                                        style={{ backgroundColor: event.event_color }}
                                                    >
                                                        <p className="text-lg font-bold leading-none">
                                                            {new Date(event.event_date).getDate()}
                                                        </p>
                                                        <p className="text-xs capitalize">
                                                            {new Date(event.event_date)
                                                                .toLocaleString('pt-BR', { month: 'short' })
                                                                .replace('.', '')}
                                                        </p>
                                                    </div>
                                                    <div className="pr-3 flex flex-col items-center">
                                                        <Calendar className="w-4 h-4 mb-1 opacity-60" />
                                                        <p className="text-sm font-medium capitalize">
                                                            {new Date(event.event_date)
                                                                .toLocaleString('pt-BR', { weekday: 'short' })
                                                                .replace('.', '')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {(() => {
                                                const numButtons =
                                                    (event.guest_list === 'active' ? 1 : 0) +
                                                    (event.event_batch === 'active' ? 1 : 0);
                                                const buttonWidthClass = numButtons === 2 ? 'w-[45%]' : 'w-[60%]';
                                                // Se houver dois botões, o espaço é menor, então reduzimos o tamanho da fonte.
                                                const buttonFontSizeClass = numButtons === 2 ? 'text-xs' : 'text-sm';
                                                return (
                                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                                        <div className="flex gap-3 justify-center">
                                                            {event.guest_list === 'active' && (
                                                                <button
                                                                    className={`${buttonWidthClass} ${buttonFontSizeClass} px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm hover:bg-white active:scale-98 whitespace-nowrap`}
                                                                    style={{ backgroundColor: event.event_color }}
                                                                    onClick={() =>
                                                                        handleModalConfirmarOpen(
                                                                            event.event_name,
                                                                            event.ticket_price_men,
                                                                            event.ticket_price_women,
                                                                            event.event_color
                                                                        )
                                                                    }
                                                                >
                                                                    Nome na lista
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {event.event_batch === 'active' && (
                                                                <button
                                                                    className={`${buttonWidthClass} ${buttonFontSizeClass} px-4 py-2 rounded-xl text-black font-bold transition-all duration-300 flex items-center justify-center bg-white gap-2 active:scale-98 whitespace-nowrap`}
                                                                    onClick={() =>
                                                                        handleModalAntecipadoOpen(
                                                                            event.event_name,
                                                                            event.ticket_price_men,
                                                                            event.ticket_price_women,
                                                                            event.event_color
                                                                        )
                                                                    }
                                                                >
                                                                    Comprar antecipado
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap gap-2 justify-start">
                                                    {event.category.split(",").map((cat: string, i: number) => (
                                                        <div key={i} className="px-3 py-1 text-xs bg-[#f3f4f6] backdrop-blur-sm rounded-full">
                                                            {cat.trim()}
                                                        </div>
                                                    ))}
                                                </div>
                                                <h2 className="text-2xl font-bold text-center">
                                                    {event.event_name}
                                                </h2>
                                            </div>
                                            {event.attractions && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 px-3 py-1 text-sm bg-[#f3f4f6] rounded-full w-fit mx-auto">
                                                        <Music className="w-4 h-4" />
                                                        <span>Atrações</span>
                                                    </div>
                                                    <div className="bg-gray-900 backdrop-blur-sm rounded-xl p-4">
                                                        <div className="grid grid-cols-2 text-white gap-3 text-sm">
                                                            {event.attractions.split(',').map((attraction: string, index: number) => (
                                                                <span key={index} className="truncate">
                                                                    {attraction.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                style={{ border: '1px solid black' }}
                                                className="flex items-center justify-between p-2 backdrop-blur-sm rounded-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-[15.38px] h-[30.75px]"
                                                        alt="Mulher"
                                                        src="https://c.animaapp.com/Fr9I3Xv4/img/vector-7.svg"
                                                    />
                                                    <div>
                                                        <p className="text-xs opacity-80">Mulher</p>
                                                        <p className="text-lg font-bold">R$ {event.ticket_price_women}</p>
                                                    </div>
                                                </div>
                                                <div className="w-px h-10 bg-black"></div>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-[12.3px] h-[30.75px]"
                                                        alt="Homem"
                                                        src="https://c.animaapp.com/Fr9I3Xv4/img/vector-8.svg"
                                                    />
                                                    <div>
                                                        <p className="text-xs opacity-80">Homem</p>
                                                        <p className="text-lg font-bold">R$ {event.ticket_price_men}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ModalConfirmar
                isOpen={isModalConfirmarOpen}
                onClose={handleModalConfirmarClose}
                eventName={selectedEventName}
                ticketPriceMen={selectedEventPriceMen}
                ticketPriceWomen={selectedEventPriceWomen}
                promoterToken={token}
                eventColor={selectedEventColor}
            />
            <ModalAntecipado
                isOpen={isModalAntecipadoOpen}
                onClose={handleModalAntecipadoClose}
                eventName={selectedEventName}
                ticketPriceMen={selectedEventPriceMen}
                ticketPriceWomen={selectedEventPriceWomen}
                promoterToken={token}
                eventColor={selectedEventColor}
            />
            <ModalPagamentoTicket
                isOpen={isModalPagamentoTicket}
                onClose={handleModalPagamentoTicketClose}
                ticketInfo={selectedTicketInfo}
                onPaymentApproved={handlePaymentApproved}
            />
            <ModalTicket
                isOpen={isModalTicketOpen}
                onClose={handleModalTicketClose}
                ticketInfo={selectedTicketInfo}
            />
            <ModalTicketAntecipado
                isOpen={isModalTicketAntecipadoOpen}
                onClose={handleModalTicketAntecipadoClose}
                ticketInfo={selectedTicketInfo}
            />
        </div>
    );
};

export default ConfirmarPresenca;