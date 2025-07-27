// src/components/AdvancedSearch.js
import React, { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';

const AdvancedSearch = ({ playerData, onFilter, isVisible, onClose }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    division: { min: '', max: '' },
    percentile: { min: '', max: '' },
    mapName: '',
    points: { min: '', max: '' },
    streak: { type: 'any', length: '' }
  });

  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState('');
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  useEffect(() => {
    // Load saved filters from localStorage
    const saved = localStorage.getItem('cotd-saved-filters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);


  const handleFilterChange = (category, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [field]: value }
        : value
    }));
  };

  const applyFilters = () => {
    let filtered = [...playerData];

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.dateRange.end));
    }

    // Division filter
    if (filters.division.min) {
      filtered = filtered.filter(item => (item.division || 999) >= parseInt(filters.division.min));
    }
    if (filters.division.max) {
      filtered = filtered.filter(item => (item.division || 0) <= parseInt(filters.division.max));
    }

    // Percentile filter
    if (filters.percentile.min) {
      filtered = filtered.filter(item => (item.percentile || 100) >= parseFloat(filters.percentile.min));
    }
    if (filters.percentile.max) {
      filtered = filtered.filter(item => (item.percentile || 0) <= parseFloat(filters.percentile.max));
    }


    // Map name filter
    if (filters.mapName) {
      const searchTerm = filters.mapName.toLowerCase();
      filtered = filtered.filter(item => 
        item.map && item.map.toLowerCase().includes(searchTerm)
      );
    }

    // Points filter
    if (filters.points.min) {
      filtered = filtered.filter(item => (item.points || 0) >= parseInt(filters.points.min));
    }
    if (filters.points.max) {
      filtered = filtered.filter(item => (item.points || 0) <= parseInt(filters.points.max));
    }

    // Streak filter
    if (filters.streak.type !== 'any' && filters.streak.length) {
      const streakLength = parseInt(filters.streak.length);
      const streakType = filters.streak.type;
      
      // Find items that are part of a streak
      const streakItems = new Set();
      let currentStreak = 0;
      
      for (let i = 0; i < playerData.length; i++) {
        const item = playerData[i];
        let isStreakMatch = false;
        
        if (streakType === 'division1' && item.division === 1) {
          isStreakMatch = true;
        } else if (streakType === 'top10' && item.percentile && item.percentile <= 10) {
          isStreakMatch = true;
        } else if (streakType === 'top20' && item.percentile && item.percentile <= 20) {
          isStreakMatch = true;
        }
        
        if (isStreakMatch) {
          currentStreak++;
          if (currentStreak >= streakLength) {
            // Add all items in this streak
            for (let j = i - currentStreak + 1; j <= i; j++) {
              streakItems.add(playerData[j]);
            }
          }
        } else {
          currentStreak = 0;
        }
      }
      
      filtered = filtered.filter(item => streakItems.has(item));
    }

    onFilter(filtered);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      division: { min: '', max: '' },
      percentile: { min: '', max: '' },
      mapName: '',
      points: { min: '', max: '' },
      streak: { type: 'any', length: '' }
    });
    onFilter(playerData);
  };

  const saveFilter = () => {
    if (!filterName.trim()) {
      alert(t('enterFilterName'));
      return;
    }

    const newFilter = {
      id: Date.now(),
      name: filterName,
      filters: { ...filters }
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('cotd-saved-filters', JSON.stringify(updated));
    setFilterName('');
  };

  const loadFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
  };

  const deleteFilter = (filterId) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('cotd-saved-filters', JSON.stringify(updated));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.division.min || filters.division.max) count++;
    if (filters.percentile.min || filters.percentile.max) count++;
    if (filters.mapName) count++;
    if (filters.points.min || filters.points.max) count++;
    if (filters.streak.type !== 'any') count++;
    return count;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t('advancedSearchTitle')}</h2>
              <p className="text-blue-100 mt-1">
                {t('advancedSearchDesc')}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(90vh-120px)]">
          {/* Filter Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Date Range */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800">{t('dateRange')}</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('from')}</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', 'start', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('to')}</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', 'end', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Division */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800">{t('division')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('min')}</label>
                    <input
                      type="number"
                      min="1"
                      max="64"
                      value={filters.division.min}
                      onChange={(e) => handleFilterChange('division', 'min', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('max')}</label>
                    <input
                      type="number"
                      min="1"
                      max="64"
                      value={filters.division.max}
                      onChange={(e) => handleFilterChange('division', 'max', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="64"
                    />
                  </div>
                </div>
              </div>

              {/* Percentile */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800">{t('topPercent')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('min')} %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={filters.percentile.min}
                      onChange={(e) => handleFilterChange('percentile', 'min', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('max')} %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={filters.percentile.max}
                      onChange={(e) => handleFilterChange('percentile', 'max', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>


              {/* Map Name */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800">{t('mapName')}</h3>
                <input
                  type="text"
                  value={filters.mapName}
                  onChange={(e) => handleFilterChange('mapName', null, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder={t('searchMapName')}
                />
              </div>

              {/* Points */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800">{t('points')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('min')}</label>
                    <input
                      type="number"
                      min="0"
                      value={filters.points.min}
                      onChange={(e) => handleFilterChange('points', 'min', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('max')}</label>
                    <input
                      type="number"
                      min="0"
                      value={filters.points.max}
                      onChange={(e) => handleFilterChange('points', 'max', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              {/* Streak Filter */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h3 className="font-semibold mb-3 text-gray-800">{t('streakFilter')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('streakType')}</label>
                    <select
                      value={filters.streak.type}
                      onChange={(e) => handleFilterChange('streak', 'type', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="any">{t('noStreak')}</option>
                      <option value="division1">{t('div1Streak')}</option>
                      <option value="top10">{t('top10Streak')}</option>
                      <option value="top20">{t('top20Streak')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('minLength')}</label>
                    <input
                      type="number"
                      min="2"
                      value={filters.streak.length}
                      onChange={(e) => handleFilterChange('streak', 'length', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="3"
                      disabled={filters.streak.type === 'any'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Filters Sidebar */}
          <div className="w-80 bg-gray-50 p-4 border-l overflow-y-auto">
            <h3 className="font-semibold mb-4 text-gray-800">{t('savedFilters')}</h3>
            
            {/* Save Current Filter */}
            <div className="mb-4 p-3 bg-white rounded border">
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder={t('filterName')}
                className="w-full border rounded px-2 py-1 mb-2 text-sm"
              />
              <button
                onClick={saveFilter}
                className="w-full bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700"
              >
                {t('saveCurrentFilter')}
              </button>
            </div>

            {/* Saved Filters List */}
            <div className="space-y-2">
              {savedFilters.map(filter => (
                <div key={filter.id} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{filter.name}</span>
                    <button
                      onClick={() => deleteFilter(filter.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    onClick={() => loadFilter(filter)}
                    className="w-full bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded text-xs"
                  >
                    {t('load')}
                  </button>
                </div>
              ))}
              
              {savedFilters.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  {t('noSavedFilters')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {getActiveFiltersCount()} {t('activeFilters')}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {t('reset')}
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
