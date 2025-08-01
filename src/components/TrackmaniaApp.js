// src/TrackmaniaApp.js
import React, { useState, useEffect } from 'react';
import DataImportRevolutionary from './DataImportRevolutionary';
import StatsOverviewRevolutionary from './StatsOverviewRevolutionary';
import ChartsSection from './ChartsSection';
import ResultsTable from './ResultsTable';
import VisualStepGuide from './VisualStepGuide';
import ThemeSelector from './ThemeSelector';
import parseTrackmaniaIoData from '../utils/parseTrackmaniaIoData';
import { getTranslation } from '../i18n/translations';

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
  
  // Language is now fixed to English
  const currentLanguage = 'en';
  const t = (key, params = {}) => getTranslation(key, currentLanguage, params);
  
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
      }
    }
    
    // Show onboarding for first-time users
    if (!hasSeenOnboarding && !savedData) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, []);

  // Data processing callback - Revolutionary approach
  const handleDataParsing = (textData, parsedResults = null) => {
    try {
      // If parsed results were already passed (from the revolutionary component)
      let parsedData;
      if (parsedResults) {
        parsedData = parsedResults;
      } else {
        // Fallback: Use the revolutionary parser
        const result = parseTrackmaniaIoData(textData);
        parsedData = result.results;
      }

      if (parsedData.length > 0) {
        const isAppending = playerData.length > 0 && window.confirm(
          '🔄 Do you want to add the new data to your existing data? (Cancel = Replace all)'
        );
        
        let newData;
        if (isAppending) {
          const existingDates = new Set(playerData.map(item => item.date));
          const uniqueNewData = parsedData.filter(item => !existingDates.has(item.date));
          newData = [...playerData, ...uniqueNewData].sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // Show statistics about added data
          if (uniqueNewData.length > 0) {
            alert(`✅ ${uniqueNewData.length} new entries added! (${parsedData.length - uniqueNewData.length} duplicates skipped)`);
          } else {
            alert('ℹ️ All data was already present. No new entries added.');
          }
        } else {
          newData = parsedData;
          alert(`✅ ${parsedData.length} entries successfully imported!`);
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
        alert('❌ No valid data found. Please check the format.');
      }
    } catch (err) {
      alert(`❌ Error processing data: ${err.message}`);
    }
  };

  const clearAllData = () => {
    if (window.confirm(t('confirmDelete'))) {
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
      alert(t('noDataToExport'));
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
          const stats = `My COTD Stats: ${playerData.length} races, Avg Division ${(playerData.reduce((sum, item) => sum + (item.division || 10), 0) / playerData.length).toFixed(1)}`;
          navigator.share({
            title: 'Trackmania COTD Stats',
            text: stats,
            url: window.location.href
          });
        } else {
          // Fallback: copy to clipboard
          const stats = `My COTD Stats: ${playerData.length} races, Avg Division ${(playerData.reduce((sum, item) => sum + (item.division || 10), 0) / playerData.length).toFixed(1)}`;
          navigator.clipboard.writeText(stats);
          alert(t('statsCopied'));
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

  // Load sample data function
  const loadSampleData = async () => {
    try {
      // Sample data from the dataexample file
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
710th / 3176 (top 22.36%)	745th / 3176 (top 23.46%)
COTD 2025-05-22 #1

2 months ago

Nature's Flow	
14
24th / 42
856th / 2937 (top 29.15%)	880th / 2937 (top 29.96%)
COTD 2025-05-21 #1

2 months ago

Castles in the Sand	
11
37th / 48
677th / 2847 (top 23.78%)	665th / 2847 (top 23.36%)
COTD 2025-05-19 #1

2 months ago

Before	
10
15th / 43
591st / 3041 (top 19.43%)	598th / 3041 (top 19.66%)
COTD 2025-05-18 #1

2 months ago

Brush Tech	
10
13th / 51
589th / 2974 (top 19.80%)	594th / 2974 (top 19.97%)
COTD 2025-05-17 #1

2 months ago

Fraction ft' djabski	
15
2nd / 52
898th / 2462 (top 36.47%)	956th / 2462 (top 38.83%)
COTD 2025-05-16 #1

2 months ago

Icarus Ascent ft Tailgrab	
14
22nd / 54
854th / 2485 (top 34.37%)	835th / 2485 (top 33.60%)
COTD 2025-05-15 #1

2 months ago

toffee ft' sqlc	
8
28th / 43
476th / 2809 (top 16.95%)	469th / 2809 (top 16.70%)
COTD 2025-05-12 #1

2 months ago

Castral Roc ft' Svendsenz	
19
1st / 45
1,153rd / 2830 (top 40.74%)	1,198th / 2830 (top 42.33%)
COTD 2025-05-11 #1

3 months ago

Summer's End	
9
36th / 46
548th / 2927 (top 18.72%)	513th / 2927 (top 17.53%)
COTD 2025-05-06 #1

3 months ago

MetBiDuoDi Ft Oclavukixus	
16
14th / 52
974th / 3130 (top 31.12%)	975th / 3130 (top 31.15%)
COTD 2025-05-05 #1

3 months ago

PIORITE	
11
24th / 50
664th / 2937 (top 22.61%)	671st / 2937 (top 22.85%)
COTD 2025-05-04 #1

3 months ago

Nothing Back the Way We Came	
5
23rd / 53
279th / 3102 (top 8.99%)	299th / 3102 (top 9.64%)
COTD 2025-05-03 #1

3 months ago

ネコトピア - Nekotopia	
18
38th / 49
1,126th / 2473 (top 45.53%)	1,150th / 2473 (top 46.50%)
COTD 2025-05-02 #1

3 months ago

Sunrise, Parabellum	
13
21st / 46
789th / 2477 (top 31.85%)	820th / 2477 (top 33.10%)
COTD 2025-05-01 #1

3 months ago

BackwΛՐds	
21
48th / 52
1,328th / 3168 (top 41.92%)	1,306th / 3168 (top 41.22%)
COTD 2025-04-30 #1

3 months ago

Caught ft Cotton	
8
21st / 54
469th / 2490 (top 18.84%)	469th / 2490 (top 18.84%)
COTD 2025-04-29 #1

3 months ago

2v2 Save Me	
6
18th / 53
338th / 2678 (top 12.62%)	361st / 2678 (top 13.48%)
COTD 2025-04-28 #1

3 months ago

INTERSTELLAR	
12
12th / 44
716th / 2790 (top 25.66%)	726th / 2790 (top 26.02%)
COTD 2025-04-25 #1

3 months ago

Ascend - Code Red	
12
22nd / 52
726th / 2308 (top 31.46%)	723rd / 2308 (top 31.33%)
COTD 2025-04-24 #1

3 months ago

Vreden ft' Fecot	
13
16th / 50
784th / 2878 (top 27.24%)	786th / 2878 (top 27.31%)
COTD 2025-04-23 #1

3 months ago

Poltergeist [CE]	
17
12th / 45
1,036th / 2898 (top 35.75%)	1,060th / 2898 (top 36.58%)
COTD 2025-04-22 #1

3 months ago

DuckSlide	
16
8th / 47
968th / 2930 (top 33.04%)	1,024th / 2930 (top 34.95%)
COTD 2025-04-18 #1

3 months ago

Rabbit hideout ft'Keissla	
16
8th / 51
968th / 2532 (top 38.23%)	966th / 2532 (top 38.15%)
COTD 2025-04-17 #1

3 months ago

BileBale	
14
7th / 48
839th / 2538 (top 33.06%)	866th / 2538 (top 34.12%)
COTD 2025-03-19 #1

4 months ago

Miramar	
17
33rd / 45
1,057th / 2440 (top 43.32%)	1,038th / 2440 (top 42.54%)
COTD 2025-03-18 #1

4 months ago

Blue Morpho	
14
10th / 40
842nd / 2493 (top 33.77%)	889th / 2493 (top 35.66%)
COTD 2025-03-17 #1

4 months ago

Summer '23	
16
7th / 41
967th / 2651 (top 36.48%)	971st / 2651 (top 36.63%)
COTD 2025-03-15 #1

4 months ago

Cataclysm	
12
14th / 50
718th / 2056 (top 34.92%)	735th / 2056 (top 35.75%)
COTD 2025-03-13 #1

4 months ago

Flower Gardener	
13
39th / 46
807th / 2418 (top 33.37%)	797th / 2418 (top 32.96%)
COTD 2025-03-12 #1

5 months ago

rj soup ft' cotton!	
15
6th / 52
902nd / 2328 (top 38.75%)	960th / 2328 (top 41.24%)
COTD 2025-03-11 #1

5 months ago

SolSvidd	
8
50th / 53
498th / 2425 (top 20.54%)	487th / 2425 (top 20.08%)
COTD 2025-03-10 #1

5 months ago

TrES-2 b	
9
19th / 41
531st / 2531 (top 20.98%)	549th / 2531 (top 21.69%)
COTD 2025-03-09 #1

5 months ago

Solivian	
11
20th / 47
660th / 2449 (top 26.95%)	696th / 2449 (top 28.42%)
COTD 2025-03-07 #1

5 months ago

CONCENTRIC	
11
5th / 50
645th / 2207 (top 29.23%)	666th / 2207 (top 30.18%)
COTD 2025-03-06 #1

5 months ago

FREYR	
9
31st / 50
543rd / 2353 (top 23.08%)	560th / 2353 (top 23.80%)
COTD 2025-03-05 #1

5 months ago

VFX realm ft'link	
14
18th / 49
850th / 2251 (top 37.76%)	888th / 2251 (top 39.45%)
COTD 2025-03-04 #1

5 months ago

Want to sleep until June	
8
5th / 44
453rd / 2281 (top 19.86%)	462nd / 2281 (top 20.25%)
COTD 2025-03-03 #1

5 months ago

ULTRAMARINE	
12
24th / 45
728th / 2405 (top 30.27%)	760th / 2405 (top 31.60%)
COTD 2025-03-02 #1

5 months ago

Geisterkrank	
9
4th / 46
516th / 2166 (top 23.82%)	572nd / 2166 (top 26.41%)
COTD 2025-03-01 #1

5 months ago

RALLY DOINKS²	
8
38th / 52
486th / 1839 (top 26.43%)	454th / 1839 (top 24.69%)
COTD 2025-02-28 #1

5 months ago

SKY DUST	
11
4th / 52
644th / 2072 (top 31.08%)	682nd / 2072 (top 32.92%)
COTD 2025-02-23 #1

5 months ago

OBISS	
14
2nd / 49
834th / 2428 (top 34.35%)	867th / 2428 (top 35.71%)
COTD 2025-02-22 #1

5 months ago

boenies-24_08	
11
4th / 53
644th / 2124 (top 30.32%)	687th / 2124 (top 32.34%)
COTD 2025-02-21 #1

5 months ago

C6S1-14 SEASIDE	
10
34th / 47
610th / 2266 (top 26.92%)	601st / 2266 (top 26.52%)
COTD 2025-02-20 #1

5 months ago

Blue Cream Sundae	
9
39th / 46
551st / 2321 (top 23.74%)	566th / 2321 (top 24.39%)
COTD 2025-02-19 #1

5 months ago

On the edge of grip Ft' Cotton	
9
37th / 51
549th / 2296 (top 23.91%)	518th / 2296 (top 22.56%)
COTD 2025-02-17 #1

5 months ago

SEOTERIA	
19
34th / 49
1,186th / 2327 (top 50.97%)	1,206th / 2327 (top 51.83%)
COTD 2025-02-16 #1

5 months ago

Crazy City	
7
24th / 51
408th / 1794 (top 22.74%)	436th / 1794 (top 24.30%)`;

      // Parse the sample data using the existing parser
      const result = parseTrackmaniaIoData(sampleDataText);
      
      if (result.results && result.results.length > 0) {
        // Ask user if they want to replace existing data or append
        const shouldReplace = playerData.length === 0 || window.confirm(
          `🎯 Load ${result.results.length} sample entries?\n\n` +
          (playerData.length > 0 
            ? 'This will replace your current data. Click OK to replace, Cancel to append to existing data.'
            : 'This will load sample data to demonstrate the analyzer features.')
        );
        
        let newData;
        if (shouldReplace || playerData.length === 0) {
          newData = result.results;
          alert(`✅ ${result.results.length} sample entries loaded successfully!`);
        } else {
          // Append mode - avoid duplicates
          const existingDates = new Set(playerData.map(item => item.date));
          const uniqueNewData = result.results.filter(item => !existingDates.has(item.date));
          newData = [...playerData, ...uniqueNewData].sort((a, b) => new Date(b.date) - new Date(a.date));
          
          if (uniqueNewData.length > 0) {
            alert(`✅ ${uniqueNewData.length} new sample entries added! (${result.results.length - uniqueNewData.length} duplicates skipped)`);
          } else {
            alert('ℹ️ All sample data was already present. No new entries added.');
          }
        }
        
        setPlayerData(newData);
        setFilteredData(newData);
        setIsDataLoaded(true);
        localStorage.setItem('trackmaniaData', JSON.stringify(newData));
        setIsFirstTime(false);
      } else {
        alert('❌ Error loading sample data. Please try again.');
      }
    } catch (error) {
      alert('❌ Error loading sample data. Please try again.');
    }
  };

  // Get display data (filtered or original)
  const displayData = filteredData.length > 0 ? filteredData : playerData;

  return (
    <div className="p-4 min-h-screen relative" style={{ background: 'var(--color-backgroundGradient)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Theme Selector - Fixed position */}
        <div className="fixed top-4 right-4 z-50 no-print">
          <ThemeSelector />
        </div>

        <header className="mb-6 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2 text-shadow" style={{ 
            background: `linear-gradient(to right, var(--color-gradientFrom), var(--color-gradientTo))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t('title')}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>{t('subtitle')}</p>
          
          {/* Quick Stats Bar */}
          {isDataLoaded && (
            <div className="mt-4 flex justify-center space-x-6 text-sm animate-slide-in-right">
              <div className="px-3 py-1 rounded-full hover-lift" style={{ 
                background: 'var(--color-glass)', 
                backdropFilter: 'blur(10px)',
                color: 'var(--color-textPrimary)'
              }}>
                <span className="font-medium">{displayData.length}</span> {t('races')}
              </div>
              <div className="px-3 py-1 rounded-full hover-lift" style={{ 
                background: 'var(--color-glass)', 
                backdropFilter: 'blur(10px)',
                color: 'var(--color-textPrimary)'
              }}>
                {t('avgDivision')} <span className="font-medium">
                  {displayData.length > 0 ? (displayData.reduce((sum, item) => sum + (item.division || 10), 0) / displayData.length).toFixed(1) : 'N/A'}
                </span>
              </div>
              {filteredData.length !== playerData.length && (
                <div className="px-3 py-1 rounded-full animate-pulse-slow" style={{
                  backgroundColor: 'var(--color-info)',
                  color: 'var(--color-textInverse)'
                }}>
                  {t('filtered')}: {filteredData.length}/{playerData.length}
                </div>
              )}
            </div>
          )}
        </header>

        {!isDataLoaded ? (
          <>
            <div className="card-glass p-6 mb-4 data-import-area animate-fade-in-up">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">🏁</div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {t('welcomeTitle')}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Import your Trackmania COTD data and get detailed performance analysis. Copy your results from the game or{' '}
                    <a 
                      href="https://trackmania.io/#/players" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      trackmania.io
                    </a>
                    {' '}and paste them below.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowOnboarding(true)} 
                      className="btn-info flex items-center gap-2 px-6 py-3 text-base font-semibold"
                    >
                      🏁 Show Visual Guide
                    </button>
                    <button 
                      onClick={loadSampleData} 
                      className="btn-success flex items-center gap-2 px-6 py-3 text-base font-semibold"
                    >
                      🎯 Load Sample Data
                    </button>
                  </div>
                </div>
              </div>
              
              {showInfo && (
                <div className="mb-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl animate-slide-in-left shadow-sm">
                  <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    {t('instructionsTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3">Quick Steps:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                        {t('instructionSteps').map((step, index) => (
                          <li key={index} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🔒</span>
                          <h4 className="font-semibold text-green-800">Privacy First</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          {t('privacyNote')}
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💡</span>
                          <h4 className="font-semibold text-yellow-800">Pro Tip</h4>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Use Ctrl+A to select all data, then Ctrl+C to copy everything at once!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DataImportRevolutionary
              pasteAreaContent={pasteAreaContent}
              setPasteAreaContent={setPasteAreaContent}
              onDataParsed={handleDataParsing}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 animate-fade-in-up">
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>{t('yourAnalysis')}</h2>
              <div className="flex gap-2">
              <button 
                onClick={() => setIsDataLoaded(false)} 
                className="btn-primary"
              >
                {t('addData')}
              </button>
              <button 
                onClick={exportData} 
                className="btn-success"
              >
                {t('export')}
              </button>
              <button 
                onClick={clearAllData} 
                className="btn-danger"
              >
                {t('delete')}
              </button>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="stats-overview animate-fade-in-up">
              <StatsOverviewRevolutionary playerData={displayData} timeRange={timeRange} />
            </div>

            {/* Chart View Selection */}
            <div className="card-glass p-4 mb-6 animate-fade-in-up">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>{t('analysisViews')}</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveView('performance')} 
                  className="py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive shadow-lg"
                  style={{
                    backgroundColor: activeView === 'performance' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    color: 'var(--color-textInverse)',
                    border: `1px solid ${activeView === 'performance' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    ...(activeView === 'performance' && { animation: 'glow 2s ease-in-out infinite' })
                  }}
                >
                  {t('performance')}
                </button>
                <button 
                  onClick={() => setActiveView('division')} 
                  className="py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive shadow-lg"
                  style={{
                    backgroundColor: activeView === 'division' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    color: 'var(--color-textInverse)',
                    border: `1px solid ${activeView === 'division' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    ...(activeView === 'division' && { animation: 'glow 2s ease-in-out infinite' })
                  }}
                >
                  {t('divisionDistribution')}
                </button>
                <button 
                  onClick={() => setActiveView('divisionProgress')} 
                  className="py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive shadow-lg"
                  style={{
                    backgroundColor: activeView === 'divisionProgress' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    color: 'var(--color-textInverse)',
                    border: `1px solid ${activeView === 'divisionProgress' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    ...(activeView === 'divisionProgress' && { animation: 'glow 2s ease-in-out infinite' })
                  }}
                >
                  {t('divisionProgress')}
                </button>
                <button 
                  onClick={() => setActiveView('divisionRank')} 
                  className="py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive shadow-lg"
                  style={{
                    backgroundColor: activeView === 'divisionRank' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    color: 'var(--color-textInverse)',
                    border: `1px solid ${activeView === 'divisionRank' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    ...(activeView === 'divisionRank' && { animation: 'glow 2s ease-in-out infinite' })
                  }}
                >
                  {t('divisionRank')}
                </button>
                <button 
                  onClick={() => setActiveView('totalPlayers')} 
                  className="py-2 px-4 rounded-lg transition-all transform hover:scale-105 interactive shadow-lg"
                  style={{
                    backgroundColor: activeView === 'totalPlayers' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    color: 'var(--color-textInverse)',
                    border: `1px solid ${activeView === 'totalPlayers' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    ...(activeView === 'totalPlayers' && { animation: 'glow 2s ease-in-out infinite' })
                  }}
                >
                  {t('totalPlayers')}
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
              <p>{t('dataStoredLocally')}</p>
              <p className="mt-1">{t('disclaimer')}</p>
            </div>
          </>
        )}
      </div>

      {/* UX Enhancement Components */}
      <VisualStepGuide 
        isVisible={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
    </div>
  );
};

export default TrackmaniaApp;
