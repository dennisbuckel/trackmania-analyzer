// src/TrackmaniaApp.js
import React, { useState, useEffect, useRef } from 'react';
import DataImportRevolutionary from './DataImportRevolutionary';
import PlayerLookup from './PlayerLookup';
import StatsOverviewRevolutionary from './StatsOverviewRevolutionary';
import ChartsSection from './ChartsSection';
import ResultsTable from './ResultsTable';
import ThemeSelector from './ThemeSelector';
import KeyboardShortcuts from './KeyboardShortcuts';
import parseTrackmaniaIoData from '../utils/parseTrackmaniaIoData';
import { getTranslation } from '../i18n/translations';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmModal';
import appLogo from '../assets/logo.png';

const TrackmaniaApp = () => {
  const [playerData, setPlayerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pasteAreaContent, setPasteAreaContent] = useState('');
  const [viewTransition, setViewTransition] = useState(false);
  
  // View state
  const [activeView, setActiveView] = useState('performance');
  const [timeRange, setTimeRange] = useState('all');
  
  // UX Enhancement states
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  // Import mode: 'auto' (player lookup) or 'manual' (paste data)
  const [importMode, setImportMode] = useState('auto');

  // Sticky header state
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  
  // Toast & Confirm hooks
  const toast = useToast();
  const confirm = useConfirm();
  
  // Language is now fixed to English
  const currentLanguage = 'en';
  const t = (key, params = {}) => getTranslation(key, currentLanguage, params);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Load data on first render
  useEffect(() => {
    const savedData = localStorage.getItem('trackmaniaData');
    
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
        // ignore parse errors
      }
    }
    
  }, []);

  // Smooth view transitions
  const transitionToView = (loaded) => {
    setViewTransition(true);
    setTimeout(() => {
      setIsDataLoaded(loaded);
      setTimeout(() => setViewTransition(false), 50);
    }, 200);
  };

  // Data processing callback
  const handleDataParsing = async (textData, parsedResults = null) => {
    try {
      let parsedData;
      if (parsedResults) {
        parsedData = parsedResults;
      } else {
        const result = parseTrackmaniaIoData(textData);
        parsedData = result.results;
      }

      if (parsedData.length > 0) {
        let newData;
        
        if (playerData.length > 0) {
          const shouldAppend = await confirm({
            title: 'Merge or Replace Data?',
            message: 'You already have existing data. Would you like to merge the new data with your existing entries, or replace everything?',
            confirmLabel: 'Merge Data',
            cancelLabel: 'Replace All',
            variant: 'info',
          });
          
          if (shouldAppend) {
            const existingDates = new Set(playerData.map(item => item.date));
            const uniqueNewData = parsedData.filter(item => !existingDates.has(item.date));
            newData = [...playerData, ...uniqueNewData].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (uniqueNewData.length > 0) {
              toast.success(`${uniqueNewData.length} new entries added! (${parsedData.length - uniqueNewData.length} duplicates skipped)`, {
                title: 'Data Merged Successfully',
              });
            } else {
              toast.info('All data was already present. No new entries added.', {
                title: 'No New Data',
              });
            }
          } else {
            newData = parsedData;
            toast.success(`${parsedData.length} entries successfully imported!`, {
              title: 'Data Replaced',
            });
          }
        } else {
          newData = parsedData;
          toast.success(`${parsedData.length} entries successfully imported!`, {
            title: 'Import Complete',
          });
        }
        
        setPlayerData(newData);
        setFilteredData(newData);
        transitionToView(true);
        localStorage.setItem('trackmaniaData', JSON.stringify(newData));
        setPasteAreaContent('');
        
        if (isFirstTime) {
          setIsFirstTime(false);
        }
      } else {
        toast.error('No valid data found. Please check the format and try again.', {
          title: 'Import Failed',
        });
      }
    } catch (err) {
      toast.error(`Error processing data: ${err.message}`, {
        title: 'Processing Error',
      });
    }
  };

  const clearAllData = async () => {
    const confirmed = await confirm({
      title: 'Delete All Data?',
      message: 'This will permanently remove all your COTD data from this browser. This action cannot be undone.',
      confirmLabel: 'Delete Everything',
      cancelLabel: 'Keep Data',
      variant: 'danger',
    });
    
    if (confirmed) {
      localStorage.removeItem('trackmaniaData');
      setPlayerData([]);
      setFilteredData([]);
      transitionToView(false);
      setPasteAreaContent('');
      toast.success('All data has been deleted.', { title: 'Data Cleared' });
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
      toast.warning('No data available to export.', { title: 'Export' });
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
    toast.success(`Exported ${playerData.length} entries as JSON.`, { title: 'Export Complete' });
  };

  // Quick Actions handler
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'add-data':
        transitionToView(false);
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
        if (playerData.length > 0) {
          const stats = `My COTD Stats: ${playerData.length} races, Avg Division ${(playerData.reduce((sum, item) => sum + (item.division || 10), 0) / playerData.length).toFixed(1)}`;
          if (navigator.share) {
            navigator.share({
              title: 'Trackmania COTD Stats',
              text: stats,
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(stats);
            toast.success('Statistics copied to clipboard!', { title: 'Copied' });
          }
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
        transitionToView(false);
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
        break;
      case 'refresh-data':
        const savedData = localStorage.getItem('trackmaniaData');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setPlayerData(parsed);
            setFilteredData(parsed);
            toast.info('Data refreshed from local storage.', { title: 'Refreshed' });
          } catch (error) {
            // ignore
          }
        }
        break;
      default:
        break;
    }
  };

  // Handle auto-fetched data from PlayerLookup
  const handleAutoFetchData = async (convertedData, playerName) => {
    if (!convertedData || convertedData.length === 0) {
      toast.error('No valid data received from the API.', { title: 'Fetch Failed' });
      return;
    }

    let newData;
    
    if (playerData.length > 0) {
      const shouldAppend = await confirm({
        title: 'Merge or Replace Data?',
        message: `You already have ${playerData.length} entries. Merge ${convertedData.length} new entries from ${playerName || 'player'}, or replace everything?`,
        confirmLabel: 'Merge Data',
        cancelLabel: 'Replace All',
        variant: 'info',
      });

      if (shouldAppend) {
        const existingDates = new Set(playerData.map(item => item.date));
        const uniqueNewData = convertedData.filter(item => !existingDates.has(item.date));
        newData = [...playerData, ...uniqueNewData].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (uniqueNewData.length > 0) {
          toast.success(`${uniqueNewData.length} new entries added for ${playerName || 'player'}! (${convertedData.length - uniqueNewData.length} duplicates skipped)`, {
            title: 'Data Merged',
          });
        } else {
          toast.info('All data was already present. No new entries added.', { title: 'No New Data' });
        }
      } else {
        newData = convertedData;
        toast.success(`${convertedData.length} entries imported for ${playerName || 'player'}!`, {
          title: 'Data Replaced',
        });
      }
    } else {
      newData = convertedData;
      toast.success(`${convertedData.length} entries imported for ${playerName || 'player'}!`, {
        title: 'Import Complete 🎉',
      });
    }

    setPlayerData(newData);
    setFilteredData(newData);
    transitionToView(true);
    localStorage.setItem('trackmaniaData', JSON.stringify(newData));

    if (isFirstTime) {
      setIsFirstTime(false);
    }
  };

  // Load sample data function
  const loadSampleData = () => {
    const sampleDataText = `Cup of the Day	Map	Division	Division Rank	Rank	Qualification
COTD 2025-07-26 #1

16 hours ago

Flow State	
12
1st / 46
705th / 2134 (top 33.04%)	761st / 2134 (top 35.66%)
COTD 2025-07-23 #1

4 days ago

Prohibit ft' speq	
16
12th / 45
972nd / 2319 (top 41.91%)	1,016th / 2319 (top 43.81%)
COTD 2025-07-22 #1

5 days ago

ক ft' cotton	
8
14th / 50
462nd / 2429 (top 19.02%)	450th / 2429 (top 18.53%)
COTD 2025-07-20 #1

7 days ago

Never Odd or Even ft Pepsy	
9
21st / 44
533rd / 2375 (top 22.44%)	548th / 2375 (top 23.07%)
COTD 2025-07-13 #1

14 days ago

Piece of Oblivion ft Quinn22b1	
9
27th / 53
539th / 2177 (top 24.76%)	573rd / 2177 (top 26.32%)
COTD 2025-07-07 #1

20 days ago

P1NO R1V13RA	
11
28th / 50
668th / 2512 (top 26.59%)	703rd / 2512 (top 27.99%)
COTD 2025-07-06 #1

21 days ago

wowie [ce] ft' Pac042	
13
11th / 48
779th / 2340 (top 33.29%)	816th / 2340 (top 34.87%)
COTD 2025-05-28 #1

2 months ago

Herzrasen kann man nicht mähen	
10
6th / 55
582nd / 2700 (top 21.56%)	599th / 2700 (top 22.19%)
COTD 2025-05-27 #1

2 months ago

Cream ft n1x	
6
31st / 46
351st / 2770 (top 12.67%)	342nd / 2770 (top 12.35%)
COTD 2025-05-26 #1

2 months ago

Porcelain	
12
6th / 46
710th / 3176 (top 22.36%)	745th / 3176 (top 23.46%)`;
    
    setPasteAreaContent(sampleDataText);
    toast.info('Sample data loaded into the paste area. Click "Process Data" to import.', { title: 'Sample Data Ready' });
  };

  // Get display data
  const displayData = filteredData.length > 0 ? filteredData : playerData;

  // Chart view configuration
  const chartViews = [
    { id: 'performance', label: 'Performance', icon: '📈', desc: 'Top % over time' },
    { id: 'division', label: 'Divisions', icon: '🏆', desc: 'Distribution' },
    { id: 'divisionProgress', label: 'Progress', icon: '📊', desc: 'Division trend' },
    { id: 'divisionRank', label: 'Div. Rank', icon: '🎯', desc: 'Position in div' },
    { id: 'totalPlayers', label: 'Players', icon: '👥', desc: 'Lobby sizes' },
  ];

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--color-backgroundGradient)' }}>
      
      {/* Keyboard Shortcuts - always active */}
      <KeyboardShortcuts onAction={handleKeyboardAction} />

      {/* Sticky Header */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 no-print ${
          isScrolled 
            ? 'py-2 shadow-lg' 
            : 'py-4'
        }`}
        style={{
          backgroundColor: isScrolled ? 'var(--color-glass)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--color-glassBorder)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={appLogo} 
              alt="COTD Analyzer" 
              className={`transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
            <div>
              <h1
                className={`font-bold transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-3xl'}`}
                style={{
                  background: `linear-gradient(to right, var(--color-gradientFrom), var(--color-gradientTo))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('title')}
              </h1>
              {!isScrolled && (
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-textSecondary)' }}>
                  {t('subtitle')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Stats in Header (when scrolled & data loaded) */}
            {isScrolled && isDataLoaded && (
              <div className="hidden md:flex items-center gap-3 mr-2">
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                  background: 'var(--color-glass)',
                  color: 'var(--color-textPrimary)',
                  border: '1px solid var(--color-glassBorder)',
                }}>
                  <span className="font-bold">{displayData.length}</span> races
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                  background: 'var(--color-glass)',
                  color: 'var(--color-textPrimary)',
                  border: '1px solid var(--color-glassBorder)',
                }}>
                  Avg Div <span className="font-bold">
                    {displayData.length > 0 ? (displayData.reduce((sum, item) => sum + (item.division || 10), 0) / displayData.length).toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            )}
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-6xl mx-auto px-4 pb-8 transition-all duration-300 ${viewTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        
        {/* Quick Stats Bar - below header when not scrolled */}
        {isDataLoaded && !isScrolled && (
          <div className="flex justify-center gap-4 mb-6 animate-fade-in-up">
            <div className="px-4 py-2 rounded-full text-sm font-medium hover-lift" style={{
              background: 'var(--color-glass)',
              backdropFilter: 'blur(10px)',
              color: 'var(--color-textPrimary)',
              border: '1px solid var(--color-glassBorder)',
            }}>
              <span className="font-bold">{displayData.length}</span> {t('races')}
            </div>
            <div className="px-4 py-2 rounded-full text-sm font-medium hover-lift" style={{
              background: 'var(--color-glass)',
              backdropFilter: 'blur(10px)',
              color: 'var(--color-textPrimary)',
              border: '1px solid var(--color-glassBorder)',
            }}>
              {t('avgDivision')} <span className="font-bold">
                {displayData.length > 0 ? (displayData.reduce((sum, item) => sum + (item.division || 10), 0) / displayData.length).toFixed(1) : 'N/A'}
              </span>
            </div>
            {filteredData.length !== playerData.length && (
              <div className="px-4 py-2 rounded-full text-sm font-medium" style={{
                backgroundColor: 'var(--color-info)',
                color: 'var(--color-textInverse)',
              }}>
                {t('filtered')}: {filteredData.length}/{playerData.length}
              </div>
            )}
          </div>
        )}

        {!isDataLoaded ? (
          /* ============ IMPORT VIEW ============ */
          <div className="pt-2">
            {/* Welcome Hero */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{
                background: 'var(--color-glass)',
                border: '1px solid var(--color-glassBorder)',
                color: 'var(--color-textSecondary)',
              }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Ready to analyze your performance
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                Import your COTD data to get started
              </h2>
              <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
                Enter your player name for automatic import, or paste data manually from{' '}
                <a href="https://trackmania.io" target="_blank" rel="noopener noreferrer"
                   className="underline font-medium" style={{ color: 'var(--color-primary)' }}>
                  trackmania.io
                </a>
              </p>
            </div>

            {/* Import Mode Tabs - Redesigned */}
            <div className="flex gap-1 p-1 rounded-2xl mb-6 mx-auto max-w-md animate-fade-in-up" style={{
              background: 'var(--color-backgroundSecondary)',
              border: '1px solid var(--color-border)',
            }}>
              <button
                onClick={() => setImportMode('auto')}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: importMode === 'auto' ? 'var(--color-surface)' : 'transparent',
                  color: importMode === 'auto' ? 'var(--color-textPrimary)' : 'var(--color-textMuted)',
                  boxShadow: importMode === 'auto' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <span>🔍</span>
                Auto-Fetch
                {importMode === 'auto' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{
                    backgroundColor: 'var(--color-success)',
                    color: 'white',
                  }}>REC</span>
                )}
              </button>
              <button
                onClick={() => setImportMode('manual')}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: importMode === 'manual' ? 'var(--color-surface)' : 'transparent',
                  color: importMode === 'manual' ? 'var(--color-textPrimary)' : 'var(--color-textMuted)',
                  boxShadow: importMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <span>📋</span>
                Manual Paste
              </button>
            </div>

            {/* Auto-Fetch Mode */}
            {importMode === 'auto' && (
              <div className="animate-fade-in-up">
                <PlayerLookup onDataLoaded={handleAutoFetchData} />
              </div>
            )}

            {/* Manual Paste Mode */}
            {importMode === 'manual' && (
              <div className="animate-fade-in-up">
                <div className="flex gap-3 mb-4">
                  <button 
                    onClick={loadSampleData} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-textPrimary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    🎯 Load Sample Data
                  </button>
                </div>
                <DataImportRevolutionary
                  pasteAreaContent={pasteAreaContent}
                  setPasteAreaContent={setPasteAreaContent}
                  onDataParsed={handleDataParsing}
                />
              </div>
            )}
          </div>
        ) : (
          /* ============ DASHBOARD VIEW ============ */
          <>
            {/* Action Bar */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3 animate-fade-in-up">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {t('yourAnalysis')}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => transitionToView(false)} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-textInverse)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Data
                </button>
                <button 
                  onClick={exportData} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-textPrimary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <button 
                  onClick={clearAllData} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-danger)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="stats-overview animate-fade-in-up">
              <StatsOverviewRevolutionary playerData={displayData} timeRange={timeRange} />
            </div>

            {/* Chart View Tabs - Redesigned */}
            <div className="rounded-2xl p-1.5 mb-6 animate-fade-in-up" style={{
              background: 'var(--color-backgroundSecondary)',
              border: '1px solid var(--color-border)',
            }}>
              <div className="flex flex-wrap gap-1">
                {chartViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className="flex-1 min-w-0 py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: activeView === view.id ? 'var(--color-surface)' : 'transparent',
                      color: activeView === view.id ? 'var(--color-textPrimary)' : 'var(--color-textMuted)',
                      boxShadow: activeView === view.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base">{view.icon}</span>
                      <span className="hidden sm:inline">{view.label}</span>
                    </div>
                    {activeView === view.id && (
                      <div className="text-[10px] mt-0.5 hidden sm:block" style={{ color: 'var(--color-textMuted)' }}>
                        {view.desc}
                      </div>
                    )}
                  </button>
                ))}
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
            
            {/* Footer */}
            <footer className="text-center text-sm mt-8 p-5 rounded-2xl animate-fade-in-up" style={{
              background: 'var(--color-glass)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--color-glassBorder)',
              color: 'var(--color-textMuted)',
            }}>
              <p className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t('dataStoredLocally')}
              </p>
              <p className="mt-1.5 text-xs opacity-75">{t('disclaimer')}</p>
            </footer>
          </>
        )}
      </main>

    </div>
  );
};

export default TrackmaniaApp;
