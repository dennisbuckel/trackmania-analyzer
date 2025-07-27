// src/components/StatsOverview.js
import React, { useMemo } from 'react';
import { getTranslation } from '../i18n/translations';

const StatsOverview = ({ playerData, timeRange }) => {
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);
  const stats = useMemo(() => {
    if (!playerData || playerData.length === 0) return null;
    
    // Filter data based on timeRange if needed
    let filteredData = playerData;
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      if (timeRange === '3months') {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (timeRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      }
      filteredData = playerData.filter((item) => new Date(item.date) >= cutoffDate);
    }

    const divisionData = filteredData.filter((item) => item.division);
    const rankData = filteredData.filter((item) => item.overallRank && item.totalPlayers);
    const qualificationData = filteredData.filter((item) => item.qualificationRank && item.qualificationTotal);
    
    const divisionCounts = {};
    divisionData.forEach(item => {
      divisionCounts[item.division] = (divisionCounts[item.division] || 0) + 1;
    });
    
    
    // Improvement calculation
    let improvement = { found: false, value: 0, period: '' };
    if (filteredData.length >= 8) {
      const firstHalf = filteredData.slice(0, Math.floor(filteredData.length / 2));
      const secondHalf = filteredData.slice(Math.floor(filteredData.length / 2));
      const firstHalfAvgPercentile = firstHalf.reduce((sum, item) => sum + (item.percentile || 0), 0) / firstHalf.length;
      const secondHalfAvgPercentile = secondHalf.reduce((sum, item) => sum + (item.percentile || 0), 0) / secondHalf.length;
      if (Math.abs(secondHalfAvgPercentile - firstHalfAvgPercentile) > 2) {
        improvement.found = true;
        improvement.value = firstHalfAvgPercentile - secondHalfAvgPercentile;
        improvement.period = timeRange === 'all' ? 'overall' : 
                             timeRange === '3months' ? 'in 3 months' : 'this month';
      }
    }
    
    // Best consecutive streak in divisions 1-3
    let currentStreak = 0;
    let bestStreak = 0;
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedData.forEach(item => {
      if (item.division && item.division <= 3) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return {
      totalRaces: filteredData.length,
      avgDivision: divisionData.length
        ? (divisionData.reduce((sum, item) => sum + item.division, 0) / divisionData.length).toFixed(1)
        : 'N/A',
      bestDivision: divisionData.length
        ? Math.min(...divisionData.map((item) => item.division))
        : 'N/A',
      avgPercentile: rankData.length
        ? (rankData.reduce((sum, item) => sum + (item.percentile || 0), 0) / rankData.length).toFixed(1)
        : 'N/A',
      bestRank: rankData.length
        ? Math.min(...rankData.map((item) => item.overallRank))
        : 'N/A',
      bestQualification: qualificationData.length 
        ? Math.min(...qualificationData.map((item) => item.qualificationRank))
        : 'N/A',
      avgQualification: qualificationData.length
        ? (qualificationData.reduce((sum, item) => sum + (item.qualificationPercentile || 0), 0) / qualificationData.length).toFixed(1)
        : 'N/A',
      topDivisionCount: {
        div1: divisionCounts[1] || 0,
        div2: divisionCounts[2] || 0,
        div3: divisionCounts[3] || 0,
        total: (divisionCounts[1] || 0) + (divisionCounts[2] || 0) + (divisionCounts[3] || 0)
      },
      improvement,
      bestStreak
    };
  }, [playerData, timeRange]);

  if (!stats) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-4">
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('totalRaces')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{stats.totalRaces}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('avgDivision')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{stats.avgDivision}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('bestDivision')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{stats.bestDivision}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('avgPercentile')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{stats.avgPercentile}%</p>
        </div>
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('bestRank')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>#{stats.bestRank}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('bestQualification')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>#{stats.bestQualification}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{t('avgQualification')}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{stats.avgQualification}%</p>
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Division Breakdown */}
        <div className="card p-4">
          <h3 className="text-md font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>Division Distribution</h3>
          <div className="flex items-center mt-2">
            <div className="flex-1 rounded-full h-6 overflow-hidden" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              {stats.topDivisionCount.div1 > 0 && (
                <div 
                  className="h-6" 
                  style={{ 
                    width: `${(stats.topDivisionCount.div1 / stats.totalRaces) * 100}%`, 
                    float: 'left',
                    backgroundColor: 'var(--color-success)'
                  }} 
                />
              )}
              {stats.topDivisionCount.div2 > 0 && (
                <div 
                  className="h-6" 
                  style={{ 
                    width: `${(stats.topDivisionCount.div2 / stats.totalRaces) * 100}%`, 
                    float: 'left',
                    backgroundColor: 'var(--color-primary)'
                  }} 
                />
              )}
              {stats.topDivisionCount.div3 > 0 && (
                <div 
                  className="h-6" 
                  style={{ 
                    width: `${(stats.topDivisionCount.div3 / stats.totalRaces) * 100}%`, 
                    float: 'left',
                    backgroundColor: 'var(--color-accent)'
                  }} 
                />
              )}
            </div>
          </div>
          <div className="flex mt-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: 'var(--color-success)' }}></div>
              <span>Div 1: {stats.topDivisionCount.div1}</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: 'var(--color-primary)' }}></div>
              <span>Div 2: {stats.topDivisionCount.div2}</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: 'var(--color-accent)' }}></div>
              <span>Div 3: {stats.topDivisionCount.div3}</span>
            </div>
          </div>
        </div>
        
        {/* Performance Highlights */}
        <div className="card p-4">
          <h3 className="text-md font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>Performance Highlights</h3>
          <div className="flex flex-col space-y-1 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <div className="flex justify-between">
              <span>Top Divisions:</span>
              <span className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>{stats.topDivisionCount.total} of {stats.totalRaces}</span>
            </div>
            {stats.improvement.found && (
              <div className="flex justify-between" style={{ color: 'var(--color-success)' }}>
                <span className="flex items-center">
                  Improvement {stats.improvement.period}:
                  <span 
                    className="ml-1 text-xs cursor-help" 
                    title="Calculated by comparing average Top % of first half vs second half of races (requires 8+ races, >2% difference)"
                    style={{ color: 'var(--color-textSecondary)' }}
                  >
                    ℹ️
                  </span>
                </span>
                <span className="font-medium">{stats.improvement.value > 0 ? '↑' : '↓'} {Math.abs(stats.improvement.value).toFixed(1)}%</span>
              </div>
            )}
            {stats.bestStreak > 1 && (
              <div className="flex justify-between">
                <span>Best Top Division Streak:</span>
                <span className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>{stats.bestStreak} races</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
