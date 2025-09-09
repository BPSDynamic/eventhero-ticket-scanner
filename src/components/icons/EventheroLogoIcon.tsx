import React from 'react';

interface EventheroLogoIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const EventheroLogoIcon = ({ width = 100, height = 150, color = "black" }: EventheroLogoIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 428 649" fill="none">
      <g clipPath="url(#clip0_2032_301)" opacity="0.5">
        <path
          d="M125.171 0H-4.91412V129.795H125.171V0Z"
          fill={color}
        />
        <path
          d="M125.171 519.205H-4.91412V649H125.171V519.205Z"
          fill={color}
        />
        <path
          d="M842 389.386V259.591H581.829V129.795H451.72V259.591H385.365H321.635H255.257V129.795H125.171V259.591H-135V389.386H125.171V519.205H255.257V389.386H321.635H385.365H451.72V519.205H581.829V389.386H842Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2032_301">
          <rect
            fill="white"
            height="649"
            transform="translate(-135)"
            width="977"
          />
        </clipPath>
      </defs>
    </svg>
  );
};