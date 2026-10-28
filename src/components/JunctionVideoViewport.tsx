import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  FileVideo,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { TrackedVehicle, SafetyZone, IncidentAlert, VideoTelemetry } from '../types/traffic';
import { VideoCvTracker } from '../utils/videoCvTracker';
import { useTheme } from '../context/ThemeContext';

interface JunctionVideoViewportProps {
  onIncidentDetected: (incident: IncidentAlert) => void;
  onTelemetryUpdate: (telemetry: Partial<VideoTelemetry>) => void;
  zones: SafetyZone[];
  onOpenScriptHub: () => void;
  onInvalidTrafficVideo: (reason: string, fileName: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const JunctionVideoViewport: React.FC<JunctionVideoViewportProps> = ({
  onIncidentDetected,
  onTelemetryUpdate,
  zones,
  onOpenScriptHub,
  onInvalidTrafficVideo,
  fileInputRef,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const trackerRef = useRef<VideoCvTracker>(new VideoCvTracker());
  const animationFrameRef = useRef<number | null>(null);

  // Video State
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isAuditingOpenRouter, setIsAuditingOpenRouter] = useState<boolean>(false);
  const [openRouterActive, setOpenRouterActive] = useState<boolean>(false);

  // Overlay Toggles
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showTrails, setShowTrails] = useState<boolean>(true);
  const [showSpeed, setShowSpeed] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);

  // Capture frame as base64 JPEG
  const captureCurrentFrameBase64 = (): string => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return '';
    try {
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = 640;
      snapCanvas.height = 360;
      const sCtx = snapCanvas.getContext('2d');
      if (!sCtx) return '';
      sCtx.drawImage(video, 0, 0, 640, 360);
      return snapCanvas.toDataURL('image/jpeg', 0.85);
    } catch {
      return '';
    }
  };

  // OpenRouter Vision Bridge: analyzes frame to detect real infractions and validate traffic video
  const runOpenRouterVisionAudit = useCallback(async (isInitialValidation: boolean = false) => {
    const video = videoRef.current;
    if (!video) return;

    const frameBase64 = captureCurrentFrameBase64();
    if (!frameBase64) return;

    setIsAuditingOpenRouter(true);
    try {
      const res = await fetch('/api/openrouter/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: frameBase64,
          timestampSec: video.currentTime || 0,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setOpenRouterActive(true);

        // Check if video is valid traffic footage
        if (result.isValidTrafficVideo === false) {
          video.pause();
          setIsPlaying(false);
          onInvalidTrafficVideo(
            result.validationMessage || 'Uploaded media does not contain valid vehicular road traffic or junction geometry.',
            videoName || 'uploaded_video.mp4'
          );
          return;
        }

        // Bridge genuine infractions from OpenRouter Vision to live infrastructure log
        if (result.infractions && result.infractions.length > 0) {
          result.infractions.forEach((inf: any, idx: number) => {
            onIncidentDetected({
              id: `OR-${Date.now().toString().slice(-4)}-${idx + 1}`,
              timestamp: new Date().toLocaleTimeString(),
              videoTimeSec: Math.round(video.currentTime),
              type: inf.type,
              severity: inf.severity || 'HIGH',
              vehicleId: 200 + idx,
              vehicleClass: inf.vehicleClass || 'car',
              speedKmh: inf.estimatedSpeedKmh || 45,
              zone: inf.zone || 'OpenRouter Vision Corridor',
              details: inf.details || 'Real infraction detected via OpenRouter Multimodal Vision bridge.',
            });
          });
        }
      }
    } catch (err) {
      console.warn('OpenRouter vision bridge request notice:', err);
    } finally {
      setIsAuditingOpenRouter(false);
    }
  }, [videoName, onIncidentDetected, onInvalidTrafficVideo]);

  // File Upload Handlers (Drag & Drop + File Input)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadVideoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.includes('video') || file.name.endsWith('.mp4') || file.name.endsWith('.webm'))) {
      loadVideoFile(file);
    } else if (file) {
      onInvalidTrafficVideo('Uploaded file is not a supported MP4 or WebM video format.', file.name);
    }
  };

  const loadVideoFile = (file: File) => {
    // Quick heuristic filename check
    const lowerName = file.name.toLowerCase();
    const invalidKeywords = ['anime', 'cartoon', 'selfie', 'gameplay', 'music_video', 'screencast'];
    if (invalidKeywords.some((k) => lowerName.includes(k))) {
      onInvalidTrafficVideo(
        `File name "${file.name}" indicates non-vehicular media. Please upload a traffic CCTV or highway recording.`,
        file.name
      );
      return;
    }

    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoName(file.name);
    trackerRef.current.reset();
    setIsPlaying(true);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Main Computer Vision Processing Loop (Synchronized with Video Frame Updates)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTelemetryPush = performance.now();

    const processFrame = () => {
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        // Match overlay canvas size to displayed video bounds
        if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Run real computer vision tracking on raw video pixels
        const tracked = trackerRef.current.processVideoFrame(video, zones, onIncidentDetected);

        // Clear previous overlay frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaleX = canvas.width / 640;
        const scaleY = canvas.height / 360;

        // 1. Draw Calibrated Safety Zones
        if (showZones) {
          zones.forEach((zone) => {
            if (zone.type === 'STOP_LINE') {
              const y = zone.y1 * canvas.height;
              const x1 = zone.x1 * canvas.width;
              const x2 = zone.x2 * canvas.width;
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 3;
              ctx.setLineDash([8, 6]);
              ctx.beginPath();
              ctx.moveTo(x1, y);
              ctx.lineTo(x2, y);
              ctx.stroke();
              ctx.setLineDash([]);

              ctx.fillStyle = '#ef4444';
              ctx.font = '12px JetBrains Mono, monospace';
              ctx.fillText(`${zone.name}`, x1 + 4, y - 6);
            } else if (zone.type === 'SOLID_LINE') {
              const x = zone.x1 * canvas.width;
              const y1 = zone.y1 * canvas.height;
              const y2 = zone.y2 * canvas.height;
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(x, y1);
              ctx.lineTo(x, y2);
              ctx.stroke();

              ctx.fillStyle = '#38bdf8';
              ctx.font = '11px JetBrains Mono, monospace';
              ctx.fillText(`${zone.name}`, x + 6, (y1 + y2) / 2);
            } else if (zone.type === 'CONFLICT_BOX') {
              const bx = zone.x1 * canvas.width;
              const by = zone.y1 * canvas.height;
              const bw = (zone.x2 - zone.x1) * canvas.width;
              const bh = (zone.y2 - zone.y1) * canvas.height;

              ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
              ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
              ctx.lineWidth = 1.5;
              ctx.fillRect(bx, by, bw, bh);
              ctx.strokeRect(bx, by, bw, bh);

              ctx.fillStyle = '#eab308';
              ctx.font = '11px JetBrains Mono, monospace';
              ctx.fillText(`${zone.name}`, bx + 8, by + 18);
            }
          });
        }

        // 2. Draw BoT-SORT Trajectory Motion Trails
        if (showTrails) {
          tracked.forEach((t) => {
            if (t.trajectory.length > 1) {
              ctx.beginPath();
              ctx.moveTo(t.trajectory[0][0] * scaleX, t.trajectory[0][1] * scaleY);
              for (let i = 1; i < t.trajectory.length; i++) {
                ctx.lineTo(t.trajectory[i][0] * scaleX, t.trajectory[i][1] * scaleY);
              }
              ctx.strokeStyle = t.infraction ? '#ef4444' : t.color;
              ctx.lineWidth = 2.5;
              ctx.stroke();
            }
          });
        }

        // 3. Draw YOLO26 Bounding Boxes & Radar Tags
        if (showBoxes) {
          tracked.forEach((t) => {
            const bx = t.bbox.x * scaleX;
            const by = t.bbox.y * scaleY;
            const bw = t.bbox.width * scaleX;
            const bh = t.bbox.height * scaleY;

            const boxColor = t.infraction ? '#ef4444' : t.color;

            // Bounding box frame
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(bx, by, bw, bh);

            // Label tag (Track ID + Class + Speed)
            const label = `#${t.id} ${t.class.toUpperCase()}`;
            ctx.font = '11px JetBrains Mono, monospace';
            const labelW = ctx.measureText(label).width + 8;

            ctx.fillStyle = boxColor;
            ctx.fillRect(bx, Math.max(0, by - 18), labelW, 18);

            ctx.fillStyle = '#090d16';
            ctx.fillText(label, bx + 4, Math.max(12, by - 5));

            // Speed radar tag
            if (showSpeed) {
              const speedText = `${t.velocityKmh.toFixed(1)} km/h`;
              ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
              ctx.fillRect(bx, by + bh, 72, 14);
              ctx.fillStyle = t.velocityKmh > 55 ? '#ef4444' : '#cbd5e1';
              ctx.fillText(speedText, bx + 4, by + bh + 11);
            }

            // Infraction banner
            if (t.infraction) {
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(bx, by + bh + (showSpeed ? 16 : 2), 140, 16);
              ctx.fillStyle = '#ffffff';
              ctx.font = '10px JetBrains Mono, monospace';
              ctx.fillText(`! ${t.infraction}`, bx + 4, by + bh + (showSpeed ? 28 : 14));
            }
          });
        }

        // Periodic Telemetry Emit (every 500ms)
        const now = performance.now();
        if (now - lastTelemetryPush > 500) {
          const speeds = tracked.map((t) => t.velocityKmh);
          const avgSpeed = speeds.length > 0
            ? Number((speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(1))
            : 0.0;

          onTelemetryUpdate({
            currentTimeSec: video.currentTime,
            activeTracksCount: tracked.length,
            totalUniqueTracked: trackerRef.current.getTotalCount(),
            flowRatePerMin: Math.max(12, tracked.length * 4),
            averageSpeedKmh: avgSpeed,
            fps: 30,
          });
          lastTelemetryPush = now;
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [zones, showBoxes, showTrails, showSpeed, showZones, onIncidentDetected, onTelemetryUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const controlBarClasses = `flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
    isLight 
      ? 'bg-slate-50 border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]' 
      : 'bg-slate-900 border-slate-800 shadow-lg'
  }`;

  const buttonPrimaryClasses = `px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-px ${
    isLight
      ? 'bg-[#3d3e40] hover:bg-[#2b2c2e] text-white shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]'
      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_4px_rgba(251,191,36,0.2)]'
  }`;

  const buttonSecondaryClasses = `px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer active:translate-y-px border ${
    isLight 
      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' 
      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
  }`;

  const hudButtonClasses = (active: boolean) => `px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
    active 
      ? isLight ? 'bg-[#3d3e40] text-white font-semibold' : 'bg-amber-400 text-slate-950 font-bold'
      : isLight ? 'text-slate-400 hover:text-slate-900' : 'text-slate-400 hover:text-white'
  }`;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Viewport Top Control Bar */}
      <div className={controlBarClasses}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-inner transition-colors ${
            isLight ? 'bg-slate-200/80 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <FileVideo className="w-4 h-4" />
          </div>
          <div>
            <span className={`text-xs font-bold block truncate max-w-xs transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {videoName || 'No Video Loaded'}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[11px] font-mono font-medium transition-colors ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                HTML5 Pixel Stream · In-Browser BoT-SORT
              </span>
              {openRouterActive && (
                <span className={`text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  <CheckCircle2 className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <span>OpenRouter Bridge Connected</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {videoSrc && (
            <button
              onClick={() => runOpenRouterVisionAudit(false)}
              disabled={isAuditingOpenRouter}
              className={buttonSecondaryClasses}
              title="Audit current video frame via OpenRouter Vision API"
            >
              <Cpu className={`w-3.5 h-3.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
              <span>{isAuditingOpenRouter ? 'Auditing Vision...' : 'OpenRouter Vision Audit'}</span>
            </button>
          )}

          <label className={buttonPrimaryClasses}>
            <Upload className="w-3.5 h-3.5" />
            <span>Select / Upload MP4</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative w-full aspect-video min-h-[460px] rounded-xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center group ${
          isLight 
            ? 'bg-slate-950 border-slate-300/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_4px_16px_rgba(15,23,42,0.08)]' 
            : 'bg-black border-slate-800 shadow-2xl'
        }`}
      >
        {videoSrc ? (
          <>
            {/* Native HTML5 Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                  videoRef.current
                    .play()
                    .then(() => {
                      setIsPlaying(true);
                      setTimeout(() => runOpenRouterVisionAudit(true), 600);
                    })
                    .catch(() => {});
                }
              }}
              className="w-full h-full object-contain"
            />

            {/* Real-Time Computer Vision Overlay Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
          </>
        ) : (
          /* Empty State with Drag & Drop */
          <div className={`flex flex-col items-center justify-center p-8 text-center max-w-md rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-700/80'
          }`}>
            <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 shadow-inner transition-colors ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}>
              <Upload className="w-7 h-7" />
            </div>
            <h3 className={`text-base font-bold transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Load Traffic Video (MP4)</h3>
            <p className={`text-xs mt-1 leading-relaxed transition-colors ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
              Drag and drop your traffic MP4 file here, or click to choose a video to initialize real in-browser YOLO26 &amp; BoT-SORT object tracking.
            </p>
            <label className={`${buttonPrimaryClasses} mt-4 px-6`}>
              <Upload className="w-4 h-4" />
              <span>Choose MP4 File</span>
              <input type="file" accept="video/mp4,video/webm" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Floating HUD Toggles */}
        {videoSrc && (
          <div className={`absolute top-3 right-3 flex items-center gap-1.5 p-1 backdrop-blur-md rounded-lg border text-xs z-20 shadow-md transition-all duration-300 ${
            isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/85 border-slate-700/80'
          }`}>
            <button onClick={() => setShowBoxes(!showBoxes)} className={hudButtonClasses(showBoxes)}>
              Bounding Boxes
            </button>
            <button onClick={() => setShowTrails(!showTrails)} className={hudButtonClasses(showTrails)}>
              BoT-SORT Trails
            </button>
            <button onClick={() => setShowSpeed(!showSpeed)} className={hudButtonClasses(showSpeed)}>
              Speed Radar
            </button>
            <button onClick={() => setShowZones(!showZones)} className={hudButtonClasses(showZones)}>
              Safety Zones
            </button>
          </div>
        )}
      </div>

      {/* Video Playback & Timeline Controls */}
      {videoSrc && (
        <div className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col gap-2.5 ${
          isLight 
            ? 'bg-slate-50 border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]' 
            : 'bg-slate-900 border-slate-800 shadow-lg'
        }`}>
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono font-semibold tabular-nums ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className={`flex-1 cursor-pointer h-2 rounded-lg shadow-inner transition-all ${
                isLight ? 'accent-[#3d3e40] bg-slate-200' : 'accent-amber-400 bg-slate-800'
              }`}
            />
            <span className={`text-xs font-mono font-semibold tabular-nums ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{formatTime(duration)}</span>
          </div>

          {/* Bottom Bar: Play/Pause, Speed, Volume */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button onClick={togglePlay} className={buttonSecondaryClasses}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    trackerRef.current.reset();
                  }
                }}
                className={buttonSecondaryClasses}
                title="Restart Video & Reset Tracks"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className={buttonSecondaryClasses}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Playback speed selector */}
            <div className={`flex items-center gap-1 p-0.5 rounded-lg border transition-colors ${
              isLight ? 'bg-slate-200/80 border-slate-300/80' : 'bg-slate-800 border-slate-700'
            }`}>
              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer text-xs ${
                    playbackRate === spd
                      ? isLight ? 'bg-[#3d3e40] text-white font-bold shadow-xs' : 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : isLight ? 'text-slate-600 hover:text-slate-900 font-medium' : 'text-slate-400 hover:text-white font-medium'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
