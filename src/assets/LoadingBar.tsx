import React, { useState } from 'react';
import './LoadingBar.css';

const LoadingBar: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('S');

  const sizeConfig = {
    S: { height: 16, label: '(S) h16px' },
    M: { height: 20, label: '(M) h20px' },
    L: { height: 24, label: '(L)h24px' },
    XL: { height: 28, label: '(XL)h28px' }
  };

  const loaderBarSVGs = {
    S: {
      viewBox: "0 -0.5 166 16",
      borderPath: "M4 0h158M4 1h158M2 2h2M162 2h2M2 3h2M162 3h2M0 4h2M164 4h2M0 5h2M164 5h2M0 6h2M164 6h2M0 7h2M164 7h2M0 8h2M164 8h2M0 9h2M164 9h2M0 10h2M164 10h2M0 11h2M164 11h2M2 12h2M162 12h2M2 13h2M162 13h2M4 14h158M4 15h158"
    },
    M: {
      viewBox: "0 -0.5 240 20",
      borderPath: "M4 0h232M4 1h232M2 2h2M236 2h2M2 3h2M236 3h2M0 4h2M238 4h2M0 5h2M238 5h2M0 6h2M238 6h2M0 7h2M238 7h2M0 8h2M238 8h2M0 9h2M238 9h2M0 10h2M238 10h2M0 11h2M238 11h2M0 12h2M238 12h2M0 13h2M238 13h2M0 14h2M238 14h2M0 15h2M238 15h2M2 16h2M236 16h2M2 17h2M236 17h2M4 18h232M4 19h232"
    },
    L: {
      viewBox: "0 -0.5 332 24",
      borderPath: "M4 0h324M4 1h324M2 2h2M328 2h2M2 3h2M328 3h2M0 4h2M330 4h2M0 5h2M330 5h2M0 6h2M330 6h2M0 7h2M330 7h2M0 8h2M330 8h2M0 9h2M330 9h2M0 10h2M330 10h2M0 11h2M330 11h2M0 12h2M330 12h2M0 13h2M330 13h2M0 14h2M330 14h2M0 15h2M330 15h2M0 16h2M330 16h2M0 17h2M330 17h2M0 18h2M330 18h2M0 19h2M330 19h2M2 20h2M328 20h2M2 21h2M328 21h2M4 22h324M4 23h324"
    },
    XL: {
      viewBox: "0 -0.5 412 28",
      borderPath: "M4 0h404M4 1h404M2 2h2M408 2h2M2 3h2M408 3h2M0 4h2M410 4h2M0 5h2M410 5h2M0 6h2M410 6h2M0 7h2M410 7h2M0 8h2M410 8h2M0 9h2M410 9h2M0 10h2M410 10h2M0 11h2M410 11h2M0 12h2M410 12h2M0 13h2M410 13h2M0 14h2M410 14h2M0 15h2M410 15h2M0 16h2M410 16h2M0 17h2M410 17h2M0 18h2M410 18h2M0 19h2M410 19h2M0 20h2M410 20h2M0 21h2M410 21h2M0 22h2M410 22h2M0 23h2M410 23h2M2 24h2M408 24h2M2 25h2M408 25h2M4 26h404M4 27h404"
    }
  };

  return (
    <div className="loading-bar-container">
      <h1 className="title">LDR 1.1 - Dynamic Loading Bar</h1>

      <div className="size-options">
        {Object.entries(sizeConfig).map(([key, config]) => (
          <div key={key} className="size-section">
            <button
              className={`size-button ${selectedSize === key ? 'active' : ''}`}
              onClick={() => setSelectedSize(key as 'S' | 'M' | 'L' | 'XL')}
            >
              {config.label}
            </button>
            <div className="loader-wrapper" style={{ height: config.height }}>
              {/* Loader lines BEHIND */}
              <svg
                className="loader-lines"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -0.5 46 20"
                shapeRendering="crispEdges"
                preserveAspectRatio="none"
                style={{ height: config.height }}
              >
                <path
                  stroke="#34c759"
                  d="M0 0h4M8 0h6M19 0h8M32 0h6M42 0h4M0 1h4M8 1h6M19 1h8M32 1h6M42 1h4M0 2h4M8 2h6M19 2h8M32 2h6M42 2h4M0 3h4M8 3h6M19 3h8M32 3h6M42 3h4M0 4h4M8 4h6M19 4h8M32 4h6M42 4h4M0 5h4M8 5h6M19 5h8M32 5h6M42 5h4M0 6h4M8 6h6M19 6h8M32 6h6M42 6h4M0 7h4M8 7h6M19 7h8M32 7h6M42 7h4M0 8h4M8 8h6M19 8h8M32 8h6M42 8h4M0 9h4M8 9h6M19 9h8M32 9h6M42 9h4M0 10h4M8 10h6M19 10h8M32 10h6M42 10h4M0 11h4M8 11h6M19 11h8M32 11h6M42 11h4M0 12h4M8 12h6M19 12h8M32 12h6M42 12h4M0 13h4M8 13h6M19 13h8M32 13h6M42 13h4M0 14h4M8 14h6M19 14h8M32 14h6M42 14h4M0 15h4M8 15h6M19 15h8M32 15h6M42 15h4M0 16h4M8 16h6M19 16h8M32 16h6M42 16h4M0 17h4M8 17h6M19 17h8M32 17h6M42 17h4M0 18h4M8 18h6M19 18h8M32 18h6M42 18h4M0 19h4M8 19h6M19 19h8M32 19h6M42 19h4M0 20h4M8 20h6M19 20h8M32 20h6M42 20h4M0 21h4M8 21h6M19 21h8M32 21h6M42 21h4M0 22h4M8 22h6M19 22h8M32 22h6M42 22h4M0 23h4M8 23h6M19 23h8M32 23h6M42 23h4"
                />
              </svg>

              {/* Loader bar ON TOP - Only border frame, transparent middle */}
              <svg
                className="loader-bar"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={loaderBarSVGs[key as 'S' | 'M' | 'L' | 'XL'].viewBox}
                shapeRendering="crispEdges"
                preserveAspectRatio="none"
                style={{ height: config.height }}
              >
                <path
                  stroke="#f3f3f3"
                  d={loaderBarSVGs[key as 'S' | 'M' | 'L' | 'XL'].borderPath}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingBar;
