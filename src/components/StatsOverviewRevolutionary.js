// src/components/StatsOverviewRevolutionary.js
import React, { useMemo, useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';

const StatsOverviewRevolutionary = ({ playerData, timeRange }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  // Trigger animation phases
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 100);
    const timer2 = setTimeout(() => setAnimationPhase(2), 300);
    const timer3 = setTimeout(() => setAnimationPhase(3), 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [playerData]);

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
    
    // Advanced analytics
    const recentRaces = filteredData.slice(0, 5);
    const oldRaces = filteredData.slice(-5);
    
    // Performance trend calculation
    let trend = 'stable';
    let trendValue = 0;
    if (recentRaces.length >= 3 && oldRaces.length >= 3) {
      const recentAvg = recentRaces.reduce((sum, item) => sum + (item.percentile || 50), 0) / recentRaces.length;
      const oldAvg = oldRaces.reduce((sum, item) => sum + (item.percentile || 50), 0) / oldRaces.length;
      trendValue = oldAvg - recentAvg; // Lower percentile is better
      if (trendValue > 5) trend = 'improving';
      else if (trendValue < -5) trend = 'declining';
    }
    
    // Average Division in Last 10 Matches
    let avgDivLast10 = 'N/A';
    let avgDivLast10Explanation = "Not enough data";
    
    if (divisionData.length >= 1) {
      // Get last 10 matches with division data
      const last10Matches = divisionData.slice(0, Math.min(10, divisionData.length));
      
      if (last10Matches.length > 0) {
        const avgDiv = last10Matches.reduce((sum, item) => sum + item.division, 0) / last10Matches.length;
        avgDivLast10 = avgDiv.toFixed(1);
        
        const matchCount = last10Matches.length;
        avgDivLast10Explanation = `Average division in last ${matchCount} match${matchCount > 1 ? 'es' : ''}`;
        
        // Compare with overall average if we have enough data
        if (divisionData.length > last10Matches.length) {
          const overallAvg = divisionData.reduce((sum, item) => sum + item.division, 0) / divisionData.length;
          const difference = overallAvg - avgDiv;
          
          if (difference > 0.5) {
            avgDivLast10Explanation += " (Better than overall)";
          } else if (difference < -0.5) {
            avgDivLast10Explanation += " (Worse than overall)";
          } else {
            avgDivLast10Explanation += " (Similar to overall)";
          }
        }
      }
    }
    
    // Elite performance metrics
    const eliteRaces = filteredData.filter(item => item.division && item.division <= 5);
    const topPercentRaces = filteredData.filter(item => item.percentile && item.percentile <= 10);
    
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
      divisionCounts,
      trend,
      trendValue: Math.abs(trendValue).toFixed(1),
      avgDivLast10: avgDivLast10,
      avgDivLast10Explanation,
      eliteRaceCount: eliteRaces.length,
      topPercentCount: topPercentRaces.length,
      recentForm: recentRaces.length > 0 ? (recentRaces.reduce((sum, item) => sum + (item.percentile || 50), 0) / recentRaces.length).toFixed(1) : 'N/A'
    };
  }, [playerData, timeRange]);

  if (!stats) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="card-glass p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 bg-gray-400 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, color, delay, trend, onClick, isHovered }) => (
    <div 
      className={`relative overflow-hidden cursor-pointer transition-all duration-500 transform ${
        animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${isHovered ? 'scale-105 z-10' : 'scale-100'}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        background: isHovered 
          ? `linear-gradient(135deg, ${color}15, ${color}25)` 
          : 'var(--color-glass)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isHovered ? color + '40' : 'var(--color-glassBorder)'}`,
        borderRadius: '16px',
        boxShadow: isHovered 
          ? `0 20px 40px ${color}20, 0 0 0 1px ${color}30` 
          : '0 8px 32px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}10, transparent)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      
      {/* Floating particles effect */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                background: color,
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl" style={{ filter: isHovered ? 'brightness(1.2)' : 'none' }}>
              {icon}
            </span>
            {trend && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                trend === 'up' ? 'bg-green-100 text-green-800' : 
                trend === 'down' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium opacity-70" style={{ color: 'var(--color-textSecondary)' }}>
            {title}
          </p>
          <p 
            className="text-2xl font-bold transition-all duration-300"
            style={{ 
              color: isHovered ? color : 'var(--color-textPrimary)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs opacity-60" style={{ color: 'var(--color-textSecondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
    </div>
  );

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return { icon: '📈', color: '#10b981', trend: 'up' };
      case 'declining': return { icon: '📉', color: '#ef4444', trend: 'down' };
      default: return { icon: '📊', color: '#6b7280', trend: 'stable' };
    }
  };

  const trendInfo = getTrendIcon(stats.trend);

  return (
    <div className="mb-8 space-y-6">
      {/* Header with performance summary */}
      <div className={`text-center transition-all duration-700 ${
        animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="inline-flex items-center space-x-4 px-6 py-3 rounded-full" 
             style={{ 
               background: 'var(--color-glass)', 
               backdropFilter: 'blur(20px)',
               border: '1px solid var(--color-glassBorder)'
             }}>
          <span className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
            Performance Status:
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{trendInfo.icon}</span>
            <span className="font-bold" style={{ color: trendInfo.color }}>
              {stats.trend.charAt(0).toUpperCase() + stats.trend.slice(1)}
            </span>
            {stats.trendValue !== '0.0' && (
              <span className="text-sm opacity-70">
                ({stats.trendValue}% change)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Grid - Revolutionary Design */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <StatCard
          title="Total Races"
          value={stats.totalRaces}
          subtitle="Completed"
          icon="🏁"
          color="#3b82f6"
          delay={0}
          isHovered={hoveredCard === "Total Races"}
        />
        
        <StatCard
          title="Avg Division"
          value={stats.avgDivision}
          subtitle="Overall performance"
          icon="🏆"
          color="#8b5cf6"
          delay={100}
          trend={stats.trend === 'improving' ? 'up' : stats.trend === 'declining' ? 'down' : 'stable'}
          isHovered={hoveredCard === "Avg Division"}
        />
        
        <StatCard
          title="Best Division"
          value={stats.bestDivision}
          subtitle="Peak achievement"
          icon="⭐"
          color="#f59e0b"
          delay={200}
          isHovered={hoveredCard === "Best Division"}
        />
        
        <StatCard
          title="Avg Top %"
          value={`${stats.avgPercentile}%`}
          subtitle="Ranking percentile"
          icon="📊"
          color="#10b981"
          delay={300}
          isHovered={hoveredCard === "Avg Top %"}
        />
        
        <StatCard
          title="Best Rank"
          value={`#${stats.bestRank}`}
          subtitle="Highest position"
          icon="🥇"
          color="#ef4444"
          delay={400}
          isHovered={hoveredCard === "Best Rank"}
        />
        
        <StatCard
          title="Best Quali"
          value={`#${stats.bestQualification}`}
          subtitle="Qualification rank"
          icon="🎯"
          color="#06b6d4"
          delay={500}
          isHovered={hoveredCard === "Best Quali"}
        />
        
        <StatCard
          title="Avg Quali Top %"
          value={`${stats.avgQualification}%`}
          subtitle="Quali performance"
          icon="🚀"
          color="#ec4899"
          delay={600}
          isHovered={hoveredCard === "Avg Quali Top %"}
        />
      </div>

      {/* Advanced Analytics Section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 ${
        animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <StatCard
          title="Avg Div Last 10"
          value={stats.avgDivLast10}
          subtitle={stats.avgDivLast10Explanation}
          icon="📈"
          color="#8b5cf6"
          delay={700}
          isHovered={hoveredCard === "Avg Div Last 10"}
        />
        
        <StatCard
          title="Elite Races"
          value={stats.eliteRaceCount}
          subtitle="Division ≤ 5"
          icon="💎"
          color="#f59e0b"
          delay={800}
          isHovered={hoveredCard === "Elite Races"}
        />
        
        <StatCard
          title="Top 10% Races"
          value={stats.topPercentCount}
          subtitle="Elite performances"
          icon="🌟"
          color="#10b981"
          delay={900}
          isHovered={hoveredCard === "Top 10% Races"}
        />
        
        <StatCard
          title="Recent Form"
          value={`${stats.recentForm}%`}
          subtitle="Last 5 races avg"
          icon="⚡"
          color="#ef4444"
          delay={1000}
          trend={stats.trend === 'improving' ? 'up' : stats.trend === 'declining' ? 'down' : 'stable'}
          isHovered={hoveredCard === "Recent Form"}
        />
      </div>

    </div>
  );
};

export default StatsOverviewRevolutionary;
