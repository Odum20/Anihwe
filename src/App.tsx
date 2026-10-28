import React, { useState, useCallback, useRef } from 'react';
import { TopNav } from './components/TopNav';
import { JunctionVideoViewport } from './components/JunctionVideoViewport';
import { TelemetryCards } from './components/TelemetryCards';
import { ViolationsFeed } from './components/ViolationsFeed';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { PythonScriptModal } from './components/PythonScriptModal';
import { DetectionZonesView } from './components/DetectionZonesView';
import { InvalidTrafficModal } from './components/InvalidTrafficModal';
import { AboutModal } from './components/AboutModal';
import { MobileSidePanel } from './components/MobileSidePanel';
import { PlaygroundView } from './components/PlaygroundView';
import { ChevronRight } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import {
  IncidentAlert,
  SafetyZone,
  VideoTelemetry,
} from './types/traffic';

export default function App() {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<'dashboard' | 'zones' | 'playground'>('dashboard');
  const [isPythonScriptOpen, setIsPythonScriptOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentAlert | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Invalid Traffic Video Modal State
  const [isInvalidModalOpen, setIsInvalidModalOpen] = useState<boolean>(false);
  const [invalidReason, setInvalidReason] = useState<string>('');
  const [invalidFileName, setInvalidFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic Safety Zones (calibratable across any MP4)
  const [zones, setZones] = useState<SafetyZone[]>([
    {
      id: 'ZONE-01',
      name: 'Stop Line Gate',
      type: 'STOP_LINE',
      color: '#ef4444',
      x1: 0.25,
      y1: 0.62,
      x2: 0.75,
      y2: 0.62,
    },
    {
      id: 'ZONE-02',
      name: 'Solid Lane Divider',
      type: 'SOLID_LINE',
      color: '#38bdf8',
      x1: 0.50,
      y1: 0.35,
      x2: 0.50,
      y2: 0.68,
    },
    {
      id: 'ZONE-03',
      name: 'Central Conflict Area',
      type: 'CONFLICT_BOX',
      color: '#eab308',
      x1: 0.32,
      y1: 0.48,
      x2: 0.68,
      y2: 0.76,
    },
  ]);

  // Video Telemetry State
  const [telemetry, setTelemetry] = useState<VideoTelemetry>({
    videoFileName: 'traffic_feed.mp4',
    videoDurationSec: 0,
    currentTimeSec: 0,
    activeTracksCount: 0,
    totalUniqueTracked: 0,
    flowRatePerMin: 0,
    averageSpeedKmh: 0,
    totalViolations: 0,
    fps: 30,
  });

  // Recorded Incident Alerts
  const [incidents, setIncidents] = useState<IncidentAlert[]>([]);

  const handleIncidentDetected = useCallback((incident: IncidentAlert) => {
    setIncidents((prev) => {
      if (prev.some((i) => i.id === incident.id)) return prev;
      return [incident, ...prev];
    });
    setTelemetry((prev) => ({
      ...prev,
      totalViolations: prev.totalViolations + 1,
    }));
  }, []);

  const handleTelemetryUpdate = useCallback((partial: Partial<VideoTelemetry>) => {
    setTelemetry((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const handleClearIncidents = () => {
    setIncidents([]);
    setTelemetry((prev) => ({
      ...prev,
      totalViolations: 0,
    }));
  };

  const handleInvalidTrafficVideo = useCallback((reason: string, fileName: string) => {
    setInvalidReason(reason);
    setInvalidFileName(fileName);
    setIsInvalidModalOpen(true);
  }, []);

  const handleReupload = () => {
    setIsInvalidModalOpen(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 150);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-100/90 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Navigation */}
      <TopNav
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenPythonScript={() => setIsPythonScriptOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Poking Chevron for Mobile */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className={`lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-[55] w-6 h-16 flex items-center justify-center rounded-r-xl shadow-lg border-y border-r transition-all active:scale-95 ${
          theme === 'light' 
            ? 'bg-[#3d3e40] border-[#4d4e50] text-white shadow-slate-400/20' 
            : 'bg-amber-400 border-amber-500 text-slate-950 shadow-amber-400/20'
        } ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Open Side Panel"
      >
        <ChevronRight className="w-5 h-5 -ml-1 animate-pulse" />
      </button>

      {/* Mobile Side Panel */}
      <MobileSidePanel
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenPythonScript={() => setIsPythonScriptOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full space-y-4">
        {activeView === 'dashboard' && (
          <>
            {/* 4-Card Telemetry Bar */}
            <TelemetryCards telemetry={telemetry} />

            {/* Split Grid: HTML5 Video Viewport (8 cols) & Infractions Feed (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left / Center: Video Viewport & In-Browser CV Engine */}
              <div className="lg:col-span-8 flex flex-col">
                <JunctionVideoViewport
                  onIncidentDetected={handleIncidentDetected}
                  onTelemetryUpdate={handleTelemetryUpdate}
                  zones={zones}
                  onOpenScriptHub={() => setIsPythonScriptOpen(true)}
                  onInvalidTrafficVideo={handleInvalidTrafficVideo}
                  fileInputRef={fileInputRef}
                />
              </div>

              {/* Right Column: Live Infractions Feed */}
              <div className="lg:col-span-4 flex flex-col">
                <ViolationsFeed
                  incidents={incidents}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  onClear={handleClearIncidents}
                />
              </div>
            </div>
          </>
        )}

        {activeView === 'zones' && (
          <DetectionZonesView zones={zones} setZones={setZones} />
        )}

        {activeView === 'playground' && (
          <PlaygroundView />
        )}
      </main>

      {/* Modals */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

      <InvalidTrafficModal
        isOpen={isInvalidModalOpen}
        onClose={() => setIsInvalidModalOpen(false)}
        reason={invalidReason}
        fileName={invalidFileName}
        onReupload={handleReupload}
      />

      <PythonScriptModal
        isOpen={isPythonScriptOpen}
        onClose={() => setIsPythonScriptOpen(false)}
        videoFileName={telemetry.videoFileName}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
