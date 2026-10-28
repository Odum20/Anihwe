import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AboutSection } from './AboutSection';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 border ${
        isLight 
          ? 'bg-white border-slate-200' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-slate-900/50'
        }`}>
          <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            APPLICATION INTELLIGENCE
          </h2>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-2">
          <AboutSection />
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 text-right border-t ${
          isLight ? 'border-slate-100 bg-slate-50/30' : 'border-slate-800 bg-slate-900/30'
        }`}>
          <button 
            onClick={onClose}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all active:scale-95 ${
              isLight 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md' 
                : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/10'
            }`}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
