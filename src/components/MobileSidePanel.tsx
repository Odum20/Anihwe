import React, { useEffect } from 'react';
import { X, Terminal, LayoutDashboard, Map, Info, ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TrafficSignIcon } from './TrafficSignIcon';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'landing' | 'dashboard' | 'zones' | 'playground';
  setActiveView: (view: 'landing' | 'dashboard' | 'zones' | 'playground') => void;
  onOpenPythonScript: () => void;
  onOpenAbout: () => void;
}

export const MobileSidePanel: React.FC<MobileSidePanelProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  onOpenPythonScript,
  onOpenAbout,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Prevent scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[85%] max-w-[320px] shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isLight 
            ? 'bg-slate-50 shadow-[5px_0_25px_rgba(0,0,0,0.1)] border-r border-slate-200' 
            : 'bg-slate-900 shadow-[5px_0_25px_rgba(0,0,0,0.5)] border-r border-slate-800'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 flex items-center justify-between border-b ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/50'
          }`}>
            <button 
              onClick={() => {
                setActiveView('landing');
                onClose();
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <TrafficSignIcon scale={0.34} />
              <div className="flex flex-col">
                <span className={`text-lg font-black tracking-tighter uppercase ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  ANIHWƐ
                </span>
                <span className={`text-[9px] font-bold tracking-wider uppercase opacity-50 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Computer Vision OS
                </span>
              </div>
            </button>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => {
                setActiveView('landing');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                activeView === 'landing'
                  ? isLight 
                    ? 'bg-[#3d3e40] text-white shadow-lg' 
                    : 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : isLight
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                <span className="font-bold">Home Overview</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                activeView === 'landing' ? 'opacity-50' : 'opacity-20'
              }`} />
            </button>

            <button
              onClick={() => {
                setActiveView('dashboard');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                activeView === 'dashboard'
                  ? isLight 
                    ? 'bg-[#3d3e40] text-white shadow-lg' 
                    : 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : isLight
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-bold">Detection HUD</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                activeView === 'dashboard' ? 'opacity-50' : 'opacity-20'
              }`} />
            </button>

            <button
              onClick={() => {
                setActiveView('zones');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                activeView === 'zones'
                  ? isLight 
                    ? 'bg-[#3d3e40] text-white shadow-lg' 
                    : 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : isLight
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5" />
                <span className="font-bold">Dynamic Zones</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                activeView === 'zones' ? 'opacity-50' : 'opacity-20'
              }`} />
            </button>

            <button
              onClick={() => {
                setActiveView('playground');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                activeView === 'playground'
                  ? isLight 
                    ? 'bg-[#3d3e40] text-white shadow-lg' 
                    : 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : isLight
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5" />
                <span className="font-bold">Playground</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                activeView === 'playground' ? 'opacity-50' : 'opacity-20'
              }`} />
            </button>

            <button
              onClick={() => {
                onOpenPythonScript();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5" />
                <span className="font-bold">YOLO26 Script</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                onOpenAbout();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5" />
                <span className="font-bold">About ANIHWƐ & Founder</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20 transition-transform group-hover:translate-x-1" />
            </button>
          </nav>

          {/* Footer */}
          <div className={`p-6 text-center border-t space-y-3 flex flex-col items-center ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/50'
          }`}>
            <PWAInstallButton className="w-full justify-center" />
            <p className={`text-[10px] font-bold tracking-widest uppercase opacity-40 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              ANIHWƐ Vision OS v1.0.4
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
