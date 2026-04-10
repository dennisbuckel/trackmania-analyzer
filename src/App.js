import React from 'react';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import TrackmaniaApp from './components/TrackmaniaApp';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/ConfirmModal';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <div className="App">
            <TrackmaniaApp />
          </div>
        </ConfirmProvider>
      </ToastProvider>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
