// src/TrackmaniaApp.js
import React, { useState, useEffect } from 'react';
import DataImport from './DataImport';
import StatsOverview from './StatsOverview';
import ChartsSection from './ChartsSection';
import ResultsTable from './ResultsTable';
import MapTypeManager from './MapTypeManager';
import OnboardingTour from './OnboardingTour';
import SmartNotifications from './SmartNotifications';
import QuickActions from './QuickActions';
import AdvancedSearch from './AdvancedSearch';
import KeyboardShortcuts from './KeyboardShortcuts';
import parseTrackmaniaData from '../utils/parseTrackmaniaData';

const TrackmaniaApp = () => {
  const [playerData, setPlayerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pasteAreaContent, setPasteAreaContent] = useState('');
  
  // View state
  const [activeView, setActiveView] = useState('performance');
  const [timeRange, setTimeRange] = useState('all');
  const [showInfo, setShowInfo] = useState(false);
  
  // UX Enhancement states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  // Load data on first render
  useEffect(() => {
    const savedData = localStorage.getItem('trackmaniaData');
    const hasSeenOnboarding = localStorage.getItem('cotd-onboarding-seen');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.length > 0) {
          setPlayerData(parsed);
          setFilteredData(parsed);
          setIsDataLoaded(true);
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    
    // Show onboarding for first-time users
    if (!hasSeenOnboarding && !savedData) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, []);

  // Data processing callback
  const handleDataParsing = (textData) => {
    try {
      const parsedData = parseTrackmaniaData(textData);
      if (parsedData.length > 0) {
        const isAppending = playerData.length > 0 && window.confirm(
          'Möchtest du diese Daten zu deinen bestehenden Daten hinzufügen? Klicke "Abbrechen" um alle aktuellen Daten zu ersetzen.'
        );
        
        let newData;
        if (isAppending) {
          const existingDates = new Set(playerData.map(item => item.date));
          const uniqueNewData = parsedData.filter(item => !existingDates.has(item.date));
          newData = [...playerData, ...uniqueNewData].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
          newData = parsedData;
        }
        
        setPlayerData(newData);
        setFilteredData(newData);
        setIsDataLoaded(true);
        localStorage.setItem('trackmaniaData', JSON.stringify(newData));
        setPasteAreaContent('');
        
        // Show success notification
        if (isFirstTime) {
          setIsFirstTime(false);
        }
      } else {
        alert('Keine gültigen Daten gefunden. Bitte überprüfe das Format.');
      }
    } catch (err) {
      alert('Fehler beim Verarbeiten der Daten: ' + err.message);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Bist du sicher, dass du alle Daten löschen möchtest?')) {
      localStorage.removeItem('trackmaniaData');
      setPlayerData([]);
      setFilteredData([]);
      setIsDataLoaded(false);
      setPasteAreaContent('');
    }
  };
  
  // Update player data (used for map type updates)
  const updatePlayerData = (newPlayerData) => {
    setPlayerData(newPlayerData);
    setFilteredData(newPlayerData);
    localStorage.setItem('trackmaniaData', JSON.stringify(newPlayerData));
  };

  const exportData = () => {
    if (playerData.length === 0) {
      alert('Keine Daten zum Exportieren verfügbar.');
      return;
    }
    
    const dataStr = JSON.stringify(playerData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackmania-cotd-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Quick Actions handler
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'add-data':
        setIsDataLoaded(false);
        break;
      case 'export-data':
        exportData();
        break;
      case 'view-trends':
        setActiveView('performance');
        document.querySelector('.charts-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'best-performance':
        setActiveView('performance');
        setTimeRange('all');
        break;
      case 'map-analysis':
        setActiveView('division');
        break;
      case 'share-stats':
        if (navigator.share && playerData.length > 0) {
          const stats = `Meine COTD Stats: ${playerData.length} Rennen, Ø Division ${(playerData.reduce((sum, item) => sum + (item.division || 10), 0) / playerData.length).toFixed(1)}`;
          navigator.share({
            title: 'Trackmania COTD Stats',
            text: stats,
            url: window.location.href
          });
        } else {
          // Fallback: copy to clipboard
          const stats = `Meine COTD Stats: ${playerData.length} Rennen, Ø Division ${(playerData.reduce((sum, item) => sum + (item.division || 10), 0) / playerData.length).toFixed(1)}`;
          navigator.clipboard.writeText(stats);
          alert('Statistiken in die Zwischenablage kopiert!');
        }
        break;
      default:
        break;
    }
  };

  // Keyboard Shortcuts handler
  const handleKeyboardAction = (action, param) => {
    switch (action) {
      case 'open-search':
        setShowAdvancedSearch(true);
        break;
      case 'add-data':
        setIsDataLoaded(false);
        break;
      case 'export-data':
        exportData();
        break;
      case 'delete-data':
        clearAllData();
        break;
      case 'set-view':
        setActiveView(param);
        break;
      case 'close-dialogs':
        setShowAdvancedSearch(false);
        setShowOnboarding(false);
        break;
      case 'refresh-data':
        // Reload data from localStorage
        const savedData = localStorage.getItem('trackmaniaData');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setPlayerData(parsed);
            setFilteredData(parsed);
          } catch (error) {
            console.error('Error reloading data:', error);
          }
        }
        break;
      default:
        break;
    }
  };

  // Advanced Search handler
  const handleAdvancedFilter = (filtered) => {
    setFilteredData(filtered);
    setShowAdvancedSearch(false);
  };

  // Onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('cotd-onboarding-seen', 'true');
  };

  // Get display data (filtered or original)
  const displayData = filteredData.length > 0 ? filteredData : playerData;

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-shadow">
            Trackmania COTD Analyzer
          </h1>
          <p className="text-gray-600 text-lg">Analysiere deine Cup of the Day Performance wie ein Profi</p>
          
          {/* Quick Stats Bar */}
          {isDataLoaded && (
            <div className="mt-4 flex justify-center space-x-6 text-sm animate-slide-in-right">
              <div className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full hover-lift">
                <span className="font-medium">{displayData.length}</span> Rennen
              </div>
              <div className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full hover-lift">
                Ø Division <span className="font-medium">
                  {displayData.length > 0 ? (displayData.reduce((sum, item) => sum + (item.division || 10), 0) / displayData.length).toFixed(1) : 'N/A'}
                </span>
              </div>
              {filteredData.length !== playerData.length && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full animate-pulse-slow">
                  Gefiltert: {filteredData.length}/{playerData.length}
                </div>
              )}
            </div>
          )}
        </header>

        {!isDataLoaded ? (
          <>
            <div className="card-glass p-6 mb-4 data-import-area animate-fade-in-up">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Willkommen zum COTD Analyzer! 🏁</h2>
              <p className="mb-3 text-gray-600 leading-relaxed">
                Füge deine Trackmania COTD-Daten ein und erhalte detaillierte Analysen deiner Performance.
                Kopiere deine Ergebnisse aus dem Spiel oder von trackmania.io und füge sie unten ein.
              </p>
              <button 
                onClick={() => setShowInfo(!showInfo)} 
                className="text-blue-600 hover:text-blue-800 underline mb-4 transition-colors interactive"
              >
                {showInfo ? 'Anleitung ausblenden' : 'Anleitung anzeigen'} 📖
              </button>
              
              {showInfo && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-slide-in-left">
                  <h3 className="font-semibold mb-3 text-blue-800">So verwendest du den COTD Analyzer:</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                    <li>Gehe zu deinem Trackmania-Profil</li>
                    <li>Navigiere zu deinen Cup of the Day Ergebnissen</li>
                    <li>Markiere und kopiere die Ergebnisse (Strg+C/Cmd+C)</li>
                    <li>Füge sie in das Textfeld unten ein</li>
                    <li>Klicke auf "Daten verarbeiten"</li>
                  </ol>
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      🔒 <strong>Datenschutz:</strong> Deine Daten werden nur lokal in deinem Browser gespeichert und niemals an einen Server übertragen.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <DataImport
              pasteAreaContent={pasteAreaContent}
              setPasteAreaContent={setPasteAreaContent}
              onDataParsed={handleDataParsing}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 animate-fade-in-up">
              <h2 className="text-2xl font-semibold text-gray-800">Deine COTD Analyse</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAdvancedSearch(true)} 
                  className="btn-secondary flex items-center gap-1 hover-glow"
                >
                  🔍 Erweiterte Suche
                </button>
                <button 
                  onClick={() => setIsDataLoaded(false)} 
                  className="btn-primary"
                >
                  ➕ Daten hinzufügen
                </button>
                <MapTypeManager playerData={playerData} updatePlayerData={updatePlayerData} />
                <button 
                  onClick={exportData} 
                  className="btn-success"
                >
                  📤 Export
                </button>
                <button 
                  onClick={clearAllData} 
                  className="btn-danger"
                >
                  🗑️ Löschen
                </button>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="stats-overview animate-fade-in-up">
              <StatsOverview playerData={displayData} timeRange={timeRange} />
            </div>

            {/* Chart View Selection */}
            <div className="card-glass p-4 mb-6 animate-fade-in-up">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Analyse-Ansichten</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveView('performance')} 
                  className={`${activeView === 'performance' ? 'bg-blue-600 text-white shadow-lg animate-glow' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive`}
                >
                  📈 Performance
                </button>
                <button 
                  onClick={() => setActiveView('division')} 
                  className={`${activeView === 'division' ? 'bg-blue-600 text-white shadow-lg animate-glow' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive`}
                >
                  🏆 Division Verteilung
                </button>
                <button 
                  onClick={() => setActiveView('divisionProgress')} 
                  className={`${activeView === 'divisionProgress' ? 'bg-blue-600 text-white shadow-lg animate-glow' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive`}
                >
                  📊 Division Verlauf
                </button>
                <button 
                  onClick={() => setActiveView('points')} 
                  className={`${activeView === 'points' ? 'bg-blue-600 text-white shadow-lg animate-glow' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive`}
                >
                  ⭐ Punkte Verlauf
                </button>
                <button 
                  onClick={() => setActiveView('divisionRank')} 
                  className={`${activeView === 'divisionRank' ? 'bg-blue-600 text-white shadow-lg animate-glow' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive`}
                >
                  🎯 Division Rang
                </button>
              </div>
            </div>
            
            {/* Charts */}
            <div className="charts-section animate-fade-in-up">
              <ChartsSection 
                playerData={displayData} 
                activeView={activeView} 
                timeRange={timeRange} 
                setTimeRange={setTimeRange} 
              />
            </div>

            {/* Results Table */}
            <div className="results-table animate-fade-in-up">
              <ResultsTable playerData={displayData} />
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-8 card-glass p-4 animate-fade-in-up">
              <p>🔒 Deine Daten werden lokal in deinem Browser gespeichert. Nutze die Export-Funktion für ein Backup.</p>
              <p className="mt-1">Trackmania COTD Analyzer ist ein inoffizielles Tool und steht in keiner Verbindung zu Ubisoft oder Nadeo.</p>
            </div>
          </>
        )}
      </div>

      {/* UX Enhancement Components */}
      <OnboardingTour 
        isVisible={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      <SmartNotifications 
        playerData={playerData} 
        onDismiss={() => {}} 
      />
      
      <QuickActions 
        playerData={playerData} 
        onAction={handleQuickAction} 
      />
      
      <AdvancedSearch 
        playerData={playerData}
        onFilter={handleAdvancedFilter}
        isVisible={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
      />
      
      <KeyboardShortcuts 
        onAction={handleKeyboardAction}
      />
    </div>
  );
};

export default TrackmaniaApp;
