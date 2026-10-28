import React from 'react';
import { Play, Terminal, Shield, Cpu, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingHeroProps {
  onExploreDashboard: () => void;
  onExplorePlayground: () => void;
  onOpenAbout: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreDashboard,
  onExplorePlayground,
  onOpenAbout,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden py-6 lg:py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Icon Watermark & Glow Effects */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div 
          className={`absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-20 transition-all duration-700 ${
            isLight 
              ? 'bg-gradient-to-tr from-slate-400 via-amber-200 to-slate-500' 
              : 'bg-gradient-to-tr from-amber-500 via-amber-300 to-sky-600'
          }`} 
        />

        {/* Large Logo Backdrop Image */}
        <div className="relative opacity-[0.08] lg:opacity-[0.12] scale-125 lg:scale-150 transition-transform duration-1000 transform hover:scale-130">
          <img 
            src="https://res.cloudinary.com/dukipuswv/image/upload/v1793198289/vizzy_tqgjgz.png" 
            alt="ANIHWƐ Background Motif" 
            className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] object-contain filter drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Hero Central Card */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto">
        
        {/* Brand Name Money Statement & Subtext directly beneath */}
        <div className="space-y-2">
          {/* Broad, Money Brand Title */}
          <h1 className={`text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-none select-none drop-shadow-sm ${
            isLight 
              ? 'text-slate-900 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950' 
              : 'text-white bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-amber-200'
          }`}>
            ANIHWƐ
          </h1>

          {/* Evolved Subtext directly under the ANIHWƐ name */}
          <p className={`text-xs sm:text-sm lg:text-base font-extrabold tracking-[0.25em] uppercase transition-colors ${
            isLight ? 'text-[#3d3e40]' : 'text-amber-400'
          }`}>
            NEXT-GEN COMPUTER VISION & SPATIAL INTELLIGENCE
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-xl mx-auto">
          {/* Button 1: Explore Traffic Vision Analysis */}
          <button
            onClick={onExploreDashboard}
            className={`w-full sm:w-auto px-6 py-4 rounded-xl font-extrabold text-sm tracking-wide shadow-xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group ${
              isLight
                ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-slate-900/10 hover:shadow-slate-900/20'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 hover:shadow-amber-400/30'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Explore Traffic Vision Analysis</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Button 2: Explore PLAYGROUND */}
          <button
            onClick={onExplorePlayground}
            className={`w-full sm:w-auto px-6 py-4 rounded-xl font-extrabold text-sm tracking-wide border shadow-md flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group backdrop-blur-md ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 hover:border-slate-400'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-100 hover:border-amber-400/50'
            }`}
          >
            <Terminal className={`w-5 h-5 ${isLight ? 'text-slate-700' : 'text-amber-400'}`} />
            <span>Explore PLAYGROUND</span>
            <Sparkles className={`w-4 h-4 opacity-70 transition-transform group-hover:rotate-12 ${isLight ? 'text-slate-700' : 'text-amber-400'}`} />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto text-left">
          <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
            isLight ? 'bg-white/80 border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className={`w-4 h-4 ${isLight ? 'text-slate-900' : 'text-amber-400'}`} />
              <h3 className={`text-xs font-extrabold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                In-Browser BoT-SORT
              </h3>
            </div>
            <p className={`text-xs font-medium leading-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Real-time velocity tracking, trajectory prediction & ID persistence directly on client MP4 streams.
            </p>
          </div>

          <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
            isLight ? 'bg-white/80 border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`w-4 h-4 ${isLight ? 'text-slate-900' : 'text-amber-400'}`} />
              <h3 className={`text-xs font-extrabold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Dynamic Safety Gates
              </h3>
            </div>
            <p className={`text-xs font-medium leading-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Interactive ROI line calibration, stop-line compliance checks, and live infraction logs.
            </p>
          </div>

          <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
            isLight ? 'bg-white/80 border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className={`w-4 h-4 ${isLight ? 'text-slate-900' : 'text-amber-400'}`} />
              <h3 className={`text-xs font-extrabold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                AI Vision Playground
              </h3>
            </div>
            <p className={`text-xs font-medium leading-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Upload custom video streams and submit NL prompts for OpenRouter-powered grid analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
