// src/components/DataImportRevolutionary.js
import React, { useState } from 'react';
import { getTranslation } from '../i18n/translations';
import parseTrackmaniaIoData from '../utils/parseTrackmaniaIoData';

const DataImportRevolutionary = ({ pasteAreaContent, setPasteAreaContent, onDataParsed }) => {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  const handleProcessData = async () => {
    if (!pasteAreaContent) {
      alert('❌ Please paste data from trackmania.io first.');
      return;
    }

    setLoading(true);
    setParseResult(null);

    try {
      // Use the advanced parser
      const result = await parseTrackmaniaIoData(pasteAreaContent);
      
      setParseResult(result);
      
      if (result.results.length > 0) {
        // Show preview
        setShowPreview(true);
        
        // Automatically process after short delay
        setTimeout(() => {
          onDataParsed(pasteAreaContent, result.results);
          setShowPreview(false);
        }, 2000);
      } else {
        alert('❌ No valid data found. Please check the format.');
      }
    } catch (error) {
      alert(`❌ Parsing error: ${error.message}`);
      setParseResult({
        results: [],
        errors: [error.message],
        summary: { totalEntries: 0, errorCount: 1, successRate: '0.0' }
      });
    } finally {
      setLoading(false);
    }
  };

  const clearContent = () => {
    if (pasteAreaContent && window.confirm('Do you want to clear the content?')) {
      setPasteAreaContent('');
      setParseResult(null);
      setShowPreview(false);
    }
  };

  const handleKeyDown = (e) => {
    // Allow submitting with Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
      handleProcessData();
    }
  };

  // Handle sample data from trackmania.io - only load into paste area, don't process automatically
  const loadSampleData = () => {
    const sampleData = `Cup of the Day	Map	Division	Division Rank	Rank	Qualification
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
338th / 2678 (top 12.62%)	361st / 2678 (top 13.48%)`;
    
    setPasteAreaContent(sampleData);
    setParseResult(null);
    setShowPreview(false);
  };

  return (
    <div className={`card p-6 ${isExpanded ? 'fixed inset-0 z-50 flex flex-col' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>🚀  Data Extractor</h2>
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            Optimized for{' '}
            <a 
              href="https://trackmania.io/#/players" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium transition-colors duration-200"
              style={{ 
                color: 'var(--color-primary)',
                ':hover': { color: 'var(--color-primaryHover)' }
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primaryHover)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
            >
              trackmania.io
            </a>
            {' '}data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 rounded transition-colors duration-200"
            style={{
              color: 'var(--color-primary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-surfaceHover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title={isExpanded ? "Minimize" : "Fullscreen"}
          >
            {isExpanded ? "📱" : "🖥️"}
          </button>
        </div>
      </div>


      <div className={`relative flex-grow ${isExpanded ? 'flex-1' : ''}`}>
        <textarea
          className={`w-full p-3 border-2 rounded-lg mb-4 font-mono text-sm transition-colors ${isExpanded ? 'h-full min-h-[70vh]' : 'h-96'}`}
          style={{
            borderColor: parseResult?.errors?.length > 0 ? 'var(--color-danger)' : 
                        parseResult?.results?.length > 0 ? 'var(--color-success)' : 
                        'var(--color-border)',
            backgroundColor: parseResult?.errors?.length > 0 ? 'rgba(239, 68, 68, 0.1)' : 
                            parseResult?.results?.length > 0 ? 'rgba(16, 185, 129, 0.1)' : 
                            'var(--color-surface)',
            color: 'var(--color-textPrimary)'
          }}
          value={pasteAreaContent}
          onChange={(e) => {
            setPasteAreaContent(e.target.value);
            setParseResult(null);
            setShowPreview(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste your trackmania.io data here...

Example format:
Cup of the Day	Map	Division	Division Rank	Rank	Qualification
COTD 2025-07-26 #1
Flow State
12
1st / 46
705th / 2134 (top 33.04%)	761st / 2134 (top 35.66%)"
          spellCheck="false"
        />
        
        {pasteAreaContent && (
          <button
            onClick={clearContent}
            className="absolute top-2 right-2 rounded-full h-8 w-8 flex items-center justify-center shadow-lg transition-colors duration-200"
            style={{
              color: 'var(--color-textMuted)',
              backgroundColor: 'var(--color-surface)',
              border: `1px solid var(--color-border)`
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-danger)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-textMuted)'}
            title="Clear content"
          >
            ❌
          </button>
        )}
      </div>

      {/* Parse Result Display */}
      {parseResult && (
        <div className="mb-4 p-4 rounded-lg border">
          <div className={`flex items-center mb-2 ${
            parseResult.results.length > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="text-lg mr-2">
              {parseResult.results.length > 0 ? '✅' : '❌'}
            </span>
            <h4 className="font-semibold">
              {parseResult.results.length > 0 ? 'Parsing successful!' : 'Parsing error'}
            </h4>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-bold text-blue-600">{parseResult.summary.totalEntries}</div>
              <div className="text-blue-500">Entries</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-bold text-red-600">{parseResult.summary.errorCount}</div>
              <div className="text-red-500">Errors</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-bold text-green-600">{parseResult.summary.successRate}%</div>
              <div className="text-green-500">Success Rate</div>
            </div>
          </div>

          {parseResult.errors.length > 0 && (
            <div className="mt-3">
              <h5 className="font-semibold text-red-600 mb-2">⚠️ Warnings/Errors:</h5>
              <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                {parseResult.errors.map((error, index) => (
                  <div key={index} className="text-red-700 mb-1">• {error}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {showPreview && parseResult?.results?.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <span className="text-green-600 text-lg mr-2">👀</span>
            <h4 className="font-semibold text-green-800">Preview of first 3 entries:</h4>
          </div>
          <div className="space-y-2 text-sm">
            {parseResult.results.slice(0, 3).map((entry, index) => (
              <div key={index} className="bg-white p-2 rounded border">
                <div className="font-medium">{entry.date} - {entry.map}</div>
                <div className="text-gray-600">
                  Division {entry.division} | Rank {entry.divisionRank}/{entry.divisionPlayers} | 
                  Overall {entry.overallRank}/{entry.totalPlayers} ({entry.percentile?.toFixed(1)}%) | 
                  Points: {entry.points}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-green-600 font-medium">
            ⏳ Data will be processed automatically...
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleProcessData}
          disabled={loading || !pasteAreaContent}
          className="px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          style={{
            backgroundColor: !pasteAreaContent ? 'var(--color-backgroundSecondary)' : 'var(--color-primary)',
            color: !pasteAreaContent ? 'var(--color-textMuted)' : 'var(--color-textInverse)',
            cursor: !pasteAreaContent ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (pasteAreaContent) {
              e.target.style.backgroundColor = 'var(--color-primaryHover)';
            }
          }}
          onMouseLeave={(e) => {
            if (pasteAreaContent) {
              e.target.style.backgroundColor = 'var(--color-primary)';
            }
          }}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--color-textInverse)' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              🔄 Processing...
            </span>
          ) : (
            '🚀 Process Data'
          )}
        </button>
        

        <div className="text-sm ml-auto" style={{ color: 'var(--color-textMuted)' }}>
          {pasteAreaContent ? 
            `📊 ${pasteAreaContent.length} characters | ${pasteAreaContent.split('\n').length} lines` : 
            '💡 Tip: Ctrl+Enter for quick processing'
          }
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 text-sm text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">✨ New Features:</h5>
              <ul className="space-y-1">
                <li>• 🎯 100% accuracy for trackmania.io data</li>
                <li>• 🔍 Automatic data validation</li>
                <li>• 📊 Live preview of results</li>
                <li>• ⚡ Lightning-fast processing</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">🛡️ Quality Control:</h5>
              <ul className="space-y-1">
                <li>• ✅ Plausibility checks</li>
                <li>• 🔧 Automatic error detection</li>
                <li>• 📈 Detailed success statistics</li>
                <li>• 🎯 No more incorrect qualification ranks</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImportRevolutionary;
