import React from 'react';
import { Car, Activity, Gauge, AlertTriangle } from 'lucide-react';
import { VideoTelemetry } from '../types/traffic';
import { useTheme } from '../context/ThemeContext';

interface TelemetryCardsProps {
  telemetry: VideoTelemetry;
}

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({ telemetry }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const cardBaseClasses = `p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] ${
    isLight 
      ? 'bg-slate-50 border-slate-200/90 shadow-[0_2px_5px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-md' 
      : 'bg-slate-900 border-slate-800 shadow-lg hover:border-slate-700'
  }`;

  const labelClasses = `text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`;
  const valueClasses = `text-2xl font-extrabold font-mono tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`;
  const subtextClasses = `text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Tracked Vehicles */}
      <div className={cardBaseClasses}>
        <div className="flex items-center justify-between">
          <span className={labelClasses}>Tracked Vehicles</span>
          <Car className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-amber-400'}`} />
        </div>
        <div className="mt-2.5">
          <div className={valueClasses}>
            {telemetry.totalUniqueTracked.toLocaleString()}
          </div>
          <div className={subtextClasses}>
            <span className={`${isLight ? 'text-emerald-600' : 'text-emerald-400'} font-mono font-semibold`}>{telemetry.activeTracksCount}</span> active in frame
          </div>
        </div>
      </div>

      {/* 2. Flow Rate */}
      <div className={cardBaseClasses}>
        <div className="flex items-center justify-between">
          <span className={labelClasses}>Flow Rate</span>
          <Activity className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-amber-400'}`} />
        </div>
        <div className="mt-2.5">
          <div className={valueClasses}>
            {telemetry.flowRatePerMin}
            <span className="text-xs font-normal text-slate-500 ml-1">veh/min</span>
          </div>
          <div className={subtextClasses}>
            Throughput velocity
          </div>
        </div>
      </div>

      {/* 3. Average Speed */}
      <div className={cardBaseClasses}>
        <div className="flex items-center justify-between">
          <span className={labelClasses}>Mean Velocity</span>
          <Gauge className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-amber-400'}`} />
        </div>
        <div className="mt-2.5">
          <div className={valueClasses}>
            {typeof telemetry.averageSpeedKmh === 'number' ? telemetry.averageSpeedKmh.toFixed(1) : '0.0'}
            <span className="text-xs font-normal text-slate-500 ml-1">km/h</span>
          </div>
          <div className={subtextClasses}>
            Calibrated optical displacement
          </div>
        </div>
      </div>

      {/* 4. Safety Infractions */}
      <div className={cardBaseClasses}>
        <div className="flex items-center justify-between">
          <span className={labelClasses}>Safety Infractions</span>
          <AlertTriangle className={`w-3.5 h-3.5 ${isLight ? 'text-amber-500' : 'text-amber-400'}`} />
        </div>
        <div className="mt-2.5">
          <div className={`text-2xl font-extrabold font-mono tabular-nums ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
            {telemetry.totalViolations}
          </div>
          <div className={subtextClasses}>
            Zone violations flagged
          </div>
        </div>
      </div>
    </div>
  );
};
