import React, { useState } from 'react';
import { X, Copy, CheckCircle, Terminal, Download } from 'lucide-react';
import { generatePythonPipelineScript } from '../utils/pythonScriptGenerator';
import { useTheme } from '../context/ThemeContext';

interface PythonScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoFileName: string;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  isOpen,
  onClose,
  videoFileName,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const scriptCode = generatePythonPipelineScript({
    videoFile: videoFileName || 'traffic.mp4',
    model: 'yolov8n.pt',
    tracker: 'botsort.yaml',
    confidence: 0.25,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yolo_botsort_tracker.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in transition-colors duration-300 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border transition-all duration-300 ${
        isLight 
          ? 'bg-slate-50 border-slate-300 shadow-[0_20px_40px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
          isLight ? 'bg-slate-100/70 border-slate-200/90' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-xs ${
              isLight ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Ultralytics YOLO26 &amp; BoT-SORT Pipeline Generator
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Runs locally on your computer with Ultralytics and BoT-SORT tracking on your MP4 video
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

        {/* Quick Instructions */}
        <div className={`px-4 py-3 border-b text-xs space-y-1.5 transition-colors duration-300 ${
          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950/40 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>Step 1:</span>
            <code className={`px-2.5 py-0.5 rounded-md border font-mono font-semibold ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}>
              pip install ultralytics opencv-python numpy
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>Step 2:</span>
            <span>Save your video as <strong className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>{videoFileName || 'traffic.mp4'}</strong> and run the script below:</span>
          </div>
        </div>

        {/* Code View */}
        <div className={`flex-1 overflow-hidden flex flex-col p-4 font-mono text-xs transition-colors duration-300 ${
          isLight ? 'bg-slate-100/50' : 'bg-slate-950'
        }`}>
          <div className={`flex items-center justify-between mb-2 pb-1 border-b transition-colors duration-300 ${
            isLight ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800'
          }`}>
            <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-300'}>yolo_botsort_tracker.py</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 active:translate-y-px ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-xs'
                }`}
              >
                {copied ? <CheckCircle className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                className={`px-3 py-1 font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-px ${
                  isLight
                    ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_4px_rgba(251,191,36,0.2)]'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .py</span>
              </button>
            </div>
          </div>

          <pre className={`flex-1 overflow-y-auto p-3 rounded-lg border leading-relaxed font-mono select-all transition-colors duration-300 ${
            isLight ? 'text-slate-800 bg-white border-slate-200 shadow-inner' : 'text-slate-300 bg-slate-900/60 border-slate-800'
          }`}>
            {scriptCode}
          </pre>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t flex justify-end transition-colors duration-300 ${
          isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer active:translate-y-px border ${
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
