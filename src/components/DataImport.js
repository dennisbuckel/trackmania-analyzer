// src/components/DataImport.js
import React, { useState } from 'react';
import { getTranslation } from '../i18n/translations';

const DataImport = ({ pasteAreaContent, setPasteAreaContent, onDataParsed }) => {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [extractionType, setExtractionType] = useState('auto');
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  const handleProcessData = () => {
    if (!pasteAreaContent) {
      alert('Please paste Trackmania data first.');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      onDataParsed(pasteAreaContent);
      setLoading(false);
    }, 500);
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      // Try to parse content
      if (content) {
        setPasteAreaContent(content);
      }
    };
    reader.readAsText(file);
  };

  const clearContent = () => {
    if (pasteAreaContent && window.confirm('Do you want to clear the content?')) {
      setPasteAreaContent('');
    }
  };

  const handleKeyDown = (e) => {
    // Allow submitting with Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
      handleProcessData();
    }
  };

  // Handle sample data - only load into paste area, don't process automatically
  const loadSampleData = () => {
    const sampleData = `COTD 2025-03-04 #1
18 hours ago
Want to sleep until June 8 5th / 44 453rd / 2281 (top 19.86%) 462nd / 2281 (top 20.25%) 
COTD 2025-03-03 #1
2 days ago
ULTRAMARINE 12 24th / 45 728th / 2405 (top 30.27%) 760th / 2405 (top 31.60%) 
COTD 2025-03-02 #1
3 days ago
Geisterkrank 9 4th / 46 516th / 2166 (top 23.82%) 572nd / 2166 (top 26.41%) 
COTD 2025-03-01 #1
4 days ago
RALLY DOINKS² 8 38th / 52 486th / 1839 (top 26.43%) 454th / 1839 (top 24.69%) 
COTD 2025-02-28 #1
5 days ago
SKY DUST 11 4th / 52 644th / 2072 (top 31.08%) 682nd / 2072 (top 32.92%)
COTD 2025-02-27 #1
6 days ago
Midnight Express 7 12th / 48 398th / 2156 (top 18.46%) 421st / 2156 (top 19.53%)
COTD 2025-02-26 #1
7 days ago
Crystal Cave 13 8th / 51 789th / 2334 (top 33.81%) 812nd / 2334 (top 34.79%)
COTD 2025-02-25 #1
8 days ago
Neon Highway 6 22nd / 49 334th / 2567 (top 13.01%) 356th / 2567 (top 13.87%)
COTD 2025-02-24 #1
9 days ago
Desert Storm 15 3rd / 47 891st / 2198 (top 40.54%) 923rd / 2198 (top 42.00%)
COTD 2025-02-23 #1
10 days ago
Arctic Blast 10 18th / 53 598th / 2445 (top 24.46%) 634th / 2445 (top 25.93%)
COTD 2025-02-22 #1
11 days ago
Volcano Rush 14 6th / 44 834th / 2289 (top 36.44%) 867th / 2289 (top 37.88%)
COTD 2025-02-21 #1
12 days ago
Ocean Drift 9 31st / 50 549th / 2378 (top 23.09%) 567th / 2378 (top 23.85%)
COTD 2025-02-20 #1
13 days ago
Mountain Peak 12 15th / 46 718th / 2156 (top 33.30%) 745th / 2156 (top 34.55%)
COTD 2025-02-19 #1
14 days ago
City Lights 8 27th / 52 486th / 2234 (top 21.75%) 498th / 2234 (top 22.29%)
COTD 2025-02-18 #1
15 days ago
Forest Trail 11 9th / 48 644th / 2367 (top 27.20%) 672nd / 2367 (top 28.39%)
COTD 2025-02-17 #1
16 days ago
Space Station 16 4th / 45 968th / 2445 (top 39.59%) 1012th / 2445 (top 41.39%)
COTD 2025-02-16 #1
17 days ago
Thunder Valley 7 19th / 51 408th / 2189 (top 18.64%) 432nd / 2189 (top 19.73%)
COTD 2025-02-15 #1
18 days ago
Ice Palace 13 11th / 49 807th / 2298 (top 35.12%) 834th / 2298 (top 36.29%)
COTD 2025-02-14 #1
19 days ago
Sunset Beach 5 28th / 47 279th / 2456 (top 11.36%) 298th / 2456 (top 12.13%)
COTD 2025-02-13 #1
20 days ago
Steel Factory 17 7th / 44 1057th / 2367 (top 44.65%) 1089th / 2367 (top 46.00%)
COTD 2025-02-12 #1
21 days ago
Rainbow Road 9 23rd / 53 531st / 2234 (top 23.77%) 548th / 2234 (top 24.53%)
COTD 2025-02-11 #1
22 days ago
Cyber Circuit 14 13th / 48 850th / 2189 (top 38.84%) 876th / 2189 (top 40.02%)
COTD 2025-02-10 #1
23 days ago
Golden Temple 6 33rd / 50 351st / 2298 (top 15.27%) 367th / 2298 (top 15.97%)
COTD 2025-02-09 #1
24 days ago
Wind Tunnel 12 20th / 46 726th / 2456 (top 29.56%) 751st / 2456 (top 30.58%)
COTD 2025-02-08 #1
25 days ago
Lava Flow 10 14th / 52 610th / 2367 (top 25.76%) 634th / 2367 (top 26.78%)
COTD 2025-02-07 #1
26 days ago
Crystal Maze 8 25th / 49 498th / 2234 (top 22.29%) 512th / 2234 (top 22.92%)
COTD 2025-02-06 #1
27 days ago
Neon Dreams 15 5th / 47 902nd / 2189 (top 41.21%) 934th / 2189 (top 42.67%)`;
    
    setPasteAreaContent(sampleData);
  };

  return (
    <div className={`bg-white p-6 rounded shadow-md ${isExpanded ? 'fixed inset-0 z-50 flex flex-col' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Import Data</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <select
              value={extractionType}
              onChange={(e) => setExtractionType(e.target.value)}
              className="mr-2 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="auto">Auto-Detect</option>
              <option value="manual">Manual Format</option>
              <option value="trackmaniaIo">Trackmania.io</option>
              <option value="openplanet">Openplanet</option>
            </select>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? "Minimize" : "Full Screen"}
          </button>
        </div>
      </div>

      <div className={`relative flex-grow ${isExpanded ? 'flex-1' : ''}`}>
        <textarea
          className={`w-full p-2 border border-gray-300 rounded mb-4 font-mono text-sm ${
            isExpanded ? 'h-full min-h-[70vh]' : 'h-96'
          }`}
          value={pasteAreaContent}
          onChange={(e) => setPasteAreaContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('pasteDataHere')}
          spellCheck="false"
        />
        {pasteAreaContent && (
          <button
            onClick={clearContent}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 bg-white rounded-full h-6 w-6 flex items-center justify-center shadow"
            title="Clear content"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleProcessData}
          disabled={loading || !pasteAreaContent}
          className={`bg-blue-600 text-white py-2 px-4 rounded ${
            !pasteAreaContent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('processing')}
            </span>
          ) : (
            t('processData')
          )}
        </button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json, .txt, .csv"
            id="fileUpload"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <label
            htmlFor="fileUpload"
            className="bg-gray-200 py-2 px-4 rounded cursor-pointer hover:bg-gray-300"
          >
            {t('importFile')}
          </label>
        </div>
        
        <button
          onClick={loadSampleData}
          className="bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200"
        >
          {t('loadSampleData')}
        </button>

        <div className="text-sm text-gray-500 ml-auto">
          {pasteAreaContent ? 
            `${pasteAreaContent.length} ${t('characters')} | ${pasteAreaContent.split('\n').length} ${t('lines')}` : 
            t('pasteDataHere')
          }
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 text-sm text-gray-500">
          <p>Tip: Press Ctrl+Enter to process the data directly.</p>
          <div className="mt-2 p-3 bg-blue-50 rounded">
            <h4 className="font-semibold">Supported Formats:</h4>
            <div className="mt-2 space-y-3">
              <div>
                <p className="text-xs font-medium text-blue-700">✅ With Header (Recommended):</p>
                <pre className="mt-1 text-xs overflow-x-auto bg-white p-2 rounded border">
Cup of the Day	Map	Division	Rank	Overall Rank	Qualification Rank
COTD 2025-03-04 #1
Map Name
Division 8
5th / 44
453rd / 2281 (top 19.86%) 462nd / 2281 (top 20.25%)
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium text-green-700">✅ Without Header (Flexible):</p>
                <pre className="mt-1 text-xs overflow-x-auto bg-white p-2 rounded border">
COTD 2025-03-04 #1
Map Name
Division 8
5th / 44
453rd / 2281 (top 19.86%) 462nd / 2281 (top 20.25%)
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium text-orange-700">✅ Data Only (Auto-detect):</p>
                <pre className="mt-1 text-xs overflow-x-auto bg-white p-2 rounded border">
Map Name
Division 8
5th / 44
453rd / 2281 (top 19.86%) 462nd / 2281 (top 20.25%)
                </pre>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              💡 The parser automatically detects the format and adapts accordingly. 
              You can now copy just the data lines without worrying about the header!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImport;
