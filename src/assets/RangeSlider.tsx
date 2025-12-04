import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RangeSlider.css';

type ThumbSize = 'S' | 'M' | 'L' | 'XL';

interface SizeConfig {
  label: string;
  widthLabel: string;
  containerWidth: number;
  trackWidth: number;
  height: number;
  thumbSize: ThumbSize;
  verticalOffset: number;
  svgMarkup: string;
}

interface RangeValues {
  min: number;
  max: number;
}

const SLIDER_SIZES: SizeConfig[] = [
  {
    label: 'S h 20 Px',
    widthLabel: 'W 232 Px',
    containerWidth: 260,
    trackWidth: 228,
    height: 21,
    thumbSize: 'S',
    verticalOffset: 0,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 232 24" shape-rendering="crispEdges">
      <path stroke="#f3f3f3" d="M4 6h224M4 7h224M2 8h2M228 8h2M2 9h2M228 9h2M2 10h2M228 10h2M2 11h2M228 11h2M2 12h2M228 12h2M2 13h2M228 13h2M2 14h2M228 14h2M2 15h2M228 15h2M4 16h224M4 17h224" />
      <path stroke="#191919" d="M4 8h224M4 9h224M4 10h224M4 11h224M4 12h224M4 13h224M4 14h224M4 15h224" />
    </svg>`,
  },
  {
    label: 'L h 12 Px',
    widthLabel: 'W 228 Px',
    containerWidth: 256,
    trackWidth: 224,
    height: 21,
    thumbSize: 'L',
    verticalOffset: 0,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 228 12" shape-rendering="crispEdges">
      <path stroke="#f3f3f3" d="M2 0h224M2 1h224M0 2h2M226 2h2M0 3h2M226 3h2M0 4h2M226 4h2M0 5h2M226 5h2M0 6h2M226 6h2M0 7h2M226 7h2M0 8h2M226 8h2M0 9h2M226 9h2M2 10h224M2 11h224" />
      <path stroke="#191919" d="M2 2h224M2 3h224M2 4h224M2 5h224M2 6h224M2 7h224M2 8h224M2 9h224" />
    </svg>`,
  },
  {
    label: 'M h 28 Px',
    widthLabel: 'W 260 Px',
    containerWidth: 288,
    trackWidth: 256,
    height: 30,
    thumbSize: 'M',
    verticalOffset: 4,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 260 28" shape-rendering="crispEdges">
      <path stroke="#f3f3f3" d="M4 6h250M4 7h250M2 8h2M254 8h2M2 9h2M254 9h2M0 10h2M256 10h2M0 11h2M256 11h2M0 12h2M256 12h2M0 13h2M256 13h2M0 14h2M256 14h2M0 15h2M256 15h2M0 16h2M256 16h2M0 17h2M256 17h2M2 18h2M254 18h2M2 19h2M254 19h2M4 20h250M4 21h250" />
      <path stroke="#191919" d="M4 8h250M4 9h250M2 10h254M2 11h254M2 12h254M2 13h254M2 14h254M2 15h254M2 16h254M2 17h254M4 18h250M4 19h250" />
    </svg>`,
  },
  {
    label: 'XL h 32 Px',
    widthLabel: 'W 320 Px',
    containerWidth: 348,
    trackWidth: 316,
    height: 32,
    thumbSize: 'XL',
    verticalOffset: -6,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 320 32" shape-rendering="crispEdges">
      <path stroke="#f3f3f3" d="M6 6h308M6 7h308M4 8h2M314 8h2M4 9h2M314 9h2M2 10h2M316 10h2M2 11h2M316 11h2M2 12h2M316 12h2M2 13h2M316 13h2M2 14h2M316 14h2M2 15h2M316 15h2M2 16h2M316 16h2M2 17h2M316 17h2M2 18h2M316 18h2M2 19h2M316 19h2M2 20h2M316 20h2M2 21h2M316 21h2M4 22h2M314 22h2M4 23h2M314 23h2M6 24h308M6 25h308" />
      <path stroke="#191919" d="M6 8h308M6 9h308M4 10h312M4 11h312M4 12h312M4 13h312M4 14h312M4 15h312M4 16h312M4 17h312M4 18h312M4 19h312M4 20h312M4 21h312M6 22h308M6 23h308" />
    </svg>`,
  },
];

const THUMB_SIZE_MAP: Record<ThumbSize, { width: number; height: number }> = {
  S: { width: 16, height: 16 },
  M: { width: 20, height: 20 },
  L: { width: 20, height: 20 },
  XL: { width: 28, height: 28 },
};

const THUMB_SVG = {
  normal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 0h8M4 1h8M2 2h2M12 2h2M2 3h2M12 3h2M0 4h2M14 4h2M0 5h2M14 5h2M0 6h2M14 6h2M0 7h2M14 7h2M0 8h2M14 8h2M0 9h2M14 9h2M0 10h2M14 10h2M0 11h2M14 11h2M2 12h2M12 12h2M2 13h2M12 13h2M4 14h8M4 15h8" /><path stroke="#191919" d="M4 2h8M4 3h8M2 4h2M12 4h2M2 5h2M12 5h2M2 6h2M12 6h2M2 7h2M12 7h2M2 8h2M12 8h2M2 9h2M12 9h2M2 10h2M12 10h2M2 11h2M12 11h2M4 12h8M4 13h8" /><path stroke="#333333" d="M4 4h8M4 5h8M4 6h8M4 7h8M4 8h8M4 9h8M4 10h8M4 11h8" /></svg>`,
  hover: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 0h8M4 1h8M2 2h2M12 2h2M2 3h2M12 3h2M0 4h2M14 4h2M0 5h2M14 5h2M0 6h2M14 6h2M0 7h2M14 7h2M0 8h2M14 8h2M0 9h2M14 9h2M0 10h2M14 10h2M0 11h2M14 11h2M2 12h2M12 12h2M2 13h2M12 13h2M4 14h8M4 15h8" /><path stroke="#191919" d="M4 2h8M4 3h8M2 4h2M12 4h2M2 5h2M12 5h2M2 6h2M12 6h2M2 7h2M12 7h2M2 8h2M12 8h2M2 9h2M12 9h2M2 10h2M12 10h2M2 11h2M12 11h2M4 12h8M4 13h8" /><path stroke="#f3f3f3" d="M4 4h8M4 5h8M4 6h8M4 7h8M4 8h8M4 9h8M4 10h8M4 11h8" /></svg>`,
  pressed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 26 23" shape-rendering="crispEdges"><path stroke="#6262628b" d="M8 2h10M8 3h10M6 4h3M17 4h3M6 5h3M17 5h3M4 6h3M19 6h3M4 7h3M19 7h3M3 8h2M21 8h2M3 9h2M21 9h2M3 10h2M21 10h2M3 11h2M21 11h2M3 12h2M21 12h2M3 13h2M21 13h2M3 14h2M21 14h2M3 15h2M21 15h2M4 16h3M19 16h3M4 17h3M19 17h3M6 18h3M17 18h3M6 19h3M17 19h3M8 20h10M8 21h10" /><path stroke="#f3f3f3" d="M9 4h8M9 5h8M7 6h2M17 6h2M7 7h2M17 7h2M5 8h2M9 8h8M19 8h2M5 9h2M9 9h8M19 9h2M5 10h2M9 10h8M19 10h2M5 11h2M9 11h8M19 11h2M5 12h2M9 12h8M19 12h2M5 13h2M9 13h8M19 13h2M5 14h2M9 14h8M19 14h2M5 15h2M9 15h8M19 15h2M7 16h2M17 16h2M7 17h2M17 17h2M9 18h8M9 19h8" /><path stroke="#191919" d="M9 6h8M9 7h8M7 8h2M17 8h2M7 9h2M17 9h2M7 10h2M17 10h2M7 11h2M17 11h2M7 12h2M17 12h2M7 13h2M17 13h2M9 16h8M9 17h8" /></svg>`,
};

const RangeSlider: React.FC = () => {
  const [ranges, setRanges] = useState<RangeValues[]>(
    SLIDER_SIZES.map(() => ({ min: 28, max: 55 }))
  );
  const [dragging, setDragging] = useState<{ index: number; thumb: 'min' | 'max' } | null>(null);
  const [hover, setHover] = useState<{ index: number; thumb: 'min' | 'max' } | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startDrag = useCallback(
    (index: number, thumb: 'min' | 'max', e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setDragging({ index, thumb });
    },
    []
  );

  const updateFromClientX = useCallback(
    (index: number, thumb: 'min' | 'max', clientX: number) => {
      const track = trackRefs.current[index];
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const trackLeft = rect.left;
      const trackWidth = rect.width;

      let percentage = ((clientX - trackLeft) / trackWidth) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      setRanges(prev => {
        const copy = [...prev];
        const current = copy[index];
        const value = Math.round(percentage);
        if (thumb === 'min') {
          copy[index] = { ...current, min: Math.min(value, current.max - 1) };
        } else {
          copy[index] = { ...current, max: Math.max(value, current.min + 1) };
        }
        return copy;
      });
    },
    []
  );

  useEffect(() => {
    if (!dragging) return;
    const { index, thumb } = dragging;

    const handleMouseMove = (e: MouseEvent) => {
      updateFromClientX(index, thumb, e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateFromClientX(index, thumb, e.touches[0].clientX);
    };
    const end = () => setDragging(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchend', end);
    };
  }, [dragging, updateFromClientX]);

  const handleKeyDown = (index: number, thumb: 'min' | 'max', e: React.KeyboardEvent) => {
    const step = 1;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    setRanges(prev => {
      const copy = [...prev];
      const current = copy[index];
      if (thumb === 'min') {
        if (e.key === 'ArrowLeft') {
          copy[index] = { ...current, min: Math.max(0, current.min - step) };
        } else {
          copy[index] = { ...current, min: Math.min(current.max - 1, current.min + step) };
        }
      } else {
        if (e.key === 'ArrowLeft') {
          copy[index] = { ...current, max: Math.max(current.min + 1, current.max - step) };
        } else {
          copy[index] = { ...current, max: Math.min(100, current.max + step) };
        }
      }
      return copy;
    });
  };

  return (
    <div className="range-slider-container">
      <h1 className="range-title">
        SLIDE 1.8 - Fixed Pixel Types
      </h1>

      <div className="range-grid">
        {SLIDER_SIZES.map((size, index) => {
          const range = ranges[index];
          const thumbMeta = THUMB_SIZE_MAP[size.thumbSize];
          const highlightLeftPercent = range.min;
          const highlightWidthPercent = range.max - range.min;

          return (
            <div
              key={size.label}
              className="range-section"
              style={{ marginTop: size.verticalOffset ? `${size.verticalOffset}px` : '0px' }}
            >
              <div className="range-size-info">
                <span className="range-size-label">{size.label}</span>
                <span className="range-width-label">{size.widthLabel}</span>
              </div>

              <div className="range-box">
                {/* Min value box */}
                <div className="value-box-wrapper" style={{ height: size.height + 20 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -0.5 37 28"
                    shapeRendering="crispEdges"
                    className="value-box-svg"
                  >
                    <path stroke="#f3f3f3" d="M4 0h29M4 1h29M2 2h2M33 2h2M2 3h2M33 3h2M0 4h2M35 4h2M0 5h2M35 5h2M0 6h2M35 6h2M0 7h2M35 7h2M0 8h2M35 8h2M0 9h2M35 9h2M0 10h2M35 10h2M0 11h2M35 11h2M0 12h2M35 12h2M0 13h2M35 13h2M0 14h2M35 14h2M0 15h2M35 15h2M0 16h2M35 16h2M0 17h2M35 17h2M0 18h2M35 18h2M0 19h2M35 19h2M0 20h2M35 20h2M0 21h2M35 21h2M0 22h2M35 22h2M0 23h2M35 23h2M2 24h2M33 24h2M2 25h2M33 25h2M4 26h29M4 27h29" />
                    <path stroke="#191919" d="M4 2h29M4 3h29M2 4h33M2 5h33M2 6h33M2 7h33M2 8h33M2 9h33M2 10h33M2 11h33M2 12h33M2 13h33M2 14h33M2 15h33M2 16h33M2 17h33M2 18h33M2 19h33M2 20h33M2 21h33M2 22h33M2 23h33M4 24h29M4 25h29" />
                  </svg>
                  <span className="value-text">{range.min}</span>
                </div>

                {/* Track container - Now responsive with max-width */}
                <div 
                  className="range-track-wrapper"
                  ref={el => { trackRefs.current[index] = el; }}
                  style={{ 
                    maxWidth: `${size.trackWidth}px`,
                    width: '100%',
                    margin: '0 8px'
                  }}
                >
                  <div
                    className="range-track"
                    style={{
                      width: '100%',
                      height: `${size.height}px`,
                    }}
                  >
                    <div
                      className="track-bar-svg"
                      dangerouslySetInnerHTML={{ __html: size.svgMarkup }}
                    />

                    <div
                      className="track-highlight"
                      style={{
                        left: `${highlightLeftPercent}%`,
                        width: `${highlightWidthPercent}%`,
                        height: `${Math.max(4, size.height * 0.4)}px`,
                        top: `calc(50% - ${Math.max(4, size.height * 0.4) / 2}px)`,
                      }}
                    />

                    {/* Min thumb */}
                    <button
                      type="button"
                      className={`range-thumb ${dragging?.index === index && dragging?.thumb === 'min' ? 'dragging' : ''}`}
                      style={{
                        left: `${range.min}%`,
                        width: `${thumbMeta.width}px`,
                        height: `${thumbMeta.height}px`,
                        marginLeft: `-${thumbMeta.width / 2}px`,
                      }}
                      onMouseDown={e => startDrag(index, 'min', e)}
                      onTouchStart={e => startDrag(index, 'min', e)}
                      onMouseEnter={() => setHover({ index, thumb: 'min' })}
                      onMouseLeave={() => setHover(null)}
                      onKeyDown={e => handleKeyDown(index, 'min', e)}
                    >
                      <div
                        className={
                          dragging?.index === index && dragging?.thumb === 'min'
                            ? 'thumb-svg-large'
                            : hover?.index === index && hover?.thumb === 'min'
                            ? 'thumb-svg-hover'
                            : 'thumb-svg'
                        }
                        dangerouslySetInnerHTML={{
                          __html:
                            dragging?.index === index && dragging?.thumb === 'min'
                              ? THUMB_SVG.pressed
                              : hover?.index === index && hover?.thumb === 'min'
                              ? THUMB_SVG.hover
                              : THUMB_SVG.normal,
                        }}
                      />
                    </button>

                    {/* Max thumb */}
                    <button
                      type="button"
                      className={`range-thumb ${dragging?.index === index && dragging?.thumb === 'max' ? 'dragging' : ''}`}
                      style={{
                        left: `${range.max}%`,
                        width: `${thumbMeta.width}px`,
                        height: `${thumbMeta.height}px`,
                        marginLeft: `-${thumbMeta.width / 2}px`,
                      }}
                      onMouseDown={e => startDrag(index, 'max', e)}
                      onTouchStart={e => startDrag(index, 'max', e)}
                      onMouseEnter={() => setHover({ index, thumb: 'max' })}
                      onMouseLeave={() => setHover(null)}
                      onKeyDown={e => handleKeyDown(index, 'max', e)}
                    >
                      <div
                        className={
                          dragging?.index === index && dragging?.thumb === 'max'
                            ? 'thumb-svg-large'
                            : hover?.index === index && hover?.thumb === 'max'
                            ? 'thumb-svg-hover'
                            : 'thumb-svg'
                        }
                        dangerouslySetInnerHTML={{
                          __html:
                            dragging?.index === index && dragging?.thumb === 'max'
                              ? THUMB_SVG.pressed
                              : hover?.index === index && hover?.thumb === 'max'
                              ? THUMB_SVG.hover
                              : THUMB_SVG.normal,
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Max value box */}
                <div className="value-box-wrapper" style={{ height: size.height + 20 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -0.5 37 28"
                    shapeRendering="crispEdges"
                    className="value-box-svg"
                  >
                    <path stroke="#f3f3f3" d="M4 0h29M4 1h29M2 2h2M33 2h2M2 3h2M33 3h2M0 4h2M35 4h2M0 5h2M35 5h2M0 6h2M35 6h2M0 7h2M35 7h2M0 8h2M35 8h2M0 9h2M35 9h2M0 10h2M35 10h2M0 11h2M35 11h2M0 12h2M35 12h2M0 13h2M35 13h2M0 14h2M35 14h2M0 15h2M35 15h2M0 16h2M35 16h2M0 17h2M35 17h2M0 18h2M35 18h2M0 19h2M35 19h2M0 20h2M35 20h2M0 21h2M35 21h2M0 22h2M35 22h2M0 23h2M35 23h2M2 24h2M33 24h2M2 25h2M33 25h2M4 26h29M4 27h29" />
                    <path stroke="#191919" d="M4 2h29M4 3h29M2 4h33M2 5h33M2 6h33M2 7h33M2 8h33M2 9h33M2 10h33M2 11h33M2 12h33M2 13h33M2 14h33M2 15h33M2 16h33M2 17h33M2 18h33M2 19h33M2 20h33M2 21h33M2 22h33M2 23h33M4 24h29M4 25h29" />
                  </svg>
                  <span className="value-text">{range.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RangeSlider;
