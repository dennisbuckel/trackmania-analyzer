// src/components/StatsOverview.js
import React, { useMemo } from 'react';

const StatsOverview = ({ playerData, timeRange }) => {
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
    const pointsData = filteredData.filter((item) => item.points);
    
    const divisionCounts = {};
    divisionData.forEach(item => {
      divisionCounts[item.division] = (divisionCounts[item.division] || 0) + 1;
    });
    
    // Best/Worst map type (vereinfacht dargestellt)
    const mapTypeCounts = {};
    let bestMapType = { type: null, percentile: 100 };
    let worstMapType = { type: null, percentile: 0 };
    
    filteredData.forEach(item => {
      if (item.mapType) {
        mapTypeCounts[item.mapType] = (mapTypeCounts[item.mapType] || 0) + 1;
        if (item.percentile) {
          if (!bestMapType[item.mapType]) {
            bestMapType[item.mapType] = { sum: 0, count: 0, avg: 0 };
            worstMapType[item.mapType] = { sum: 0, count: 0, avg: 0 };
          }
          bestMapType[item.mapType].sum += item.percentile;
          bestMapType[item.mapType].count += 1;
          bestMapType[item.mapType].avg = bestMapType[item.mapType].sum / bestMapType[item.mapType].count;
          worstMapType[item.mapType].sum += item.percentile;
          worstMapType[item.mapType].count += 1;
          worstMapType[item.mapType].avg = worstMapType[item.mapType].sum / worstMapType[item.mapType].count;
          if (bestMapType[item.mapType].count >= 3 && bestMapType[item.mapType].avg < bestMapType.percentile) {
            bestMapType.type = item.mapType;
            bestMapType.percentile = bestMapType[item.mapType].avg;
          }
          if (worstMapType[item.mapType].count >= 3 && worstMapType[item.mapType].avg > worstMapType.percentile) {
            worstMapType.type = item.mapType;
            worstMapType.percentile = worstMapType[item.mapType].avg;
          }
        }
      }
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
        improvement.period = timeRange === 'all' ? 'seit Beginn' : 
                             timeRange === '3months' ? 'in 3 Monaten' : 'im letzten Monat';
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
      totalPoints: pointsData.reduce((sum, item) => sum + item.points, 0),
      avgPoints: pointsData.length 
        ? Math.round(pointsData.reduce((sum, item) => sum + item.points, 0) / pointsData.length) 
        : 0,
      bestMapType: bestMapType.type,
      worstMapType: worstMapType.type,
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
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Anzahl Rennen</p>
          <p className="text-xl font-bold">{stats.totalRaces}</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Ø Division</p>
          <p className="text-xl font-bold">{stats.avgDivision}</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Beste Division</p>
          <p className="text-xl font-bold">{stats.bestDivision}</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Ø Top %</p>
          <p className="text-xl font-bold">{stats.avgPercentile}%</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Beste Platzierung</p>
          <p className="text-xl font-bold">#{stats.bestRank}</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Beste Quali</p>
          <p className="text-xl font-bold">#{stats.bestQualification}</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Ø Quali Top %</p>
          <p className="text-xl font-bold">{stats.avgQualification}%</p>
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Division Breakdown */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-bold mb-2">Divisionen-Verteilung</h3>
          <div className="flex items-center mt-2">
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              {stats.topDivisionCount.div1 > 0 && (
                <div 
                  className="bg-green-500 h-6" 
                  style={{ width: `${(stats.topDivisionCount.div1 / stats.totalRaces) * 100}%`, float: 'left' }} 
                />
              )}
              {stats.topDivisionCount.div2 > 0 && (
                <div 
                  className="bg-blue-500 h-6" 
                  style={{ width: `${(stats.topDivisionCount.div2 / stats.totalRaces) * 100}%`, float: 'left' }} 
                />
              )}
              {stats.topDivisionCount.div3 > 0 && (
                <div 
                  className="bg-purple-500 h-6" 
                  style={{ width: `${(stats.topDivisionCount.div3 / stats.totalRaces) * 100}%`, float: 'left' }} 
                />
              )}
            </div>
          </div>
          <div className="flex mt-2 text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
              <span>Div 1: {stats.topDivisionCount.div1}</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-blue-500 mr-1 rounded-sm"></div>
              <span>Div 2: {stats.topDivisionCount.div2}</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-purple-500 mr-1 rounded-sm"></div>
              <span>Div 3: {stats.topDivisionCount.div3}</span>
            </div>
          </div>
        </div>
        
        {/* Performance Highlights */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-bold mb-2">Performance Highlights</h3>
          <div className="flex flex-col space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Top-Divisionen:</span>
              <span className="font-medium">{stats.topDivisionCount.total} von {stats.totalRaces}</span>
            </div>
            <div className="flex justify-between">
              <span>Punkte Gesamt:</span>
              <span className="font-medium">{stats.totalPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Punkte pro Rennen:</span>
              <span className="font-medium">{stats.avgPoints}</span>
            </div>
            {stats.improvement.found && (
              <div className="flex justify-between text-green-600">
                <span>Verbesserung {stats.improvement.period}:</span>
                <span className="font-medium">{stats.improvement.value > 0 ? '↑' : '↓'} {Math.abs(stats.improvement.value).toFixed(1)}%</span>
              </div>
            )}
            {stats.bestStreak > 1 && (
              <div className="flex justify-between">
                <span>Beste Top-Division Serie:</span>
                <span className="font-medium">{stats.bestStreak} Rennen</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
