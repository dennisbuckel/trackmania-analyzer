// src/components/ChartsSection.js
import React, { useMemo, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Brush,
  Label,
  LabelList
} from 'recharts';

// Helper Functions
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const calculateMovingAverage = (data, key, windowSize = 5, newKey = null) => {
  if (!data || data.length < windowSize) return data;
  
  const result = [...data];
  const keyToAssign = newKey || `movingAvg${capitalize(key)}`;
  
  for (let i = 0; i < result.length; i++) {
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(result.length, i + halfWindow + 1);
    const windowData = result.slice(start, end);
    
    if (windowData.length >= 3) { 
      const sum = windowData.reduce((acc, item) => acc + (item[key] || 0), 0);
      result[i][keyToAssign] = sum / windowData.length;
    }
  }
  
  return result;
};

const calculateTrendline = (data, key, newKey = null) => {
  const n = data?.length || 0;
  if (n < 3) return [];
  
  const keyToAssign = newKey || `trend${capitalize(key)}`;
  const validData = data.filter(item => item[key] !== undefined && item[key] !== null);
  const validCount = validData.length;
  
  if (validCount < 3) return [];
  
  const indices = Array.from({ length: validCount }, (_, i) => i);
  const values = validData.map(item => item[key] || 0);
  
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < validCount; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }
  
  const slope = (validCount * sumXY - sumX * sumY) / (validCount * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / validCount;
  
  return data.map((item, idx) => ({
    date: item.date,
    fullDate: item.date,
    [keyToAssign]: intercept + slope * (indices.indexOf(idx) !== -1 ? indices.indexOf(idx) : null)
  }));
};

const formatDateForDisplay = (dateString, detailed = false) => {
  const date = new Date(dateString);
  return detailed
    ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    : `${date.getDate()}.${date.getMonth() + 1}`;
};

// Custom chart tooltips as memoized components
const CustomTooltip = React.memo(({ content, active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  return (
    <div className="bg-white p-2 border rounded shadow">
      {content(data)}
    </div>
  );
});

const PerformanceTrendline = ({ data }) => {
  const trendlineData = useMemo(() => {
    return calculateTrendline(data, 'percentile', 'trendPercentile');
  }, [data]);
  
  if (!trendlineData || trendlineData.length === 0) return null;
  
  return (
    <Line 
      type="monotone" 
      data={trendlineData}
      dataKey="trendPercentile" 
      stroke="#10b981" 
      strokeWidth={2} 
      strokeDasharray="5 5"
      name="Trend" 
      dot={false} 
      connectNulls={true}
      isAnimationActive={false}
    />
  );
};

const PerformanceMovingAverage = ({ data }) => {
  const dataWithMA = useMemo(() => {
    return calculateMovingAverage(data, 'percentile', 5);
  }, [data]);
  
  if (!dataWithMA) return null;
  
  return (
    <Line 
      type="monotone" 
      data={dataWithMA}
      dataKey="movingAvgPercentile" 
      stroke="#8b5cf6" 
      strokeWidth={2.5} 
      name="5-Race Avg" 
      dot={false} 
      connectNulls={true}
      isAnimationActive={false}
    />
  );
};

const DivisionRankTrendline = ({ data }) => {
  const trendlineData = useMemo(() => {
    return calculateTrendline(data, 'actualRank', 'trendRank');
  }, [data]);
  
  if (!trendlineData || trendlineData.length === 0) return null;
  
  return (
    <Line 
      type="monotone" 
      data={trendlineData}
      dataKey="trendRank" 
      stroke="#10b981" 
      strokeWidth={2} 
      strokeDasharray="5 5"
      name="Rank Trend" 
      dot={false} 
      connectNulls={true}
      isAnimationActive={false}
    />
  );
};

const ChartsSection = ({ playerData, activeView, timeRange, setTimeRange }) => {
  // State
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [detailLevel, setDetailLevel] = useState('standard');
  const [showMovingAverage, setShowMovingAverage] = useState(false);

  // Color constants
  const DIVISION_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#6B7280'];
  const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#ec4899',
    movingAvg: '#8b5cf6',
    trendline: '#10b981',
    total: '#6366f1'
  };

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    let data;
    
    if (!playerData || playerData.length === 0) return [];
    
    switch (timeRange) {
      case 'all':
        data = [...playerData];
        break;
      case 'recent10':
        data = [...playerData].slice(0, 10);
        break;
      case 'recent20':
        data = [...playerData].slice(0, 20);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          data = playerData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
          });
        } else {
          data = [...playerData];
        }
        break;
      default: {
        const now = new Date();
        const cutoffDate = new Date();
        
        if (timeRange === '3months') {
          cutoffDate.setMonth(now.getMonth() - 3);
        } else if (timeRange === 'month') {
          cutoffDate.setMonth(now.getMonth() - 1);
        } else if (timeRange === 'week') {
          cutoffDate.setDate(now.getDate() - 7);
        }
        
        data = playerData.filter(item => new Date(item.date) >= cutoffDate);
      }
    }
    
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [playerData, timeRange, customStartDate, customEndDate]);

  // Format date based on detail level
  const formatDate = useCallback((dateString) => {
    return formatDateForDisplay(dateString, detailLevel === 'detailed');
  }, [detailLevel]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (filteredData.length === 0) return {};
    
    const performance = filteredData.map((item, index) => ({
      date: formatDate(item.date),
      fullDate: item.date,
      percentile: item.percentile || null,
      division: item.division || null,
      map: item.map || '',
      index: index,
      overallRank: item.overallRank || 0,
      totalPlayers: item.totalPlayers || 0,
      divisionRank: item.divisionRank || 0,
      divisionPlayers: item.divisionPlayers || 0
    }));
    
    const divisionCounts = {};
    filteredData.forEach(item => {
      if (item.division) {
        divisionCounts[item.division] = (divisionCounts[item.division] || 0) + 1;
      }
    });
    
    const divisionDistribution = Object.entries(divisionCounts)
      .map(([division, count]) => ({
        division: parseInt(division, 10),
        count,
        percentage: Math.round((count / filteredData.length) * 100)
      }))
      .sort((a, b) => a.division - b.division);

    const divisionProgressData = filteredData.map((item, index) => ({
      date: formatDate(item.date),
      fullDate: item.date,
      division: item.division || null,
      race: index + 1,
      map: item.map || ''
    })).filter(item => item.division !== null);

    const divisionRankData = filteredData
      .filter(item => item.division && item.divisionRank && item.divisionPlayers)
      .map((item, index) => ({
        date: formatDate(item.date),
        fullDate: item.date,
        division: item.division,
        divisionRank: item.divisionRank,
        divisionPlayers: item.divisionPlayers,
        actualRank: item.divisionRank,
        map: item.map || '',
        index: index
      }));
    
    return {
      performance,
      divisionDistribution,
      divisionProgressData,
      divisionRankData,
    };
  }, [filteredData, formatDate]);

  // Tooltip content generators
  const tooltipContent = useMemo(() => ({
    performance: (data) => (
      <>
        <p className="font-semibold">{data.fullDate}</p>
        <p>{data.map}</p>
        <p>Division: {data.division}</p>
        <p>Top: {data.percentile !== null ? data.percentile.toFixed(2) + '%' : 'N/A'}</p>
        <p>Rank: {data.overallRank}/{data.totalPlayers}</p>
      </>
    ),
    division: (data) => (
      <>
        <p>Division {data.division}</p>
        <p>{data.count} Races ({data.percentage}%)</p>
      </>
    ),
    divisionProgress: (data) => (
      <>
        <p className="font-semibold">{data.fullDate}</p>
        <p>{data.map}</p>
        <p>Division: {data.division}</p>
        <p>Race #: {data.race}</p>
      </>
    ),
    divisionRank: (data) => (
      <>
        <p className="font-semibold">{data.fullDate}</p>
        <p>{data.map}</p>
        <p>Division: {data.division}</p>
        <p>Division Rank: {data.divisionRank}/{data.divisionPlayers}</p>
        <p>Position: {data.actualRank}</p>
      </>
    )
  }), []);

  // Custom date range form handler
  const handleDateRangeSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!customStartDate || !customEndDate) {
      alert("Please enter both start and end dates");
      return;
    }
    
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    
    if (start > end) {
      alert("Start date must be before end date");
      return;
    }
    
    setTimeRange('custom');
  }, [customStartDate, customEndDate, setTimeRange]);

  // Reset custom date range
  const resetDateRange = useCallback(() => {
    setCustomStartDate('');
    setCustomEndDate('');
    setTimeRange('all');
  }, [setTimeRange]);

  // Calculate interval for x-axis labels
  const getXAxisInterval = useCallback((dataArray) => {
    if (!dataArray) return 0;
    return Math.max(Math.floor(dataArray.length / 10), 1);
  }, []);

  // Custom dot renderer to highlight best performance
  const findBestPerformance = (data, key, isLowerBetter = false) => {
    if (!data || data.length === 0) return null;
    
    let bestIdx = -1;
    let bestValue = isLowerBetter ? Infinity : -Infinity;
    
    data.forEach((item, idx) => {
      const value = item[key];
      if (value === null || value === undefined) return;
      
      if ((isLowerBetter && value < bestValue) || 
          (!isLowerBetter && value > bestValue)) {
        bestValue = value;
        bestIdx = idx;
      }
    });
    
    return bestIdx >= 0 ? bestIdx : null;
  };

  const renderCustomDot = (dataKey, chartData, isLowerBetter = false) => (props) => {
    const { cx, cy, index, payload } = props;
    
    if (payload[dataKey] === null || payload[dataKey] === undefined) {
      return null;
    }
    
    const bestIdx = findBestPerformance(chartData, dataKey, isLowerBetter);
    
    if (index === bestIdx) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={6}
          fill="#10B981" 
          stroke="#047857"
          strokeWidth={2}
        />
      );
    }
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={2}
        fill={CHART_COLORS.primary} 
      />
    );
  };

  // Render different charts based on activeView
  const renderChart = () => {
    if (!chartData || Object.keys(chartData).length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
          <p className="text-gray-500">No data available for the selected time range</p>
        </div>
      );
    }
    
    switch (activeView) {
      case 'performance':
        return (
          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.performance} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  interval={getXAxisInterval(chartData.performance)} 
                />
                <YAxis 
                  reversed
                  domain={[0, 100]} 
                  label={{ value: 'Top %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={(props) => 
                  <CustomTooltip {...props} content={tooltipContent.performance} />
                } />
                <Legend verticalAlign="top" height={36} />
                
                {/* Main performance line */}
                <Line 
                  type="monotone" 
                  dataKey="percentile" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={2} 
                  name="Top %" 
                  connectNulls={true}
                  dot={renderCustomDot('percentile', chartData.performance, true)}
                  activeDot={{ r: 5 }} 
                  isAnimationActive={false}
                />
                
                {/* Conditionally render 5-day moving average */}
                {showMovingAverage && (
                  <PerformanceMovingAverage data={chartData.performance} />
                )}
                
                {/* Trendline always visible */}
                <PerformanceTrendline data={chartData.performance} />
                
                <ReferenceLine y={20} stroke="#10B981" strokeDasharray="3 3">
                  <Label position="right" value="Div 1" fill="#10B981" fontSize={12} />
                </ReferenceLine>
                <ReferenceLine y={40} stroke="#3B82F6" strokeDasharray="3 3">
                  <Label position="right" value="Div 2" fill="#3B82F6" fontSize={12} />
                </ReferenceLine>
                
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke="#3b82f6"
                  tickFormatter={() => ''}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'division':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.divisionDistribution} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="division" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: 'Division', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Races', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={(props) => 
                  <CustomTooltip {...props} content={tooltipContent.division} />
                } />
                <Legend />
                <Bar dataKey="count" name="Races">
                  {chartData.divisionDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={DIVISION_COLORS[Math.min(entry.division - 1, DIVISION_COLORS.length - 1)]} 
                    />
                  ))}
                  <LabelList dataKey="count" position="top" fill="#333" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'divisionProgress':
        return (
          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.divisionProgressData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  interval={getXAxisInterval(chartData.divisionProgressData)} 
                />
                <YAxis 
                  domain={[0, 'dataMax + 2']} 
                  reversed 
                  label={{ value: 'Division', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={(props) => 
                  <CustomTooltip {...props} content={tooltipContent.divisionProgress} />
                } />
                <Legend verticalAlign="top" height={36} />
                
                <Line 
                  type="monotone" 
                  dataKey="division" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={2} 
                  name="Division" 
                  connectNulls={true}
                  dot={renderCustomDot('division', chartData.divisionProgressData, true)}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
                
                <ReferenceLine y={1} stroke="#10B981" strokeDasharray="3 3">
                  <Label position="right" value="Div 1" fill="#10B981" fontSize={12} />
                </ReferenceLine>
                <ReferenceLine y={3} stroke="#3B82F6" strokeDasharray="3 3">
                  <Label position="right" value="Div 3" fill="#3B82F6" fontSize={12} />
                </ReferenceLine>
                
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke="#3b82f6"
                  tickFormatter={() => ''}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'divisionRank':
        return (
          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.divisionRankData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  interval={getXAxisInterval(chartData.divisionRankData)} 
                />
                <YAxis 
                  reversed
                  domain={['dataMax + 5', 1]}
                  label={{ value: 'Position', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={(props) => 
                  <CustomTooltip {...props} content={tooltipContent.divisionRank} />
                } />
                <Legend />
                
                <Line 
                  type="monotone" 
                  dataKey="actualRank" 
                  stroke={CHART_COLORS.secondary} 
                  strokeWidth={2} 
                  name="Division Position" 
                  connectNulls={true}
                  dot={renderCustomDot('actualRank', chartData.divisionRankData, true)}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
                
                <DivisionRankTrendline data={chartData.divisionRankData} />
                
                <ReferenceLine y={3} stroke="#10B981" strokeDasharray="3 3">
                  <Label position="right" value="Top 3" fill="#10B981" fontSize={12} />
                </ReferenceLine>
                <ReferenceLine y={10} stroke="#3B82F6" strokeDasharray="3 3">
                  <Label position="right" value="Top 10" fill="#3B82F6" fontSize={12} />
                </ReferenceLine>
                
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke="#3b82f6"
                  tickFormatter={() => ''}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      {/* Time filter buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {['all', '3months', 'month', 'week', 'recent10', 'recent20'].map(range => (
          <button 
            key={range}
            onClick={() => setTimeRange(range)} 
            className={`${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-200'} py-1 px-3 rounded`}
          >
            {range === 'all' ? 'All Time' : 
             range === '3months' ? '3 Months' : 
             range === 'month' ? '1 Month' : 
             range === 'week' ? '1 Week' : 
             range === 'recent10' ? 'Last 10' : 'Last 20'}
          </button>
        ))}
        {activeView === 'performance' && (
          <button 
            onClick={() => setShowMovingAverage(!showMovingAverage)}
            className={`${showMovingAverage ? 'bg-blue-600 text-white' : 'bg-gray-200'} py-1 px-3 rounded`}
          >
            {showMovingAverage ? 'Hide 5-Day Avg' : 'Show 5-Day Avg'}
          </button>
        )}
      </div>

      {/* Custom date range selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <form onSubmit={handleDateRangeSubmit} className="flex flex-wrap items-center gap-2">
          <input 
            type="date" 
            value={customStartDate} 
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="border rounded py-1 px-2 text-sm"
          />
          <span>to</span>
          <input 
            type="date" 
            value={customEndDate} 
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="border rounded py-1 px-2 text-sm"
          />
          <button 
            type="submit" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded text-sm"
          >
            Apply
          </button>
          {timeRange === 'custom' && (
            <button 
              type="button" 
              onClick={resetDateRange}
              className="bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded text-sm"
            >
              Reset
            </button>
          )}
        </form>
        
        <div className="ml-auto flex items-center gap-3">
          <select
            value={detailLevel}
            onChange={(e) => setDetailLevel(e.target.value)}
            className="border rounded py-1 px-2 text-sm"
          >
            <option value="standard">Standard Detail</option>
            <option value="detailed">High Detail</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-2">
          {activeView === 'performance' ? 'Performance (Top %)' :
           activeView === 'division' ? 'Division Distribution' :
           activeView === 'divisionProgress' ? 'Division Progress Over Time' :
           activeView === 'divisionRank' ? 'Division Rank Position' : ''}
        </h3>
        {renderChart()}
      </div>
      
      {/* Legend for chart elements */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Data point</span>
        </div>
        <div className="flex items-center ml-3">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Best result</span>
        </div>
        {(activeView === 'performance' || activeView === 'divisionRank') && (
          <>
            <div className="flex items-center ml-3">
              <div className="w-4 h-0.5 bg-purple-500 mr-1"></div>
              <span>5-Race Avg</span>
            </div>
            <div className="flex items-center ml-3">
              <div className="w-4 h-0.5 bg-green-500 border-b border-dashed border-green-500 mr-1"></div>
              <span>Trend</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChartsSection);
