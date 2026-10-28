import React, { useState } from 'react';
import { X, AlertTriangle, Copy, CheckCircle, Shield } from 'lucide-react';
import { IncidentAlert } from '../types/traffic';
import { useTheme } from '../context/ThemeContext';

interface IncidentDetailModalProps {
  incident: IncidentAlert | null;
  onClose: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [copied, setCopied] = useState<boolean>(false);

  if (!incident) return null;

  const handleCopy = () => {
    const text = `YOLO26 & BoT-SORT INCIDENT DOSSIER
ID: ${incident.id}
Timestamp: ${incident.timestamp}
Video Offset: ${incident.videoTimeSec}s
Infraction: ${incident.type}
Severity: ${incident.severity}
Vehicle: ${incident.vehicleClass.toUpperCase()} #${incident.vehicleId}
Speed: ${incident.speedKmh} km/h
Zone: ${incident.zone}
Details: ${incident.details}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardClasses = `p-2.5 rounded-xl border shadow-xs transition-colors duration-300 ${
    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
  }`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in transition-colors duration-300 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col border transition-all duration-300 ${
        isLight 
          ? 'bg-slate-50 border-slate-300 shadow-[0_20px_40px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
          isLight ? 'border-slate-200/90 bg-slate-100/70' : 'border-slate-800 bg-slate-950/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border shadow-xs ${
              isLight ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Detection Incident #{incident.id}</h3>
              <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {incident.zone} · Video Offset: {incident.videoTimeSec}s
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60' : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div className={cardClasses}>
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Infraction Type</span>
              <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{incident.type.replace(/_/g, ' ')}</span>
            </div>
            <div className={cardClasses}>
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Severity Level</span>
              <span className={`font-bold mt-0.5 block ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{incident.severity}</span>
            </div>
            <div className={cardClasses}>
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Tracked Vehicle</span>
              <span className={`font-bold capitalize mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {incident.vehicleClass} #{incident.vehicleId}
              </span>
            </div>
            <div className={cardClasses}>
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Optical Velocity</span>
              <span className={`font-bold font-mono tabular-nums mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {typeof incident.speedKmh === 'number' ? incident.speedKmh.toFixed(1) : incident.speedKmh} km/h
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border shadow-xs transition-colors duration-300 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <span className={`font-bold block mb-1 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Details & Trajectory Context</span>
            <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>{incident.details}</p>
          </div>

          <div className={`p-3 rounded-xl border flex items-start gap-2 transition-colors duration-300 ${
            isLight ? 'bg-amber-50 border-amber-200 text-slate-700' : 'bg-amber-900/10 border-amber-900/30 text-slate-300'
          }`}>
            <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            <div>
              <span className={`font-bold block ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>BoT-SORT Tracking Provenance</span>
              <span className={`text-[11px] block mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Target motion path verified across safety polygon. Spatial centroid and displacement vector logged.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3.5 border-t flex items-center justify-between transition-colors duration-300 ${
          isLight ? 'border-slate-200 bg-slate-100/60' : 'border-slate-800 bg-slate-950/40'
        }`}>
          <button
            onClick={handleCopy}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-px ${
              isLight
                ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_4px_rgba(251,191,36,0.2)]'
            }`}
          >
            {copied ? <CheckCircle className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-400' : 'text-slate-900'}`} /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
          </button>

          <button
            onClick={onClose}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer active:translate-y-px border ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
