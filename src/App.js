import React from 'react';
import './index.css';
import TrackmaniaApp from './components/TrackmaniaApp';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <TrackmaniaApp />
      </div>
    </ThemeProvider>
  );
}

export default App;
