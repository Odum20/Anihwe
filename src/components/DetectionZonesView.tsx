import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';
import { SafetyZone } from '../types/traffic';
import { useTheme } from '../context/ThemeContext';

interface DetectionZonesViewProps {
  zones: SafetyZone[];
  setZones: React.Dispatch<React.SetStateAction<SafetyZone[]>>;
}

export const DetectionZonesView: React.FC<DetectionZonesViewProps> = ({
  zones,
  setZones,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const updateZoneCoord = (id: string, field: 'x1' | 'y1' | 'x2' | 'y2', val: number) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, [field]: val } : z))
    );
  };

  const cardClasses = `rounded-xl border transition-all duration-300 p-4 space-y-3 ${
    isLight 
      ? 'bg-slate-50 border-slate-200/90 shadow-[0_2px_5px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.95)]' 
      : 'bg-slate-900 border-slate-800 shadow-lg'
  }`;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className={cardClasses}>
        <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Layers className={`w-5 h-5 ${isLight ? 'text-slate-700' : 'text-amber-400'}`} />
          <span>Dynamic Safety Zones & Optical Calibration</span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Calibrate detection thresholds and boundaries dynamically for your uploaded traffic MP4 video.
        </p>
      </div>

      {/* Zones Calibration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {zones.map((zone) => (
          <div key={zone.id} className={cardClasses}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {zone.id} · {zone.type}
              </span>
              <span className={`text-xs font-semibold flex items-center gap-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </span>
            </div>

            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{zone.name}</h3>

            {/* Coordinate sliders */}
            {zone.type === 'STOP_LINE' && (
              <div className={`space-y-2 pt-2 border-t text-xs ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div>
                  <div className={`flex justify-between mb-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>Vertical Position (Y Gate)</span>
                    <span className={`font-mono font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{Math.round(zone.y1 * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.02"
                    value={zone.y1}
                    onChange={(e) => updateZoneCoord(zone.id, 'y1', parseFloat(e.target.value))}
                    className={`w-full cursor-pointer transition-all ${isLight ? 'accent-[#3d3e40]' : 'accent-amber-400'}`}
                  />
                </div>
              </div>
            )}

            {zone.type === 'SOLID_LINE' && (
              <div className={`space-y-2 pt-2 border-t text-xs ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div>
                  <div className={`flex justify-between mb-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>Horizontal Position (X Line)</span>
                    <span className={`font-mono font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{Math.round(zone.x1 * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.02"
                    value={zone.x1}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      updateZoneCoord(zone.id, 'x1', v);
                      updateZoneCoord(zone.id, 'x2', v);
                    }}
                    className={`w-full cursor-pointer transition-all ${isLight ? 'accent-[#3d3e40]' : 'accent-amber-400'}`}
                  />
                </div>
              </div>
            )}

            {zone.type === 'CONFLICT_BOX' && (
              <div className={`space-y-2 pt-2 border-t text-xs ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div>
                  <div className={`flex justify-between mb-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>Box Width</span>
                    <span className={`font-mono font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{Math.round((zone.x2 - zone.x1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.8"
                    step="0.05"
                    value={zone.x2 - zone.x1}
                    onChange={(e) => {
                      const span = parseFloat(e.target.value);
                      updateZoneCoord(zone.id, 'x2', Math.min(0.95, zone.x1 + span));
                    }}
                    className={`w-full cursor-pointer transition-all ${isLight ? 'accent-[#3d3e40]' : 'accent-amber-400'}`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
