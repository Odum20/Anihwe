import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TrafficSignIcon } from './TrafficSignIcon';

interface AppFooterProps {
  onOpenAbout: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onOpenAbout }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer className={`border-t transition-colors duration-300 mt-auto py-5 px-4 lg:px-8 ${
      isLight 
        ? 'bg-slate-50/90 border-slate-200 text-slate-700' 
        : 'bg-slate-900/90 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
        {/* Left: Logo & Brand Name */}
        <div className="flex items-center gap-2.5">
          <TrafficSignIcon scale={0.28} />
          <span className={`text-base font-black tracking-tighter uppercase ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            ANIHWƐ
          </span>
          <span className="opacity-30">•</span>
          <button
            onClick={onOpenAbout}
            className={`inline-flex items-center gap-1.5 font-bold transition-all underline underline-offset-4 cursor-pointer ${
              isLight ? 'text-slate-800 hover:text-slate-950' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About & Founder Note</span>
          </button>
        </div>

        {/* Right: Copyright & Research Note */}
        <div className="flex items-center gap-4 text-[11px] opacity-60">
          <p>© {new Date().getFullYear()} ANIHWƐ Computer Vision.</p>
          <span className="hidden sm:inline">•</span>
          <p className="hidden sm:inline">Designed in Ghana</p>
        </div>
      </div>
    </footer>
  );
};
