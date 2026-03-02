import React from 'react';
import './index.css';
import TrackmaniaApp from './components/TrackmaniaApp';
import { ThemeProvider } from './components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <TrackmaniaApp />
        <Analytics />
      </div>
    </ThemeProvider>
  );
}

export default App;
