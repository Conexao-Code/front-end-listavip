import React, { useState } from 'react';
import { Menu } from '../../components/Menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, Mail, Phone, Check, AlertCircle, MapPin, ArrowRight, MessageSquare } from 'lucide-react';
import InputMask from 'react-input-mask';

export const Contato = (): JSX.Element => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMessage(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setFeedbackMessage('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    // Simulating API call
    setTimeout(() => {
      setFeedbackMessage('Mensagem enviada com sucesso! Um atendente entrará em contato em breve.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const faqItems = [
    {
      question: 'O que é a Lista.Vip?',
      answer: 'Uma plataforma completa para gestão de eventos e vendas de ingressos com tecnologia de ponta e segurança enterprise.'
    },
    {
      question: 'Como entrar em contato com o suporte?',
      answer: 'Nosso suporte 24h está disponível via chat na plataforma, e-mail suporte@lista.vip ou WhatsApp +55 15 99187-5600'
    },
    {
      question: 'A plataforma é segura?',
      answer: 'Utilizamos criptografia AES-256 e certificação PCI DSS para garantir máxima segurança em todas as transações.'
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
              <span className="text-[#E1FF01] font-medium">Suporte Premium 24/7</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-white bg-gradient-to-r from-white via-white to-gray-400">
              Estamos Aqui para <span className="text-[#E1FF01]">Ajudar</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Nossa equipe de especialistas está pronta para tirar suas dúvidas e
              oferecer soluções personalizadas para seu evento
            </p>
          </motion.div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-lg shadow-black/20"
            >
              <div className="space-y-8">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-[#E1FF01]/30 transition-all duration-300"
                >
                  <div className="p-3 bg-[#E1FF01]/10 rounded-xl">
                    <Mail className="w-6 h-6 text-[#E1FF01]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">E-mail</h3>
                    <p className="text-gray-400">contato@lista.vip</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-[#E1FF01]/30 transition-all duration-300"
                >
                  <div className="p-3 bg-[#E1FF01]/10 rounded-xl">
                    <Phone className="w-6 h-6 text-[#E1FF01]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Telefone</h3>
                    <p className="text-gray-400">+55 (15) 99187-5600</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-[#E1FF01]/30 transition-all duration-300"
                >
                  <div className="p-3 bg-[#E1FF01]/10 rounded-xl">
                    <MapPin className="w-6 h-6 text-[#E1FF01]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Escritório</h3>
                    <p className="text-gray-400">Sorocaba/SP - Brasil</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 p-8 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-lg shadow-black/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-300 text-sm font-medium">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white transition-all duration-300 placeholder-gray-500"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-300 text-sm font-medium">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white transition-all duration-300 placeholder-gray-500"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-300 text-sm font-medium">
                    Telefone
                  </label>
                  <InputMask
                    mask="(99) 99999-9999"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  >
                    {(inputProps: any) => (
                      <input
                        {...inputProps}
                        type="tel"
                        className="w-full px-4 py-3 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white transition-all duration-300 placeholder-gray-500"
                        placeholder="(00) 00000-0000"
                        required
                      />
                    )}
                  </InputMask>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-gray-300 text-sm font-medium">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-[#E1FF01] focus:ring-2 focus:ring-[#E1FF01]/20 text-white transition-all duration-300 placeholder-gray-500"
                    placeholder="Como podemos ajudar?"
                    required
                  />
                </div>

                {feedbackMessage && (
                  <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${feedbackMessage.includes('sucesso')
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {feedbackMessage.includes('sucesso') ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                      </motion.div>
                      <p className="text-sm">{feedbackMessage}</p>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`md:col-span-2 relative w-full py-4 rounded-lg font-semibold transition-all duration-300 
                    ${loading
                      ? 'bg-gray-700 text-transparent cursor-wait'
                      : 'bg-[#E1FF01] text-gray-900 hover:bg-[#cde600]'
                    }`}
                  type="submit"
                  disabled={loading}
                >
                  <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <MessageSquare className="w-5 h-5" />
                    Enviar Mensagem
                  </span>

                  {loading && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="relative">
                        {/* Círculo externo girando */}
                        <motion.div
                          className="w-6 h-6 border-2 border-[#E1FF01] border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Círculo interno pulsando */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-[#E1FF01] rounded-full" />
                        </motion.div>
                      </div>
                      <motion.span
                        className="ml-3 text-[#E1FF01]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Enviando...
                      </motion.span>
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Perguntas <span className="text-[#E1FF01]">Frequentes</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Encontre respostas rápidas para as dúvidas mais comuns sobre nossa plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
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
                  className="p-6 bg-gray-800 rounded-xl border border-gray-700/50 shadow-lg shadow-black/20 transition-all duration-300 group-hover:border-[#E1FF01]/30"
                >
                  <button
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h3 className="text-white text-lg font-medium text-left">
                      {item.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-full bg-[#E1FF01]/10 text-[#E1FF01] group-hover:bg-[#E1FF01]/20"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-400 pt-4 mt-4 border-t border-gray-700/50">
                          {item.answer}
                        </p>
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#E1FF01]/5 to-transparent" />
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative inline-block mb-8"
            >
              <Zap className="w-16 h-16 text-[#E1FF01]" />
            </motion.div>
            <h2 className="relative text-4xl md:text-5xl font-bold mb-8">
              Pronto para Transformar Seus <span className="text-[#E1FF01]">Eventos</span>?
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center gap-3 px-8 py-4 bg-[#E1FF01] text-gray-900 rounded-xl font-semibold hover:bg-[#cde600] transition-all duration-300"
              onClick={() => window.location.href = '/planos'}
            >
              <span>Ver Planos Premium</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}