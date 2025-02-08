import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Zap, 
  Crown, 
  Check,
  ArrowRight,
  Star,
  Shield,
  Rocket
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalPlanoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalPlano = ({ isOpen, onClose }: ModalPlanoProps): JSX.Element | null => {
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
                <Crown className="w-6 h-6 text-[#E1FF01]" />
              </div>
              <div>
                <h2 className="text-[#E1FF01] text-xl font-bold">
                  Plano Expirado
                </h2>
                <p className="text-gray-400 text-sm">
                  Renove agora e continue aproveitando
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
            {/* Alert Message */}
            <div className="bg-[#E1FF01]/5 rounded-xl p-4 border border-[#E1FF01]/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E1FF01]/10 rounded-lg">
                  <Zap className="w-5 h-5 text-[#E1FF01]" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    Mantenha seu acesso ativo
                  </p>
                  <p className="text-gray-400 text-sm">
                    Renove sua assinatura para continuar gerenciando seus eventos com todas as funcionalidades premium.
                  </p>
                </div>
              </div>
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