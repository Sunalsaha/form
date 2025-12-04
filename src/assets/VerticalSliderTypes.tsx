import React, { useState, useEffect, useCallback } from "react";
import type { JSX } from "react";
import "./ExpandableSlider.css";

type SliderSizeKey = "S" | "M" | "L" | "XL";

interface ExpandableSliderProps {
  size: SliderSizeKey;
}

// --- CONFIGURATION ---

interface SizeConfig {
  height: number;
  iconSize: number;
  expandedWidth: number;
  trackWidth: number; // This now represents the full internal width of the SVG content
  trackHeight: number;
  thumbSize: number;
  buttonFontSize: number;
  valueFontSize: number;
}

const sizeConfig: Record<SliderSizeKey, SizeConfig> = {
  // Using 226 width from the provided SVG viewBox
  S: { height: 28, iconSize: 28, expandedWidth: 260, trackWidth: 226, trackHeight: 28, thumbSize: 16, buttonFontSize: 20, valueFontSize: 14 },
  M: { height: 36, iconSize: 36, expandedWidth: 300, trackWidth: 250, trackHeight: 36, thumbSize: 20, buttonFontSize: 24, valueFontSize: 16 },
  L: { height: 44, iconSize: 44, expandedWidth: 340, trackWidth: 280, trackHeight: 44, thumbSize: 24, buttonFontSize: 28, valueFontSize: 18 },
  XL: { height: 54, iconSize: 54, expandedWidth: 400, trackWidth: 320, trackHeight: 54, thumbSize: 28, buttonFontSize: 32, valueFontSize: 20 },
};

// --- SVG PATHS (User Provided) ---

const PIXEL_ICON_DEFAULT = (
  <>
    <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
    <path stroke="#f3f3f3" d="M4 0h20M4 1h20M2 2h2M24 2h2M2 3h2M24 3h2M0 4h2M26 4h2M0 5h2M26 5h2M0 6h2M26 6h2M0 7h2M26 7h2M0 8h2M12 8h1M26 8h2M0 9h2M26 9h2M0 10h2M26 10h2M0 11h2M26 11h2M0 12h2M26 12h2M0 13h2M26 13h2M0 14h2M9 14h1M15 14h1M26 14h2M0 15h2M26 15h2M0 16h2M26 16h2M0 17h2M26 17h2M0 18h2M18 18h1M26 18h2M0 19h2M26 19h2M0 20h2M26 20h2M0 21h2M26 21h2M0 22h2M26 22h2M0 23h2M26 23h2M2 24h2M24 24h2M2 25h2M24 25h2M4 26h20M4 27h20" />
    <path stroke="#191919" d="M4 2h20M4 3h20M2 4h24M2 5h24M2 6h24M2 7h24M2 8h8M15 8h11M2 9h6M17 9h9M2 10h6M11 10h3M17 10h9M2 11h6M10 11h5M17 11h9M2 12h6M10 12h5M17 12h9M2 13h6M11 13h3M17 13h9M2 14h6M12 14h1M17 14h9M2 15h6M18 15h8M2 16h9M18 16h8M2 17h13M20 17h6M2 18h14M20 18h6M2 19h15M20 19h6M2 20h24M2 21h24M2 22h24M2 23h24M4 24h20M4 25h20" />
    <path stroke="#666666" d="M10 8h1M14 8h1" />
    <path stroke="#aaaaaa" d="M11 8h1" />
    <path stroke="#a7a7a7" d="M13 8h1" />
    <path stroke="#272727" d="M8 9h1M8 14h1M8 15h1" />
    <path stroke="#b3b3b3" d="M9 9h1M15 9h1" />
    <path stroke="#cccccc" d="M10 9h1M17 16h1M18 17h1" />
    <path stroke="#a9a9a9" d="M11 9h1M9 13h1" />
    <path stroke="#595959" d="M12 9h1" />
    <path stroke="#acacac" d="M13 9h1" />
    <path stroke="#cacaca" d="M14 9h1" />
    <path stroke="#232323" d="M16 9h1M16 14h1M15 17h1" />
    <path stroke="#7b7b7b" d="M8 10h1" />
    <path stroke="#bdbdbd" d="M9 10h1M11 15h1M13 15h1" />
    <path stroke="#4a4a4a" d="M10 10h1" />
    <path stroke="#4f4f4f" d="M14 10h1M14 16h1" />
    <path stroke="#bebebe" d="M15 10h1" />
    <path stroke="#797979" d="M16 10h1" />
    <path stroke="#b4b4b4" d="M8 11h1M8 12h1M16 13h1" />
    <path stroke="#989898" d="M9 11h1M9 12h1" />
    <path stroke="#9b9b9b" d="M15 11h1M15 12h1" />
    <path stroke="#b0b0b0" d="M16 11h1M16 12h1" />
    <path stroke="#b8b8b8" d="M8 13h1" />
    <path stroke="#414141" d="M10 13h1M14 13h1" />
    <path stroke="#ababab" d="M15 13h1" />
    <path stroke="#a4a4a4" d="M10 14h1" />
    <path stroke="#8b8b8b" d="M11 14h1" />
    <path stroke="#8d8d8d" d="M13 14h1" />
    <path stroke="#a6a6a6" d="M14 14h1" />
    <path stroke="#313131" d="M9 15h1" />
    <path stroke="#c4c4c4" d="M10 15h1" />
    <path stroke="#dadada" d="M12 15h1" />
    <path stroke="#cfcfcf" d="M14 15h1" />
    <path stroke="#ececec" d="M15 15h1" />
    <path stroke="#d1d1d1" d="M16 15h1" />
    <path stroke="#4e4e4e" d="M17 15h1" />
    <path stroke="#727272" d="M11 16h3" />
    <path stroke="#d4d4d4" d="M15 16h1" />
    <path stroke="#f2f2f2" d="M16 16h1M17 17h1" />
    <path stroke="#d6d6d6" d="M16 17h1" />
    <path stroke="#555555" d="M19 17h1M19 19h1" />
    <path stroke="#5b5b5b" d="M16 18h1" />
    <path stroke="#d3d3d3" d="M17 18h1" />
    <path stroke="#818181" d="M19 18h1" />
    <path stroke="#1c1c1c" d="M17 19h1" />
    <path stroke="#a3a3a3" d="M18 19h1" />
  </>
);

const PIXEL_ICON_HOVER = (
  <>
    <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
    <path stroke="#f3f3f3" d="M4 0h20M4 1h20M2 2h2M24 2h2M2 3h2M24 3h2M0 4h2M26 4h2M0 5h2M26 5h2M0 6h2M26 6h2M0 7h2M26 7h2M0 8h2M26 8h2M0 9h2M26 9h2M0 10h2M26 10h2M0 11h2M26 11h2M0 12h2M26 12h2M0 13h2M26 13h2M0 14h2M26 14h2M0 15h2M26 15h2M0 16h2M26 16h2M0 17h2M26 17h2M0 18h2M26 18h2M0 19h2M26 19h2M0 20h2M26 20h2M0 21h2M26 21h2M0 22h2M26 22h2M0 23h2M26 23h2M2 24h2M24 24h2M2 25h2M24 25h2M4 26h20M4 27h20" />
    <path stroke="#262626" d="M4 2h20M4 3h20M2 4h24M2 5h24M2 6h24M2 7h24M2 8h8M15 8h11M2 9h6M17 9h9M2 10h6M11 10h3M17 10h9M2 11h6M10 11h5M17 11h9M2 12h6M10 12h5M17 12h9M2 13h6M11 13h3M17 13h9M2 14h6M12 14h1M17 14h9M2 15h6M18 15h8M2 16h9M18 16h8M2 17h13M20 17h6M2 18h14M20 18h6M2 19h15M20 19h6M2 20h24M2 21h24M2 22h24M2 23h24M4 24h20M4 25h20" />
    <path stroke="#2b5f38" d="M10 8h1M14 8h1" />
    <path stroke="#2f9148" d="M11 8h1M11 9h1" />
    <path stroke="#34c759" d="M12 8h1M9 14h1M15 14h1M16 16h1M18 18h1" />
    <path stroke="#2f8f47" d="M13 8h1" />
    <path stroke="#273129" d="M8 9h1M8 14h1M8 15h1" />
    <path stroke="#30984a" d="M9 9h1M15 9h1M8 11h1M8 12h1M16 13h1" />
    <path stroke="#31aa50" d="M10 9h1" />
    <path stroke="#2a5535" d="M12 9h1" />
    <path stroke="#309349" d="M13 9h1" />
    <path stroke="#32a94f" d="M14 9h1" />
    <path stroke="#272e28" d="M16 9h1M16 14h1M15 17h1" />
    <path stroke="#2d6f3d" d="M8 10h1" />
    <path stroke="#31a04c" d="M9 10h1" />
    <path stroke="#294a32" d="M10 10h1" />
    <path stroke="#294e33" d="M14 10h1M14 16h1" />
    <path stroke="#30a04d" d="M15 10h1" />
    <path stroke="#2c6d3c" d="M16 10h1" />
    <path stroke="#2e8444" d="M9 11h1M9 12h1" />
    <path stroke="#2e8644" d="M15 11h1M15 12h1" />
    <path stroke="#309649" d="M16 11h1M16 12h1" />
    <path stroke="#309b4b" d="M8 13h1" />
    <path stroke="#2f9048" d="M9 13h1" />
    <path stroke="#29442f" d="M10 13h1M14 13h1" />
    <path stroke="#309248" d="M15 13h1" />
    <path stroke="#2f8c47" d="M10 14h1" />
    <path stroke="#2d7a41" d="M11 14h1" />
    <path stroke="#2d7c41" d="M13 14h1" />
    <path stroke="#2f8e47" d="M14 14h1" />
    <path stroke="#28382c" d="M9 15h1" />
    <path stroke="#31a44e" d="M10 15h1" />
    <path stroke="#319f4c" d="M11 15h1" />
    <path stroke="#32b553" d="M12 15h1" />
    <path stroke="#309f4c" d="M13 15h1" />
    <path stroke="#32ac50" d="M14 15h1" />
    <path stroke="#33c357" d="M15 15h1" />
    <path stroke="#32ad51" d="M16 15h1" />
    <path stroke="#294d32" d="M17 15h1" />
    <path stroke="#2c673b" d="M11 16h3" />
    <path stroke="#32b052" d="M15 16h1" />
    <path stroke="#32ab50" d="M17 16h1" />
    <path stroke="#32b152" d="M16 17h1" />
    <path stroke="#34c659" d="M17 17h1" />
    <path stroke="#32aa50" d="M18 17h1" />
    <path stroke="#2a5334" d="M19 17h1M19 19h1" />
    <path stroke="#2a5736" d="M16 18h1" />
    <path stroke="#32af52" d="M17 18h1" />
    <path stroke="#2d733e" d="M19 18h1" />
    <path stroke="#262927" d="M17 19h1" />
    <path stroke="#2f8c46" d="M18 19h1" />
  </>
);

// --- TRACK SVG (User Provided) ---

const TRACK_SVG_PATH = (
  <>
    <path stroke="#f3f3f3" d="M4 0h218M4 1h218M2 2h2M222 2h2M2 3h2M222 3h2M0 4h2M224 4h2M0 5h2M224 5h2M0 6h2M224 6h2M0 7h2M224 7h2M0 8h2M224 8h2M0 9h2M209 9h2M224 9h2M0 10h2M32 10h162M209 10h2M224 10h2M0 11h2M32 11h162M209 11h2M224 11h2M0 12h2M30 12h2M194 12h2M209 12h2M224 12h2M0 13h2M11 13h10M30 13h2M194 13h2M205 13h10M224 13h2M0 14h2M11 14h10M30 14h2M194 14h2M205 14h10M224 14h2M0 15h2M30 15h2M194 15h2M209 15h2M224 15h2M0 16h2M32 16h162M209 16h2M224 16h2M0 17h2M32 17h162M209 17h2M224 17h2M0 18h2M209 18h2M224 18h2M0 19h2M224 19h2M0 20h2M224 20h2M0 21h2M224 21h2M0 22h2M224 22h2M0 23h2M224 23h2M2 24h2M222 24h2M2 25h2M222 25h2M4 26h218M4 27h218" />
    <path stroke="#262626" d="M4 2h218M4 3h218M2 4h222M2 5h222M2 6h222M2 7h222M2 8h222M2 9h207M211 9h13M2 10h30M194 10h15M211 10h13M2 11h30M194 11h15M211 11h13M2 12h28M196 12h13M211 12h13M2 13h9M21 13h9M196 13h9M215 13h9M2 14h9M21 14h9M196 14h9M215 14h9M2 15h28M196 15h13M211 15h13M2 16h30M194 16h15M211 16h13M2 17h30M194 17h15M211 17h13M2 18h207M211 18h13M2 19h222M2 20h222M2 21h222M2 22h222M2 23h222M4 24h218M4 25h218" />
    <path stroke="#626262" d="M32 12h41M32 13h41M32 14h41M32 15h41" />
    <path stroke="#191919" d="M73 12h121M73 13h121M73 14h121M73 15h121" />
  </>
);

const THUMB_SVG_PATH = (
  <>
    <path stroke="#f3f3f3" d="M4 0h8M4 1h8M2 2h2M12 2h2M2 3h2M12 3h2M0 4h2M14 4h2M0 5h2M14 5h2M0 6h2M14 6h2M0 7h2M14 7h2M0 8h2M14 8h2M0 9h2M14 9h2M0 10h2M14 10h2M0 11h2M14 11h2M2 12h2M12 12h2M2 13h2M12 13h2M4 14h8M4 15h8" />
    <path stroke="#191919" d="M4 2h8M4 3h8M2 4h2M12 4h2M2 5h2M12 5h2M2 6h2M12 6h2M2 7h2M12 7h2M2 8h2M12 8h2M2 9h2M12 9h2M2 10h2M12 10h2M2 11h2M12 11h2M4 12h8M4 13h8" />
    <path stroke="#333333" d="M4 4h8M4 5h8M4 6h8M4 7h8M4 8h8M4 9h8M4 10h8M4 11h8" />
  </>
);

// --- Child Components ---

const SliderIcon: React.FC<{ isHovered: boolean; size: number }> = React.memo(({ isHovered, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 -0.5 28 28"
    shapeRendering="crispEdges"
    xmlns="http://www.w3.org/2000/svg"
  >
    {isHovered ? PIXEL_ICON_HOVER : PIXEL_ICON_DEFAULT}
  </svg>
));
SliderIcon.displayName = "SliderIcon";

const SliderTrack: React.FC<{ size: SliderSizeKey }> = React.memo(({ size }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 -0.5 226 28"
    shapeRendering="crispEdges"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {TRACK_SVG_PATH}
  </svg>
));
SliderTrack.displayName = "SliderTrack";

const SliderThumb: React.FC<{ size: number }> = React.memo(({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 -0.5 16 16"
    shapeRendering="crispEdges"
    xmlns="http://www.w3.org/2000/svg"
  >
    {THUMB_SVG_PATH}
  </svg>
));
SliderThumb.displayName = "SliderThumb";

// --- Main Component ---

const ExpandableSlider: React.FC<ExpandableSliderProps> = ({ size }) => {
  const config = sizeConfig[size];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handleIncrement = useCallback(() => setSliderValue((prev) => Math.min(100, prev + 5)), []);
  const handleDecrement = useCallback(() => setSliderValue((prev) => Math.max(0, prev - 5)), []);

  const handleDrag = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    // Adjust drag area calculation to respect internal padding/margins of the track if needed
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setSliderValue(Math.max(0, Math.min(100, percentage)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  }, [handleDrag]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDrag(e.clientX);
    };
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDrag]);

  // --- Dynamic Styles ---

  const containerStyle: React.CSSProperties = {
    height: `${config.height}px`,
    width: isExpanded ? `${config.expandedWidth}px` : `${config.height}px`,
    
    background: 'transparent', 
    boxShadow: 'none',
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    transition: "width 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
    position: "relative",
    padding: `0`,
    boxSizing: "border-box",
  };

  const iconContainerStyle: React.CSSProperties = {
    minWidth: `${config.height}px`,
    height: `${config.height}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  };
  
  const contentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    width: '100%',
    gap: `4px`,
    paddingRight: `${config.height / 2}px`,
    opacity: isExpanded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const trackContainerStyle: React.CSSProperties = {
    position: "relative",
    width: `${config.trackWidth}px`,
    height: `${config.trackHeight}px`,
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
  };

  const trackBackgroundStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  };

  const filledTrackStyle: React.CSSProperties = {
    position: "absolute",
    top: `${(12 / 28) * 100}%`, 
    left: `${(32 / 226) * 100}%`,
    height: `${(4 / 28) * 100}%`,
    width: `calc(${sliderValue}% * ${(162 / 226)})`, 
    backgroundColor: '#626262',
    pointerEvents: "none",
    transition: 'width 0.1s linear'
  };

  const thumbStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: `calc(${32/226*100}% + (${sliderValue/100} * ${162/226*100}%))`,
    width: `${config.thumbSize}px`,
    height: `${config.thumbSize}px`,
    // Removed previous border/background as we are now using SVG
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    // Removed boxShadow as SVG contains shading
  };

  
  
  return (
    <div
      style={containerStyle}
      onMouseEnter={() => { setIsHovered(true); setIsExpanded(true); }}
      onMouseLeave={() => { setIsHovered(false); setIsExpanded(false); }}
    >
      <div style={iconContainerStyle}>
        <SliderIcon isHovered={isHovered} size={config.iconSize} />
      </div>

      {isExpanded && (
        <div style={contentStyle}>
          
          <div ref={trackRef} style={trackContainerStyle} onMouseDown={handleMouseDown}>
            {/* Background SVG */}
            <div style={trackBackgroundStyle}>
                <SliderTrack size={size} />
            </div>
            
            {/* Filled Progress Bar */}
            <div style={filledTrackStyle} />

            {/* Thumb (SVG) */}
            <div style={thumbStyle}>
                <SliderThumb size={config.thumbSize} />
            </div>
          </div>

         
        </div>
      )}
    </div>
  );
};

// --- DEMO ---

export const SliderDemo: React.FC = () => (
  <div className="slider-demo">
    <h1 className="slider-demo__title">
      SLIDE 1.2 EX - Pixel Art Track & Icon
    </h1>
    <div className="slider-demo__row">
      <div className="slider-demo__item">
        <span className="slider-demo__label">(S) h28px</span>
        <ExpandableSlider size="S" />
      </div>
      <div className="slider-demo__item">
        <span className="slider-demo__label">(M) h36px</span>
        <ExpandableSlider size="M" />
      </div>
      <div className="slider-demo__item">
        <span className="slider-demo__label">(L) h44px</span>
        <ExpandableSlider size="L" />
      </div>
      <div className="slider-demo__item">
        <span className="slider-demo__label">(XL) h54px</span>
        <ExpandableSlider size="XL" />
      </div>
    </div>
  </div>
);

export default SliderDemo;
