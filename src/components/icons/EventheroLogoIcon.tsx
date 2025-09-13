import React from 'react';

interface EventheroLogoIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const EventheroLogoIcon = ({ width = 180, height = 60, color = "#0000FF" }: EventheroLogoIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 1800 600" fill="none">
      {/* EventHero Logo Symbol */}
      <g transform="translate(0, 150)">
        <rect x="0" y="0" width="80" height="80" fill={color} />
        <rect x="90" y="0" width="80" height="80" fill={color} />
        <rect x="180" y="0" width="80" height="80" fill={color} />
        <rect x="270" y="0" width="80" height="80" fill={color} />
        
        <rect x="0" y="90" width="80" height="80" fill={color} />
        <rect x="270" y="90" width="80" height="80" fill={color} />
        
        <rect x="0" y="180" width="80" height="80" fill={color} />
        <rect x="90" y="180" width="80" height="80" fill={color} />
        <rect x="180" y="180" width="80" height="80" fill={color} />
        <rect x="270" y="180" width="80" height="80" fill={color} />
        
        <rect x="90" y="270" width="80" height="80" fill={color} />
        <rect x="180" y="270" width="80" height="80" fill={color} />
      </g>
      
      {/* EventHero Text */}
      <g transform="translate(400, 200)">
        {/* Event */}
        <text x="0" y="0" fontSize="120" fontWeight="bold" fill={color} fontFamily="system-ui, -apple-system, sans-serif">
          Event
        </text>
        {/* Hero */}
        <text x="420" y="0" fontSize="120" fontWeight="bold" fill={color} fontFamily="system-ui, -apple-system, sans-serif">
          Hero
        </text>
      </g>
    </svg>
  );
};