import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Menu } from "../../components/Menu";
import { Zap, BarChart, Shield, Clock, Rocket, Check, Users } from 'lucide-react';
import { FaArrowRightLong } from "react-icons/fa6";
import CountUp from "react-countup";

export const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      <Menu />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#E1FF01]/10 mb-8"
          >
            <Zap className="w-6 h-6 text-[#E1FF01]" />
            <span className="text-[#E1FF01] font-medium text-lg">Plataforma N°1 em Gestão de Eventos</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transforme Seus Eventos com
            <br />
            <span className="text-[#E1FF01]">Tecnologia Inteligente</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-xl max-w-3xl mx-auto mb-10"
          >
            Controle total, segurança de nível bancário e insights poderosos para eventos extraordinários
          </motion.p>

          <div className="flex justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-[#E1FF01] text-gray-900 rounded-xl 
                       font-semibold hover:bg-[#cde600] transition-all duration-300"
            >
              <span>Começar Agora</span>
              <FaArrowRightLong className="text-xl" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold
                       border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Ver Demonstração
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {[
            { value: 25000, label: "Eventos Criados", suffix: "+" },
            { value: 98, label: "Satisfação", suffix: "%" },
            { value: 500, label: "Clientes Ativos", suffix: "+" },
            { value: 100, label: "Disponibilidade", suffix: "%" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-[#E1FF01]/30"
            >
              <div className="text-[#E1FF01] text-3xl font-bold mb-2">
                <CountUp
                  end={stat.value}
                  duration={3}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por Que Escolher a
              <span className="text-[#E1FF01]"> Lista.Vip</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Tecnologia avançada combinada com experiência em gestão de eventos de grande escala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Segurança Enterprise",
                description: "Criptografia AES-256 e certificação PCI DSS para transações seguras"
              },
              {
                icon: BarChart,
                title: "Analytics em Tempo Real",
                description: "Dashboard inteligente com métricas atualizadas a cada 15 segundos"
              },
              {
                icon: Clock,
                title: "Suporte 24/7",
                description: "Equipe especialista disponível a qualquer momento"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-3xl bg-gray-800/30 border-2 border-gray-700 hover:border-[#E1FF01]/50"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="p-4 bg-[#E1FF01]/10 rounded-2xl">
                    <item.icon className="w-8 h-8 text-[#E1FF01]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Dashboard */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl border-2 border-[#E1FF01]/20 bg-gray-800 p-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#E1FF01]/5 animate-pulse"></div>
            <img
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              className="w-full h-auto rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-900 rounded-3xl p-12 border-2 border-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E1FF01]/5 to-transparent opacity-20"></div>
            
            <Zap className="w-16 h-16 text-[#E1FF01] mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para Revolucionar Seus Eventos?
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Comece agora mesmo e experimente a plataforma que está transformando a gestão de 
              eventos no Brasil
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#E1FF01] text-gray-900 rounded-xl font-semibold
                         flex items-center gap-3 hover:bg-[#cde600] transition-colors"
              >
                <span>Começar Agora</span>
                <FaArrowRightLong />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold
                         border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                Agendar Demonstração
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};