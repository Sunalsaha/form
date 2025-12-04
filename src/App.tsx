import React from 'react';
import HorizontalSliderTypes from './assets/HorizontalSlider';
import VerticalSliderTypes from './assets/VerticalSliderTypes';
import LoadingBar from './assets/LoadingBar';
import StatusBar from './assets/StatusBar';
import RangeSlider from './assets/RangeSlider';
import NumberBox from './assets/NumberBox';
import HorizontalStepper from './assets/HorizontalQuestionForm';

const App: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#000000ff',
        color: '#fff',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          font-family: 'Pixelify Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
      
      <HorizontalSliderTypes />
      <VerticalSliderTypes />
      <LoadingBar />
      <StatusBar />
      <RangeSlider />
      <NumberBox />
      <HorizontalStepper />
    </div>
  );
};

export default App;
