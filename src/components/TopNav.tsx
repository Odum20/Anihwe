import React from 'react';
import { Terminal, Sun, Moon, Info, LayoutDashboard, Sparkles, Home } from 'lucide-react';
import { TrafficSignIcon } from './TrafficSignIcon';
import { PWAInstallButton } from './PWAInstallButton';
import { useTheme } from '../context/ThemeContext';

interface TopNavProps {
  activeView: 'landing' | 'dashboard' | 'zones' | 'playground';
  setActiveView: (view: 'landing' | 'dashboard' | 'zones' | 'playground') => void;
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
    <header className={`flex items-center justify-between gap-4 lg:gap-8 px-4 lg:px-6 py-3 border-b backdrop-blur-md shrink-0 transition-colors duration-300 z-50 sticky top-0 ${
      isLight 
        ? 'bg-slate-50/95 border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]' 
        : 'bg-slate-900/95 border-slate-800 shadow-lg'
    }`}>
      {/* Zone 1: Wordmark & Logo Trigger (Navigates to Landing) */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={onOpenMobileMenu}
          className={`lg:hidden p-1 rounded-lg transition-all active:scale-95 flex items-center justify-center ${
            isLight ? 'hover:bg-slate-200/50 text-slate-900' : 'hover:bg-slate-800 text-white'
          }`}
          title="Open Side Menu"
        >
          <TrafficSignIcon scale={0.34} />
        </button>

        <button 
          onClick={() => setActiveView('landing')}
          className="hidden lg:flex items-center gap-2 text-left cursor-pointer group"
          title="Return to ANIHWƐ Overview"
        >
          <div className="transition-transform group-hover:scale-105">
            <TrafficSignIcon scale={0.38} />
          </div>
          
          <div className="flex flex-col">
            <span className={`text-base lg:text-lg font-black tracking-tighter uppercase whitespace-nowrap transition-colors ${
              isLight ? 'text-slate-900 group-hover:text-slate-700' : 'text-white group-hover:text-amber-400'
            }`}>
              ANIHWƐ
            </span>
            <span className={`text-[10px] font-bold tracking-widest uppercase opacity-50 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Computer Vision Intelligence
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className={`hidden lg:flex items-center gap-6 text-sm font-medium ${
        isLight ? 'text-slate-600' : 'text-slate-400'
      }`}>
        <button
          onClick={() => setActiveView('landing')}
          className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
            activeView === 'landing'
              ? isLight ? 'text-slate-950 border-b-2 border-[#3d3e40] font-bold' : 'text-amber-400 border-b-2 border-amber-400 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

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

      {/* Zone 3: Primary Action, PWA Install & Theme Toggle */}
      <div className="flex items-center gap-2.5 shrink-0">
        <PWAInstallButton variant="compact" />

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
          className={`hidden lg:flex px-3.5 py-2 text-xs font-bold tracking-tight whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer rounded-lg transition-all duration-150 active:translate-y-px ${
            activeView === 'playground'
              ? isLight
                ? 'bg-[#2b2c2e] text-white shadow-xl ring-2 ring-slate-400'
                : 'bg-amber-300 text-slate-950 shadow-xl ring-2 ring-amber-400'
              : isLight
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
