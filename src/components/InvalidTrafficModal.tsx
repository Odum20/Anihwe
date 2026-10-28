import React from 'react';
import { AlertOctagon, X, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface InvalidTrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  fileName?: string;
  onReupload: () => void;
}

export const InvalidTrafficModal: React.FC<InvalidTrafficModalProps> = ({
  isOpen,
  onClose,
  reason,
  fileName,
  onReupload,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in transition-colors duration-300 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col border transition-all duration-300 ${
        isLight 
          ? 'bg-slate-50 border-slate-300 shadow-[0_20px_40px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Header with warning accent */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
          isLight ? 'border-rose-200/80 bg-rose-50/90' : 'border-rose-900/50 bg-rose-950/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border shadow-xs ${
              isLight ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Invalid Traffic MP4</h3>
              <p className={`text-xs font-medium ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>Uploaded file is foreign to vision function</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-rose-100/60' : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className={`p-4 space-y-3.5 text-xs transition-colors duration-300 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          <div className={`p-3 rounded-xl border shadow-xs space-y-1.5 transition-colors duration-300 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className={`flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="font-medium">File Inspected:</span>
              <span className={`font-mono font-bold truncate max-w-[200px] ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                {fileName || 'uploaded_video.mp4'}
              </span>
            </div>
            <div className={`text-[11px] leading-relaxed font-mono ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>
              {reason || 'The uploaded media does not contain valid vehicular roadway traffic, traffic signals, or junction geometry required for YOLO26 & BoT-SORT analysis.'}
            </div>
          </div>

          <div className={`space-y-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span className={`font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Accepted Video Specifications:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>CCTV or dashcam recording of vehicular intersections or roadways</li>
              <li>Multi-lane highway, roundabout, or junction traffic flows</li>
              <li>MP4 / WebM format with clear optical visibility of vehicles</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3.5 border-t flex items-center justify-between gap-2 transition-colors duration-300 ${
          isLight ? 'border-slate-200 bg-slate-100/60' : 'border-slate-800 bg-slate-950/40'
        }`}>
          <button
            onClick={onClose}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer active:translate-y-px border ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Dismiss
          </button>

          <button
            onClick={onReupload}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-px ${
              isLight
                ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.95)]'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_4px_rgba(251,191,36,0.2)]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Select Valid Traffic MP4</span>
          </button>
        </div>
      </div>
    </div>
  );
};
