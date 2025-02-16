import React, { useState, useRef } from 'react';
import { Menu } from '../../components/Menu';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Zap, BarChart, Shield, Ticket, DollarSign, Calendar, Clock, Rocket, Check, Users, Award,
  LayoutDashboard, BadgeCheck, CloudLightning, Terminal, Star,
  Globe, CreditCard, Server, Lock, ArrowRight, Trophy
} from 'lucide-react';
import { FeaturedEvents } from '../../components/FeaturedEvents/FeaturedEvents';
import CountUp from 'react-countup';

export const PaginaPrincipal = (): JSX.Element => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  const handleVerPrecosClick = () => window.location.href = '/planos';
  const handleFaleConoscoClick = () => window.open('https://wa.me/5515991875600', '_blank');

  const stats = [
    { id: 1, title: "Eventos gerenciados", value: 25000, suffix: "+", description: "Eventos de sucesso em todo Brasil" },
    { id: 2, title: "Satisfação", value: 98, suffix: "%", description: "Clientes satisfeitos com nosso serviço" },
    { id: 3, title: "Clientes Ativos", value: 500, suffix: "+", description: "Empresas confiam em nossa solução" },
    { id: 4, title: "Disponibilidade", value: 100, suffix: "%", description: "Uptime garantido por SLA" },
  ];

  const timelineItems = [
    {
      year: "2020",
      title: "Fundação",
      description: "Nascimento da plataforma com foco em inovação",
      icon: Rocket,
      achievements: [
        "Lançamento da versão beta",
        "Primeiros 100 clientes",
        "Investimento seed"
      ]
    },
    {
      year: "2021",
      title: "Expansão Nacional",
      description: "Crescimento exponencial e reconhecimento do mercado",
      icon: Trophy,
      achievements: [
        "Presente em 15 estados",
        "1000+ eventos realizados",
        "Prêmio Inovação 2021"
      ]
    },
    {
      year: "2022",
      title: "Tecnologia Enterprise",
      description: "Evolução para soluções corporativas",
      icon: Shield,
      achievements: [
        "Certificação ISO 27001",
        "Integração com ERPs",
        "Lançamento white label"
      ]
    },
    {
      year: "2023",
      title: "Liderança de Mercado",
      description: "Consolidação como líder do setor",
      icon: Award,
      achievements: [
        "Market share de 45%",
        "20.000+ eventos",
        "Series A funding"
      ]
    },
    {
      year: "2024",
      title: "Inovação Contínua",
      description: "Novas tecnologias e recursos avançados",
      icon: Star,
      achievements: [
        "IA predictiva",
        "Blockchain tickets",
        "App mobile 2.0"
      ]
    }
  ];

  const features = [
    {
      title: "Dashboard Inteligente",
      icon: BarChart,
      description: "Controle completo do seu evento em tempo real com análises preditivas e insights acionáveis.",
      benefits: [
        "Métricas em tempo real",
        "Análise preditiva de vendas",
        "Relatórios personalizáveis",
        "Integração com BI"
      ]
    },
    {
      title: "Gestão Multicanal",
      icon: Users,
      description: "Integração perfeita com as principais plataformas de vendas e redes sociais.",
      benefits: [
        "Integração com redes sociais",
        "API robusta e documentada",
        "Gestão centralizada",
        "Automação de processos"
      ]
    },
    {
      title: "Segurança Enterprise",
      icon: Shield,
      description: "Sistema robusto de proteção contra fraudes e certificação PCI DSS.",
      benefits: [
        "Certificação PCI DSS",
        "Proteção contra fraudes",
        "Criptografia de ponta",
        "Backups automáticos"
      ]
    }
  ];

  const cases = [
    {
      title: "Rock in Rio 2023",
      description: "Gestão completa de mais de 500 mil ingressos",
      stats: "100% digital, 0% fraudes",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80"
    },
    {
      title: "ExpoTech 2024",
      description: "Sistema integrado para 200 expositores",
      stats: "98% satisfação dos participantes",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80"
    },
    {
      title: "Festival Gastronômico SP",
      description: "Controle de acesso para 50 restaurantes",
      stats: "45% aumento em vendas",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Menu />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#E1FF01]/10 mb-8 hover:bg-[#E1FF01]/20 transition-colors duration-300"
            >
              <Zap className="w-6 h-6 text-[#E1FF01]" />
              <span className="text-[#E1FF01] font-medium">Plataforma N°1 em Gestão de Eventos</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-white bg-gradient-to-r from-white via-white to-gray-400">
              Revolução Digital na <br />
              <span className="text-[#E1FF01]">Gestão de Eventos</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              Sistema completo com controle total de ingressos, participantes e
              análise preditiva de resultados
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerPrecosClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E1FF01] text-gray-900 rounded-xl font-semibold hover:bg-[#cde600] transition-all duration-300"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFaleConoscoClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700/80 transition-all duration-300"
              >
                Agendar Demonstração
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: stat.id * 0.1 }}
                onHoverStart={() => setHoveredStat(stat.id)}
                onHoverEnd={() => setHoveredStat(null)}
                className="relative p-8 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-lg shadow-black/20 overflow-hidden group"
              >
                <motion.div
                  animate={{
                    y: hoveredStat === stat.id ? -20 : 0,
                    opacity: hoveredStat === stat.id ? 0 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-[#E1FF01] text-4xl font-bold mb-2">
                    <CountUp
                      end={stat.value}
                      duration={3}
                      suffix={stat.suffix}
                    />
                  </h3>
                  <p className="text-gray-300 text-lg">{stat.title}</p>
                </motion.div>

                <motion.div
                  className="absolute inset-0 p-8 bg-gray-800 flex items-center justify-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    y: hoveredStat === stat.id ? 0 : 20,
                    opacity: hoveredStat === stat.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-300">{stat.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <FeaturedEvents />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tecnologia que <span className="text-[#E1FF01]">Impulsiona</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Conheça as ferramentas poderosas que vão transformar sua gestão de eventos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="h-full p-8 bg-gray-800 rounded-xl border border-gray-700/50 shadow-lg shadow-black/20 transition-all duration-300 cursor-pointer group-hover:border-[#E1FF01]/30"
                  onClick={() => setOpenFeature(openFeature === index ? null : index)}
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className="p-4 bg-[#E1FF01]/10 rounded-xl">
                      <feature.icon className="w-8 h-8 text-[#E1FF01]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>

                  <p className="text-gray-400 mb-6">{feature.description}</p>

                  <AnimatePresence>
                    {openFeature === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-3">
                          {feature.benefits.map((benefit, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-3 text-gray-300"
                            >
                              <Check className="w-5 h-5 text-[#E1FF01]" />
                              <span>{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 rounded-3xl p-12 border border-gray-700/50 shadow-lg shadow-black/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#E1FF01]/5 to-transparent pointer-events-none" />
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative inline-block mb-8"
            >
              <Zap className="w-16 h-16 text-[#E1FF01]" />
            </motion.div>
            <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
              Transforme Seus <span className="text-[#E1FF01]">Eventos</span>
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Experimente gratuitamente por 7 dias ou agende uma demonstração personalizada
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerPrecosClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E1FF01] text-gray-900 rounded-xl font-semibold hover:bg-[#cde600] transition-all duration-300"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFaleConoscoClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700/80 transition-all duration-300"
              >
                Falar com Especialista
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}