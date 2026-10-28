import React, { useState, useRef } from 'react';
import { Upload, Terminal, Send, AlertCircle, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PlaygroundView: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [command, setCommand] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionLogs, setVisionLogs] = useState<{ id: string; type: 'info' | 'success' | 'error'; message: string; timestamp: string }[]>([]);
  
  // Error state for "smooth language" popups
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; type: 'invalid_video' | 'task_impossible'; title: string; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showError('invalid_video');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      addLog('info', `Video loaded: ${file.name}`);
    }
  };

  const showError = (type: 'invalid_video' | 'task_impossible') => {
    if (type === 'invalid_video') {
      setErrorModal({
        isOpen: true,
        type: 'invalid_video',
        title: 'Input Integrity Notice',
        message: 'The visual data provided appears to be fragmented or in a format Vizzy cannot synthesize. Please ensure you upload a high-fidelity MP4 to maintain logical coherence.'
      });
    } else {
      setErrorModal({
        isOpen: true,
        type: 'task_impossible',
        title: 'Cognitive Mismatch',
        message: 'The command issued does not correlate with the visual context detected. Vizzy cannot "count cattle" in a high-density urban traffic corridor. Please align your intent with the scene.'
      });
    }
  };

  const addLog = (type: 'info' | 'success' | 'error', message: string) => {
    setVisionLogs(prev => [
      { id: Math.random().toString(36).substr(2, 9), type, message, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 49)
    ]);
  };

  const handleExecute = async () => {
    if (!videoFile) {
      addLog('error', 'Execution halted: No visual context provided.');
      return;
    }
    if (!command.trim()) {
      addLog('error', 'Execution halted: Intelligence directive missing.');
      return;
    }

    setIsAnalyzing(true);
    addLog('info', `Initializing universal vision engine for: "${command}"`);

    // Simulated Analysis Bridge
    setTimeout(() => {
      // Logic for mismatched tasks (simulated)
      const isTrafficVideo = videoFile.name.toLowerCase().includes('traffic') || videoFile.name.toLowerCase().includes('car');
      const isCattleCommand = command.toLowerCase().includes('cattle') || command.toLowerCase().includes('cow');

      if (isTrafficVideo && isCattleCommand) {
        setIsAnalyzing(false);
        showError('task_impossible');
        addLog('error', 'Intelligence mismatch detected. Aborting sequence.');
        return;
      }

      // Success Path
      setIsAnalyzing(false);
      addLog('success', `Directives integrated. Detection grid re-aligned for ${command}.`);
      addLog('success', 'Streaming universal vision telemetry...');
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Explainer */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className={`text-2xl font-black tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>
              VISION PLAYGROUND
            </h1>
            <p className={`text-sm font-medium opacity-60 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              The Universal Interface: Upload any context, issue any command.
            </p>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold border ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>POWERED BY UNIVERSAL VISION OS</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Zone */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Port */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${
              videoPreview 
                ? 'border-transparent' 
                : isLight 
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-white' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
            }`}
          >
            {videoPreview ? (
              <>
                <video src={videoPreview} className="w-full h-full object-cover rounded-xl" autoPlay loop muted playsInline />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-white font-bold text-xs border border-white/20">
                    CHANGE SOURCE
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-transform group-hover:-translate-y-1 ${
                  isLight ? 'bg-white text-slate-400 shadow-md' : 'bg-slate-800 text-slate-500 shadow-xl'
                }`}>
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className={`font-black text-lg tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    INITIATE VISUAL UPLOAD
                  </p>
                  <p className={`text-xs font-bold opacity-40 mt-1 uppercase tracking-widest ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Drag context here or click to browse
                  </p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
          </div>

          {/* Command Directive */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <label className={`text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Intelligence Directive
            </label>
            <div className="relative group">
              <input 
                type="text" 
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g., 'Analyze customer density at the registers' or 'Monitor sheep flow'..."
                className={`w-full pl-4 pr-14 py-4 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none focus:ring-4 ${
                  isLight 
                    ? 'bg-slate-50 border-slate-100 focus:border-[#3d3e40] focus:ring-slate-200 placeholder-slate-400 text-slate-900' 
                    : 'bg-slate-800 border-slate-800 focus:border-amber-400 focus:ring-amber-400/20 placeholder-slate-500 text-white'
                }`}
              />
              <button 
                onClick={handleExecute}
                disabled={isAnalyzing}
                className={`absolute right-2 top-2 bottom-2 px-4 rounded-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 ${
                  isLight ? 'bg-[#3d3e40] text-white hover:bg-black' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                }`}
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Vision Logs */}
        <div className="lg:col-span-5 flex flex-col h-[500px] lg:h-auto min-h-[400px]">
          <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-slate-900/50'
            }`}>
              <div className="flex items-center gap-2">
                <Terminal className={`w-4 h-4 ${isLight ? 'text-slate-900' : 'text-amber-400'}`} />
                <h2 className={`text-xs font-black tracking-widest uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Vision Logic Logs
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Live Stream</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-3">
              {visionLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-8">
                  <Terminal className="w-12 h-12 mb-4" />
                  <p className="font-bold">AWAITING DIRECTIVES</p>
                </div>
              ) : (
                visionLogs.map(log => (
                  <div key={log.id} className="flex gap-3 animate-in slide-in-from-left duration-300">
                    <span className="opacity-30 shrink-0">[{log.timestamp}]</span>
                    <div className={
                      log.type === 'success' ? 'text-emerald-500' : 
                      log.type === 'error' ? 'text-rose-500' : 
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }>
                      <span className="font-bold uppercase mr-1">[{log.type}]</span>
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Language Error Modal */}
      {errorModal && errorModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" onClick={() => setErrorModal(null)} />
          <div className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl transition-all border animate-in zoom-in-95 duration-200 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${
              isLight ? 'bg-rose-50 text-rose-500' : 'bg-rose-500/10 text-rose-400'
            }`}>
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="text-center space-y-2 mb-8">
              <h3 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {errorModal.title}
              </h3>
              <p className={`text-sm font-medium leading-relaxed opacity-60 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {errorModal.message}
              </p>
            </div>
            <button 
              onClick={() => setErrorModal(null)}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-tight transition-all active:scale-95 ${
                isLight ? 'bg-[#3d3e40] text-white hover:bg-black' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              }`}
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
