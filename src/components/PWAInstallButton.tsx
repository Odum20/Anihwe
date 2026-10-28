import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTheme } from '../context/ThemeContext';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'full' | 'icon' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'full',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 3000);
      }
    } else {
      // Fallback for browsers that don't trigger beforeinstallprompt automatically or desktop browsers
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
          isLight
            ? 'bg-slate-900 hover:bg-slate-800 text-white'
            : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
        } ${
          variant === 'compact' 
            ? 'px-2.5 py-1.5' 
            : variant === 'icon'
              ? 'p-2'
              : 'px-3 py-1.5'
        } ${className}`}
        title="Install ANIHWƐ App as PWA"
      >
        <Download className="w-3.5 h-3.5" />
        {variant !== 'icon' && (
          <span>{isIOS ? 'Install PWA' : 'Install App'}</span>
        )}
      </button>

      {/* Installed Toast Notice */}
      {installedNotice && (
        <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold animate-in fade-in duration-300">
          <Check className="w-4 h-4" />
          <span>ANIHWƐ PWA installed successfully!</span>
        </div>
      )}

      {/* Installation Guide Modal (for iOS or Desktop manual install) */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowIOSGuide(false)} 
          />
          <div className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl border animate-in zoom-in-95 duration-200 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-amber-400/20 text-amber-400'}`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-tight">Install ANIHWƐ App</h3>
              </div>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className={`p-1 rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed font-medium">
              <p>
                Install <strong>ANIHWƐ</strong> directly to your home screen for quick access, full-screen offline view, and native performance:
              </p>

              {isIOS ? (
                <ol className={`list-decimal list-inside space-y-1.5 p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <li>Tap the <strong>Share</strong> button in Safari toolbar.</li>
                  <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> at top right to complete.</li>
                </ol>
              ) : (
                <ol className={`list-decimal list-inside space-y-1.5 p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <li>Open your browser menu (3 dots or share icon).</li>
                  <li>Select <strong>Install Application</strong> or <strong>Add to Home Screen</strong>.</li>
                  <li>Confirm installation prompt.</li>
                </ol>
              )}
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold uppercase transition-all active:scale-95 ${
                isLight 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              }`}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
