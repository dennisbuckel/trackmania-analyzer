// src/components/PlayerLookup.js
import React, { useState, useEffect, useRef } from 'react';
import { searchPlayer, fetchPlayerCotdData, convertApiDataToAppFormat } from '../utils/trackmaniaApi';
import { useToast } from './Toast';

const PlayerLookup = ({ onDataLoaded }) => {
  const toast = useToast();
  const [playerName, setPlayerName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCotd, setFetchingCotd] = useState(false);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [error, setError] = useState(null);
  const [cotdPreview, setCotdPreview] = useState(null);
  const inputRef = useRef(null);

  // Load saved player name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('tmio-player-name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!playerName.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedPlayer(null);
    setCotdPreview(null);

    try {
      const results = await searchPlayer(playerName);
      setSearchResults(results.slice(0, 15)); // Limit to top 15 results
      localStorage.setItem('tmio-player-name', playerName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectPlayer = async (player) => {
    setSelectedPlayer(player);
    setFetchingCotd(true);
    setError(null);
    setCotdPreview(null);
    setProgress({ loaded: 0, total: 0 });

    try {
      const cotdData = await fetchPlayerCotdData(player.id, (loaded, total) => {
        setProgress({ loaded, total });
      });

      const convertedData = convertApiDataToAppFormat(cotdData.cups);
      
      setCotdPreview({
        totalEntries: convertedData.length,
        firstDate: convertedData.length > 0 ? convertedData[convertedData.length - 1].date : null,
        lastDate: convertedData.length > 0 ? convertedData[0].date : null,
        avgDivision: convertedData.length > 0 
          ? (convertedData.reduce((sum, e) => sum + (e.division || 0), 0) / convertedData.length).toFixed(1)
          : 0,
        bestDivision: convertedData.length > 0 
          ? Math.min(...convertedData.filter(e => e.division > 0).map(e => e.division))
          : 0,
        stats: cotdData.stats,
        data: convertedData,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchingCotd(false);
    }
  };

  const handleImportData = () => {
    if (cotdPreview && cotdPreview.data) {
      onDataLoaded(cotdPreview.data, selectedPlayer?.name);
    }
  };

  const handleReset = () => {
    setSearchResults([]);
    setSelectedPlayer(null);
    setCotdPreview(null);
    setError(null);
    setProgress({ loaded: 0, total: 0 });
  };

  return (
    <div className="card p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
          <span className="text-2xl">🔍</span>
          Auto-Fetch Player Data
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-textSecondary)' }}>
          Enter your in-game name to automatically load all your COTD data from{' '}
          <a 
            href="https://trackmania.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            trackmania.io
          </a>
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your Trackmania name..."
            className="w-full px-4 py-3 rounded-lg border-2 text-base transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-textPrimary)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            disabled={fetchingCotd}
          />
          {playerName && !fetchingCotd && (
            <button
              onClick={() => { setPlayerName(''); handleReset(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg opacity-50 hover:opacity-100 transition-opacity"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || fetchingCotd || !playerName.trim()}
          className="px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
          style={{
            backgroundColor: !playerName.trim() ? 'var(--color-backgroundSecondary)' : 'var(--color-primary)',
            color: !playerName.trim() ? 'var(--color-textMuted)' : 'var(--color-textInverse)',
            cursor: !playerName.trim() ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (playerName.trim()) e.target.style.backgroundColor = 'var(--color-primaryHover)';
          }}
          onMouseLeave={(e) => {
            if (playerName.trim()) e.target.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : '🔍 Search'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 rounded-lg border flex items-start gap-2" style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'var(--color-danger)',
          color: 'var(--color-danger)',
        }}>
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm opacity-75 mt-1">
              Make sure the name matches your in-game name exactly and the dev server is running (npm start).
            </p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedPlayer && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-textSecondary)' }}>
            {searchResults.length} player{searchResults.length !== 1 ? 's' : ''} found — select yours:
          </h3>
          <div className="grid gap-2 max-h-80 overflow-y-auto pr-1">
            {searchResults.map((player) => (
              <button
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className="w-full text-left px-4 py-3 rounded-lg border-2 transition-all hover:shadow-md flex items-center justify-between group"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surfaceHover, var(--color-surface))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-textInverse)' }}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                      {player.tag && <span className="opacity-60 mr-1">[{player.tag}]</span>}
                      {player.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-textMuted)' }}>
                      📍 {player.zone}
                    </div>
                  </div>
                </div>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>
                  Select →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading COTD Data */}
      {fetchingCotd && (
        <div className="mb-4 p-6 rounded-lg border text-center" style={{
          borderColor: 'var(--color-primary)',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="animate-spin h-6 w-6" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>
              Loading COTD data for {selectedPlayer?.name}...
            </span>
          </div>
          
          {progress.total > 0 && (
            <div>
              <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    width: `${Math.min(100, (progress.loaded / progress.total) * 100)}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                📊 {progress.loaded} / {progress.total} entries loaded
              </p>
            </div>
          )}
        </div>
      )}

      {/* COTD Data Preview */}
      {cotdPreview && !fetchingCotd && (
        <div className="mb-4 p-5 rounded-lg border" style={{
          borderColor: 'var(--color-success, #10b981)',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
        }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--color-textPrimary)' }}>
                {selectedPlayer?.name}'s COTD Data Ready!
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                All data has been loaded successfully from trackmania.io
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {cotdPreview.totalEntries}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-textMuted)' }}>Total COTDs</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {cotdPreview.avgDivision}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-textMuted)' }}>Avg Division</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-success, #10b981)' }}>
                {cotdPreview.bestDivision}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-textMuted)' }}>Best Division</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {cotdPreview.firstDate}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-textMuted)' }}>to {cotdPreview.lastDate}</div>
            </div>
          </div>

          {/* Stats from API */}
          {cotdPreview.stats && cotdPreview.stats.best && (
            <div className="p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>📈 Career Highlights:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2" style={{ color: 'var(--color-textSecondary)' }}>
                <div>🏆 Best Rank: <strong style={{ color: 'var(--color-textPrimary)' }}>#{cotdPreview.stats.best.bestrank}</strong></div>
                <div>🥇 Best Division: <strong style={{ color: 'var(--color-textPrimary)' }}>Div {cotdPreview.stats.best.bestdiv}</strong></div>
                <div>🏅 Division Wins: <strong style={{ color: 'var(--color-textPrimary)' }}>{cotdPreview.stats.totaldivwins}</strong></div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleImportData}
              className="flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-textInverse)',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primaryHover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
            >
              🚀 Import {cotdPreview.totalEntries} COTD Entries
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-lg font-medium transition-all border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-textSecondary)',
                backgroundColor: 'var(--color-surface)',
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              ↩ Back
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      {!searchResults.length && !fetchingCotd && !cotdPreview && !error && (
        <div className="mt-2 p-3 rounded-lg text-sm" style={{ 
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-textMuted)' 
        }}>
          <div className="flex items-start gap-2">
            <span>💡</span>
            <div>
              <p>Enter your <strong>exact in-game name</strong> and we'll automatically load all your Cup of the Day results directly from trackmania.io — no more manual copy & paste!</p>
              <p className="mt-1 opacity-75">🔒 All data stays local. The API is only accessed through your local development server.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerLookup;
