import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Zap, 
  Lock,
  ArrowRight,
  Sparkles,
  BarChart,
  Shield,
  Users
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalLogin = ({ isOpen, onClose }: ModalLoginProps): JSX.Element | null => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    navigate('/planos');
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const features = [
    {
      icon: BarChart,
      title: "Dashboard Completo",
      description: "Análises e métricas em tempo real"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Proteção avançada de dados"
    },
    {
      icon: Users,
      title: "Multiusuários",
      description: "Gerencie toda sua equipe"
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <ToastContainer />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg"
      >
        <div className="relative flex flex-col w-full bg-[#1A202C] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E1FF01]/10 rounded-lg">
                <Lock className="w-6 h-6 text-[#E1FF01]" />
              </div>
              <div>
                <h2 className="text-[#E1FF01] text-xl font-bold">
                  Acesso Restrito
                </h2>
                <p className="text-gray-400 text-sm">
                  Desbloqueie recursos exclusivos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Welcome Message */}
            <div className="bg-[#E1FF01]/5 rounded-xl p-4 border border-[#E1FF01]/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E1FF01]/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#E1FF01]" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    Falta pouco para você ter acesso completo!
                  </p>
                  <p className="text-gray-400 text-sm">
                    Assine um de nossos planos exclusivos e aproveite todos os recursos premium.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                >
                  <div className="p-2 bg-[#E1FF01]/10 rounded-lg">
                    <feature.icon className="w-5 h-5 text-[#E1FF01]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                  <Zap className="w-5 h-5 text-[#E1FF01] ml-auto" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
            >
              Depois
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewPlans}
              className="flex-1 px-6 py-3 rounded-lg bg-[#E1FF01] text-gray-900 hover:bg-[#E1FF01]/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>Ver Planos</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
