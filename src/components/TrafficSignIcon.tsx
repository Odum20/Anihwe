import React from 'react';

interface TrafficSignIconProps {
  scale?: number;
  className?: string;
}

const VIZZY_LOGO_WEBP = 'https://res.cloudinary.com/dukipuswv/image/upload/f_webp,q_auto,w_120/v1793198289/vizzy_tqgjgz.png';

export const TrafficSignIcon: React.FC<TrafficSignIconProps> = ({ scale = 0.38, className = '' }) => {
  const containerSize = Math.max(16, Math.round(102 * scale));

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
      }}
    >
      <img
        src={VIZZY_LOGO_WEBP}
        alt="Vizzy Logo"
        className="w-full h-full object-contain drop-shadow-md transition-transform duration-200 hover:scale-105"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
