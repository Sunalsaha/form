import React, { useState } from 'react';
import './NumberBox.css';

interface NumberFormProps {
  size: 'S' | 'M' | 'L' | 'XL';
  question: string;
  stepNumber: number;
  onComplete?: () => void;
}

const TickIcon = ({ size }: { size: number }) => {
  // Removed unused 'scale' variable
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -0.5 28 28" 
      shapeRendering="crispEdges" 
      style={{ width: size, height: size }}
    >
      <path stroke="#34c759" d="M4 0h20M4 1h20M2 2h2M24 2h2M2 3h2M24 3h2M0 4h2M26 4h2M0 5h2M26 5h2M0 6h2M26 6h2M0 7h2M26 7h2M0 8h2M26 8h2M0 9h2M18 9h1M26 9h2M0 10h2M17 10h2M26 10h2M0 11h2M16 11h2M26 11h2M0 12h2M15 12h2M26 12h2M0 13h2M14 13h2M26 13h2M0 14h2M8 14h2M13 14h2M26 14h2M0 15h2M9 15h2M12 15h2M26 15h2M0 16h2M10 16h3M26 16h2M0 17h2M11 17h1M26 17h2M0 18h2M26 18h2M0 19h2M26 19h2M0 20h2M26 20h2M0 21h2M26 21h2M0 22h2M26 22h2M0 23h2M26 23h2M2 24h2M24 24h2M2 25h2M24 25h2M4 26h20M4 27h20" />
      <path stroke="#262626" d="M4 2h20M4 3h20M2 4h24M2 5h24M2 6h24M2 7h24M2 8h24M2 9h15M20 9h6M2 10h14M20 10h6M2 11h13M19 11h7M2 12h12M18 12h8M2 13h6M10 13h3M17 13h9M2 14h6M11 14h1M16 14h10M2 15h6M15 15h11M2 16h7M14 16h12M2 17h8M13 17h13M2 18h9M12 18h14M2 19h24M2 20h24M2 21h24M2 22h24M2 23h24M4 24h20M4 25h20" />
      <path stroke="#283a2c" d="M17 9h1M16 10h1M15 11h1M8 13h2M10 14h1" />
      <path stroke="#309f4c" d="M19 9h1M19 10h1M18 11h1M17 12h1M16 13h1M15 14h1M14 15h1M13 16h1M12 17h1M11 18h1" />
      <path stroke="#2a4e33" d="M14 12h1M13 13h1M12 14h1M11 15h1" />
      <path stroke="#32b353" d="M8 15h1M9 16h1M10 17h1" />
    </svg>
  );
};

const NumberForm: React.FC<NumberFormProps> = ({ size, question, stepNumber, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const sizeConfig = {
    S: { fontSize: '12px', height: '28px', svgSize: 28, inputHeight: '20px', inputFont: '12px', tickSize: 28 },
    M: { fontSize: '16px', height: '36px', svgSize: 36, inputHeight: '26px', inputFont: '16px', tickSize: 36 },
    L: { fontSize: '20px', height: '44px', svgSize: 44, inputHeight: '32px', inputFont: '20px', tickSize: 44 },
    XL: { fontSize: '24px', height: '54px', svgSize: 54, inputHeight: '38px', inputFont: '24px', tickSize: 54 }
  };
  const config = sizeConfig[size];
  
  const isTextGreen = isHovered || isInputHovered || isActive || isCompleted;
  const isBorderGreen = isActive || isCompleted;

  const handleFocus = () => {
    setIsActive(true);
    setIsHovered(false);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    if (value.trim().length > 0 && !isCompleted) {
      setIsCompleted(true);
      onComplete?.();
    }
    if (value.trim().length === 0 && isCompleted) {
      setIsCompleted(false);
    }
  };

  return (
    <div className={`form-row ${size}`}>
      {!isCompleted ? (
        <div
          className="number-box"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -0.5 28 28"
            shapeRendering="crispEdges"
            className={`svg-box ${size}`}
            style={{ width: config.svgSize, height: config.svgSize }}
          >
            <path
              className="box-stroke-light"
              stroke={isBorderGreen ? '#34C759' : '#f3f3f3'}
              d="M4 0h20M4 1h20M2 2h2M24 2h2M2 3h2M24 3h2M0 4h2M26 4h2M0 5h2M26 5h2M0 6h2M26 6h2M0 7h2M26 7h2M0 8h2M26 8h2M0 9h2M26 9h2M0 10h2M26 10h2M0 11h2M26 11h2M0 12h2M26 12h2M0 13h2M26 13h2M0 14h2M26 14h2M0 15h2M26 15h2M0 16h2M26 16h2M0 17h2M26 17h2M0 18h2M26 18h2M0 19h2M26 19h2M0 20h2M26 20h2M0 21h2M26 21h2M0 22h2M26 22h2M0 23h2M26 23h2M2 24h2M24 24h2M2 25h2M24 25h2M4 26h20M4 27h20"
            />
            <path
              className="box-stroke-dark"
              stroke="#191919"
              d="M4 2h20M4 3h20M2 4h24M2 5h24M2 6h24M2 7h24M2 8h24M2 9h24M2 10h24M2 11h24M2 12h24M2 13h24M2 14h24M2 15h24M2 16h24M2 17h24M2 18h24M2 19h24M2 20h24M2 21h24M2 22h24M2 23h24M4 24h20M4 25h20"
            />
          </svg>
          <span className={`number ${size} ${isTextGreen ? 'green-text' : ''}`}>
            {stepNumber}
          </span>
        </div>
      ) : (
        <div className="number-box" style={{ width: config.svgSize, height: config.svgSize, minWidth: config.svgSize }}>
          <TickIcon size={config.tickSize} />
        </div>
      )}

      <div
        className={`content-row ${size}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="question-wrapper">
          <span
            className={`label-text ${size} no-bg${isTextGreen ? ' green-text' : ''}`}
          >
            {question}
          </span>
          <div className={`question-underline ${size}${isActive && !isCompleted ? ' active' : ''}`} />
        </div>

        <div
          className="input-wrapper-inline"
          onMouseEnter={() => setIsInputHovered(true)}
          onMouseLeave={() => setIsInputHovered(false)}
        >
          <div className={`underline ${size}${isBorderGreen ? ' active' : ''}`} />
          <input
            type="text"
            value={answer}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`answer-input ${size}${isTextGreen ? ' green-text' : ''}`}
            style={{
              height: config.inputHeight,
              fontSize: config.inputFont,
              fontFamily: "'Pixeloid Sans', sans-serif"
            }}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
};

const QuestionForm: React.FC = () => {
  const questions = [
    "Lebel 1",
    "Lebel 2",
    "Lebel 3",
    "Lebel 4"
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Stepper with Progress indicator Horizontal</h2>
      <NumberForm size="S" question={questions[0]} stepNumber={1} />
      <NumberForm size="M" question={questions[1]} stepNumber={2} />
      <NumberForm size="L" question={questions[2]} stepNumber={3} />
      <NumberForm size="XL" question={questions[3]} stepNumber={4} />
    </div>
  );
};

export default QuestionForm;
