import React from 'react';
import { ShieldAlert, Download, Eye, AlertOctagon, AlertTriangle, Trash2 } from 'lucide-react';
import { IncidentAlert } from '../types/traffic';
import { useTheme } from '../context/ThemeContext';

interface ViolationsFeedProps {
  incidents: IncidentAlert[];
  onSelectIncident: (incident: IncidentAlert) => void;
  onClear: () => void;
}

export const ViolationsFeed: React.FC<ViolationsFeedProps> = ({
  incidents,
  onSelectIncident,
  onClear,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const exportCsv = () => {
    if (incidents.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Video_Sec', 'Type', 'Severity', 'Vehicle_ID', 'Vehicle_Class', 'Speed_Kmh', 'Zone', 'Details'];
    const rows = incidents.map((i) => [
      i.id,
      i.timestamp,
      i.videoTimeSec,
      i.type,
      i.severity,
      i.vehicleId,
      i.vehicleClass,
      i.speedKmh,
      `"${i.zone}"`,
      `"${i.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cv_safety_incidents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatVideoTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300 flex flex-col h-full overflow-hidden ${
      isLight 
        ? 'bg-slate-50 border-slate-200/90 shadow-[0_2px_5px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.95)]' 
        : 'bg-slate-900 border-slate-800 shadow-lg'
    }`}>
      {/* Header */}
      <div className={`p-3.5 border-b flex items-center justify-between ${
        isLight ? 'border-slate-200/80 bg-slate-100/50' : 'border-slate-800 bg-slate-950/40'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${isLight ? 'text-amber-500' : 'text-amber-400'}`} />
          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Live Infractions Log</h3>
          <span className={`text-xs font-mono tabular-nums ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            ({incidents.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={exportCsv}
            disabled={incidents.length === 0}
            className={`px-2 sm:px-2.5 py-1 text-xs rounded-lg font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-px disabled:opacity-50 ${
              isLight
                ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_4px_rgba(251,191,36,0.2)]'
            }`}
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={onClear}
            disabled={incidents.length === 0}
            className={`p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
              isLight ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'
            }`}
            title="Clear list"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[420px] p-2 space-y-2">
        {incidents.length === 0 ? (
          <div className={`p-8 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            No infractions detected in current playback. Real-time vision tracker monitoring safety zones.
          </div>
        ) : (
          incidents.map((incident, index) => {
            const isCritical = incident.severity === 'CRITICAL';
            return (
              <div
                key={`${incident.id}-${index}`}
                className={`p-2.5 rounded-lg border shadow-xs transition-all flex items-start justify-between gap-3 ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 border-slate-200/90' 
                    : 'bg-slate-950 hover:bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg mt-0.5 border ${
                      isCritical
                        ? isLight ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : isLight ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {isCritical ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{incident.id}</span>
                      <span className="text-slate-300">·</span>
                      <span
                        className={`font-semibold uppercase text-[11px] ${
                          isCritical ? isLight ? 'text-rose-600' : 'text-rose-400' : isLight ? 'text-amber-600' : 'text-amber-400'
                        }`}
                      >
                        {incident.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className={`font-mono text-[11px] font-semibold ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>@{formatVideoTime(incident.videoTimeSec)}</span>
                    </div>

                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{incident.details}</p>

                    <div className="flex items-center gap-2 text-[11px] mt-1 font-mono">
                      <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Target: <strong className={`capitalize font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{incident.vehicleClass} #{incident.vehicleId}</strong></span>
                      <span className="text-slate-300">·</span>
                      <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Speed: <strong className={`tabular-nums ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{typeof incident.speedKmh === 'number' ? incident.speedKmh.toFixed(1) : incident.speedKmh} km/h</strong></span>
                      <span className="text-slate-300">·</span>
                      <span className={`truncate max-w-[140px] font-sans ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{incident.zone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectIncident(incident)}
                  className={`p-1.5 rounded-lg border shadow-xs transition-colors cursor-pointer self-center active:translate-y-px ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="View Incident Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
