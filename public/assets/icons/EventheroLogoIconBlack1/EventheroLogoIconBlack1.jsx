import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export const EventheroLogoIconBlack1 = ({ width = 100, height = 150, color = "black" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 428 649" fill="none">
      <G clipPath="url(#clip0_2032_301)" opacity="0.5">
        <Path
          d="M125.171 0H-4.91412V129.795H125.171V0Z"
          fill={color}
        />
        <Path
          d="M125.171 519.205H-4.91412V649H125.171V519.205Z"
          fill={color}
        />
        <Path
          d="M842 389.386V259.591H581.829V129.795H451.72V259.591H385.365H321.635H255.257V129.795H125.171V259.591H-135V389.386H125.171V519.205H255.257V389.386H321.635H385.365H451.72V519.205H581.829V389.386H842Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2032_301">
          <Rect
            fill="white"
            height="649"
            transform="translate(-135)"
            width="977"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
