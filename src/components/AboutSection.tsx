import React from 'react';
import { ExternalLink, Linkedin, Info, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AboutSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-8 p-4">
      {/* App Overview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2 transition-colors duration-300" 
             style={{ borderColor: isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}>
          <Info className={`w-5 h-5 ${isLight ? 'text-slate-900' : 'text-amber-400'}`} />
          <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            About ANIHWƐ
          </h2>
        </div>
        <p className={`text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          ANIHWƐ is a next-generation visual traffic intelligence platform. Leveraging state-of-the-art computer vision 
          models including YOLO26 and BoT-SORT, ANIHWƐ provides real-time monitoring of vehicle flow, 
          velocity vector analysis, and safety zone violation detection. Designed for researchers, 
          environmentalists, and urban planners to understand traffic patterns with zero-cost open-source infrastructure.
        </p>
      </section>

      {/* Founder's Note */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2 transition-colors duration-300"
             style={{ borderColor: isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}>
          <User className={`w-5 h-5 ${isLight ? 'text-slate-900' : 'text-amber-400'}`} />
          <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Founder's Note
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0">
            <img 
              src="https://res.cloudinary.com/dukipuswv/image/upload/v1792817521/WhatsApp_Image_2026-10-20_at_16.16.02_jxzyyg.jpg" 
              alt="Odum Kwesi Atopi" 
              className={`w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-lg border-2 ${
                isLight ? 'border-white' : 'border-slate-800'
              }`}
            />
          </div>
          
          <div className="flex-1 space-y-3">
            <p className={`text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Odum Kwesi Atopi</span> is a 
              Final Year Environmental Science Student at Kwame Nkrumah University of Science and Technology (KNUST). 
              A proud product of Ghana Secondary Technical School (GSTS), Kwesi bridges the gap between environmental monitoring 
              and advanced computer vision technology.
            </p>
            <p className={`text-xs italic ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              "Building tools that make environmental and urban safety data accessible to everyone."
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/kwesi-atopi-odum-a70a21366" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all active:translate-y-px ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                <img 
                  src="https://res.cloudinary.com/dukipuswv/image/upload/v1791985326/linkedin-app-icon_poqnvl.webp" 
                  alt="LinkedIn" 
                  className="w-4 h-4 object-contain"
                />
                LinkedIn
              </a>
              <a 
                href="https://www.odum.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold transition-all hover:bg-white hover:border-slate-300 hover:shadow-md active:translate-y-px"
              >
                <img 
                  src="https://res.cloudinary.com/dukipuswv/image/upload/v1793196390/b44f915b-e6e9-46ad-916e-48144591389b_om3up2.png" 
                  alt="Portfolio" 
                  className="w-4 h-4 rounded-full border border-slate-900/10"
                />
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
