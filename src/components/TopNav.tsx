import React from 'react';
import { Terminal, Sun, Moon, Info } from 'lucide-react';
import { TrafficSignIcon } from './TrafficSignIcon';
import { useTheme } from '../context/ThemeContext';

interface TopNavProps {
  activeView: 'dashboard' | 'zones' | 'playground';
  setActiveView: (view: 'dashboard' | 'zones' | 'playground') => void;
  onOpenPythonScript: () => void;
  onOpenAbout: () => void;
  onOpenMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  setActiveView,
  onOpenPythonScript,
  onOpenAbout,
  onOpenMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <header className={`flex items-center justify-between gap-8 px-4 md:px-6 py-3 border-b backdrop-blur-md shrink-0 transition-colors duration-300 z-50 sticky top-0 ${
      isLight 
        ? 'bg-slate-50/95 border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]' 
        : 'bg-slate-900/95 border-slate-800 shadow-lg'
    }`}>
      {/* Zone 1: Wordmark & Mobile Trigger */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={onOpenMobileMenu}
          className={`md:hidden p-1 rounded-lg transition-all active:scale-95 flex items-center justify-center ${
            isLight ? 'hover:bg-slate-200/50 text-slate-900' : 'hover:bg-slate-800 text-white'
          }`}
          title="Open Side Menu"
        >
          <TrafficSignIcon scale={0.34} />
        </button>

        <div className="hidden md:block">
          <TrafficSignIcon scale={0.38} />
        </div>
        
        <div className="flex flex-col">
          <span className={`text-base md:text-lg font-black tracking-tighter uppercase whitespace-nowrap ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            VIZZY
          </span>
          <span className={`hidden md:block text-[10px] font-bold tracking-widest uppercase opacity-50 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Computer Vision Intelligence
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${
        isLight ? 'text-slate-600' : 'text-slate-400'
      }`}>
        <button
          onClick={() => setActiveView('dashboard')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeView === 'dashboard'
              ? isLight ? 'text-slate-950 border-b-2 border-[#3d3e40] font-bold' : 'text-amber-400 border-b-2 border-amber-400 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          Video Detection HUD
        </button>
        <button
          onClick={() => setActiveView('zones')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeView === 'zones'
              ? isLight ? 'text-slate-950 border-b-2 border-[#3d3e40] font-bold' : 'text-amber-400 border-b-2 border-amber-400 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dynamic Zones
        </button>
        <button
          onClick={onOpenPythonScript}
          className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
            isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className={`w-3.5 h-3.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
          <span>Script Hub</span>
        </button>
        <button
          onClick={onOpenAbout}
          className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
            isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Info className={`w-3.5 h-3.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
          <span>About</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action & Theme Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200 cursor-pointer border shadow-xs ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setActiveView('playground')}
          className={`hidden md:flex px-3.5 py-2 text-xs font-bold tracking-tight whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer rounded-lg transition-all duration-150 active:translate-y-px ${
            isLight
              ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-lg'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>PLAYGROUND</span>
        </button>
      </div>
    </header>
  );
};
