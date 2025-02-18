import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedEvent {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  category: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: 1,
    title: "Lollapalooza Brasil 2024",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
    date: "22-24 Março",
    location: "São Paulo, SP",
    category: "Festival"
  },
  {
    id: 2,
    title: "Web Summit Rio 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
    date: "15-18 Abril",
    location: "Rio de Janeiro, RJ",
    category: "Tecnologia"
  },
  {
    id: 3,
    title: "CCXP 2024",
    image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&q=80",
    date: "5-8 Dezembro",
    location: "São Paulo, SP",
    category: "Cultura Pop"
  },
  {
    id: 4,
    title: "Festival Gastronômico",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80",
    date: "10-12 Maio",
    location: "Curitiba, PR",
    category: "Gastronomia"
  },
  {
    id: 5,
    title: "Rock in Rio 2024",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80",
    date: "13-15 Setembro",
    location: "Rio de Janeiro, RJ",
    category: "Festival"
  },
  {
    id: 6,
    title: "TechConf Brasil",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
    date: "20-22 Julho",
    location: "São Paulo, SP",
    category: "Tecnologia"
  },
  {
    id: 7,
    title: "Festival de Jazz",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
    date: "10-12 Agosto",
    location: "Belo Horizonte, MG",
    category: "Música"
  }
];

export const FeaturedEvents = () => {
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const duplicatedEvents = [...featuredEvents, ...featuredEvents];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(4);
      else if (width < 1024) setItemsPerPage(6);
      else setItemsPerPage(8);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated background gradient */}
      
      {/* Diagonal lines background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, #E1FF01 1px, transparent 1px), linear-gradient(-45deg, #E1FF01 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">

          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white tracking-tight">
            Eventos em{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#E1FF01] font-extrabold">Destaque</span>
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Descubra os eventos mais aguardados gerenciados por nossa plataforma
          </p>
        </div>
s
        {/* Events Carousel */}
        <div className="relative overflow-hidden py-8">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10" />

          <div className="flex gap-5 carousel"
               style={{
                 width: '200%',
                 transform: 'translateZ(0)'
               }}>
            {duplicatedEvents.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="relative flex-shrink-0 transition-all duration-500 group"
                style={{
                  width: `calc(${100 / itemsPerPage}% - 20px)`,
                  minWidth: '280px'
                }}
              >
                <div 
                  className="relative h-[320px] rounded-2xl overflow-hidden cursor-pointer
                           transform transition-all duration-500 group-hover:scale-[1.02]
                           shadow-lg shadow-black/30"
                  onClick={() => setActiveEventId(activeEventId === event.id ? null : event.id)}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-4 py-2 bg-[#E1FF01] text-gray-900 rounded-full text-xs font-bold
                                   shadow-lg shadow-black/20 backdrop-blur-sm tracking-wide
                                   transform transition-transform duration-300 group-hover:scale-105">
                      {event.category}
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className={`absolute inset-0 flex flex-col justify-end p-8 transition-all duration-500
                    ${activeEventId === event.id ? 'bg-black/80 backdrop-blur-sm' : 'hover:bg-black/60'}`}>
                    <div className={`transform transition-all duration-500
                      ${activeEventId === event.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`}>
                      <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-col gap-3 text-gray-200 mb-6">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-5 h-5 text-[#E1FF01]" strokeWidth={1.5} />
                          <span className="text-sm font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-5 h-5 text-[#E1FF01]" strokeWidth={1.5} />
                          <span className="text-sm font-medium">{event.location}</span>
                        </div>
                      </div>

                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#E1FF01] text-gray-900 
                                       rounded-xl font-bold text-sm tracking-wide
                                       transform transition-all duration-300 group-hover:scale-105
                                       hover:bg-white hover:shadow-lg hover:shadow-[#E1FF01]/20">
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 
                                             group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .carousel {
          animation: scroll 15s linear infinite;
          will-change: transform;
        }

        @media (max-width: 640px) {
          .carousel {
            animation: scroll 20s linear infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .carousel {
            animation-duration: 35s;
          }
          @media (max-width: 640px) {
            .carousel {
              animation-duration: 30s;
            }
          }
        }
      `}</style>
    </section>
  );
};