import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

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
  }
];

export const FeaturedEvents = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const totalPages = Math.ceil(featuredEvents.length / itemsPerPage.desktop);

  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getVisibleEvents = () => {
    const start = currentPage * itemsPerPage.desktop;
    const end = start + itemsPerPage.desktop;
    return featuredEvents.slice(start, end);
  };

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900/90 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#E1FF01]/10 mb-8 hover:bg-[#E1FF01]/20 transition-colors duration-300"
          >
            <span className="text-[#E1FF01] font-medium">Eventos Imperdíveis</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Eventos em <span className="text-[#E1FF01]">Destaque</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Descubra os eventos mais aguardados gerenciados por nossa plataforma
          </p>
        </motion.div>

        <div className="relative">
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              initial={false}
              animate={{
                x: `calc(-${currentPage * 100}% - ${currentPage * 24}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {featuredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer">
                    {/* Background overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 opacity-60 group-hover:opacity-80 transition-all duration-500 z-10" />
                    
                    {/* Event image */}
                    <img
                      src={event.image}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Event category badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-4 py-2 bg-[#E1FF01] text-gray-900 rounded-full text-sm font-semibold">
                        {event.category}
                      </span>
                    </div>

                    {/* Event details */}
                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#E1FF01] transition-colors duration-300">
                          {event.title}
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row gap-3 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#E1FF01]" />
                            <span>{event.date}</span>
                          </div>
                          <div className="hidden sm:block text-[#E1FF01]">•</div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#E1FF01]" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Call to action button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 px-6 py-2 bg-[#E1FF01] text-gray-900 rounded-lg font-semibold 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200
                                   hover:bg-[#cde600] transition-colors"
                        >
                          Ver Detalhes
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-4 mx-auto">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentPage ? 1 : -1);
                    setCurrentPage(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === index
                      ? 'bg-[#E1FF01] scale-125'
                      : 'bg-[#E1FF01]/30 hover:bg-[#E1FF01]/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Arrow buttons */}
          <button
            onClick={prevPage}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-12 h-12 rounded-full bg-[#E1FF01] text-gray-900 flex items-center justify-center
                     opacity-70 hover:opacity-100 transition-opacity transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-12 h-12 rounded-full bg-[#E1FF01] text-gray-900 flex items-center justify-center
                     opacity-70 hover:opacity-100 transition-opacity transform hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};