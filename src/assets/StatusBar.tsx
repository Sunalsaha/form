import React, { useState, useEffect } from 'react';
import './StatusBar.css';

interface FileData {
  name: string;
  size: string;
  progress: number;
  timeLeft: string;
  isVisible: boolean;
}

const StatusBar: React.FC = () => {
  const [files, setFiles] = useState<{ [key: string]: FileData }>({
    S: { name: 'Design-Seed.fig', size: '27.3MB', progress: 0, timeLeft: '47s left', isVisible: true },
    M: { name: 'Design-Seed.fig', size: '27.3MB', progress: 0, timeLeft: '47s left', isVisible: true },
    L: { name: 'Design-Seed.fig', size: '27.3MB', progress: 0, timeLeft: '47s left', isVisible: true },
    XL: { name: 'Design-Seed.fig', size: '27.3MB', progress: 0, timeLeft: '47s left', isVisible: true }
  });

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].progress < 100 && updated[key].isVisible) {
            const newProgress = Math.min(updated[key].progress + 1, 100);
            const timeRemaining = Math.max(47 - Math.floor((newProgress / 100) * 47), 0);
            updated[key] = {
              ...updated[key],
              progress: newProgress,
              timeLeft: timeRemaining > 0 ? `${timeRemaining}s left` : 'Complete'
            };
          }
        });
        return updated;
      });
    }, 100); // Faster simulation

    return () => clearInterval(interval);
  }, []);

  const handleClose = (key: string) => {
    setFiles(prev => ({
      ...prev,
      [key]: { ...prev[key], isVisible: false }
    }));
  };

  // Matched sizes from SLIDE 1.1 code provided earlier
  const sizeConfig = {
    S: { 
      width: 225, // Matched "W 232 Px"
      height: 21, // Matched height
      label: 'S h 20 Px', 
      viewBox: '0 -0.5 232 24',
    },
    L: { 
      width: 228, // Matched "W 228 Px"
      height: 21, 
      label: 'L h 12 Px', 
      viewBox: '0 -0.5 228 12',
    },
    M: { 
      width: 260, // Matched "W 260 Px"
      height: 30, 
      label: 'M h 28 Px', 
      viewBox: '0 -0.5 260 28',
    },
    XL: { 
      width: 320, // Matched "W 320 Px"
      height: 32, 
      label: 'XL h 32 Px', 
      viewBox: '0 -0.5 320 32',
    }
  };

  const getProgressBarSVG = (key: string) => {
    // SVG Paths matched from HorizontalSliderTypes (Slide 1.1)
    const svgPaths = {
      S: {
        border: 'M4 6h224M4 7h224M2 8h2M228 8h2M2 9h2M228 9h2M2 10h2M228 10h2M2 11h2M228 11h2M2 12h2M228 12h2M2 13h2M228 13h2M2 14h2M228 14h2M2 15h2M228 15h2M4 16h224M4 17h224',
        innerY: 8,
        innerHeight: 8
      },
      L: {
        border: 'M2 0h224M2 1h224M0 2h2M226 2h2M0 3h2M226 3h2M0 4h2M226 4h2M0 5h2M226 5h2M0 6h2M226 6h2M0 7h2M226 7h2M0 8h2M226 8h2M0 9h2M226 9h2M2 10h224M2 11h224',
        innerY: 2,
        innerHeight: 8
      },
      M: {
        border: 'M4 6h250M4 7h250M2 8h2M254 8h2M2 9h2M254 9h2M0 10h2M256 10h2M0 11h2M256 11h2M0 12h2M256 12h2M0 13h2M256 13h2M0 14h2M256 14h2M0 15h2M256 15h2M0 16h2M256 16h2M0 17h2M256 17h2M2 18h2M254 18h2M2 19h2M254 19h2M4 20h250M4 21h250',
        innerY: 8,
        innerHeight: 12 
      },
      XL: {
        border: 'M6 6h308M6 7h308M4 8h2M314 8h2M4 9h2M314 9h2M2 10h2M316 10h2M2 11h2M316 11h2M2 12h2M316 12h2M2 13h2M316 13h2M2 14h2M316 14h2M2 15h2M316 15h2M2 16h2M316 16h2M2 17h2M316 17h2M2 18h2M316 18h2M2 19h2M316 19h2M2 20h2M316 20h2M2 21h2M316 21h2M4 22h2M314 22h2M4 23h2M314 23h2M6 24h308M6 25h308',
        innerY: 8,
        innerHeight: 16 
      }
    };
    return svgPaths[key as keyof typeof svgPaths];
  };

  return (
    <div className="status-bar-container">
      <h1 className="status-title">STBR 2.1 - Dynamic status bar 1</h1>

      <div className="status-grid">
        {Object.entries(sizeConfig).map(([key, config]) => {
          const fileData = files[key];
          if (!fileData.isVisible) return null;
          const svgData = getProgressBarSVG(key);

          const fillHeight = svgData.innerHeight;
          const fillTop = svgData.innerY;

          // Determine fill color based on completion
          const fillColor = fileData.progress >= 100 ? "#A1A1A1" : "#333";

          return (
            <div key={key} className="status-section">
              <div className="size-label">{config.label}</div>
              <div className="status-card">
                <div className="file-info">
                  <span className="file-name">{fileData.name}</span>
                  <span className="file-size">({fileData.size})</span>
                  <span className="progress-percent">{fileData.progress}%</span>
                  <span className="time-left">({fileData.timeLeft})</span>
                  <button
                    className="close-btn"
                    onClick={() => handleClose(key)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="progress-wrapper" style={{ width: `${config.width}px`, height: `${config.height}px` }}>
                  <div
                    className="progress-fill-container"
                    style={{
                      width: '100%',
                      height: '100%',
                      clipPath: `inset(0 ${100 - fileData.progress}% 0 0)`
                    }}
                  >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox={config.viewBox}
                        shapeRendering="crispEdges"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <rect x="2" y={fillTop} width={config.width - 4} height={fillHeight} fill={fillColor} />
                      </svg>
                  </div>

                  {/* The Border/Track SVG */}
                  <svg
                    className="progress-bar-border"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={config.viewBox}
                    shapeRendering="crispEdges"
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                  >
                    <path stroke="#f3f3f3" fill="none" d={svgData.border} />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusBar;
