// src/components/ResultsTable.js
import React, { useState, useMemo } from 'react';
import { getTranslation } from '../i18n/translations';

const ResultsTable = ({ playerData }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  // Sort and filter data
  const sortedData = useMemo(() => {
    // First apply search filter if any
    let filtered = [...playerData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          (item.map && item.map.toLowerCase().includes(term)) ||
          (item.date && item.date.includes(term))
        );
      });
    }
    
    // Then sort
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'division':
          comparison = (a.division || Infinity) - (b.division || Infinity);
          break;
        case 'divisionRank':
          comparison = (a.divisionRank || Infinity) - (b.divisionRank || Infinity);
          break;
        case 'overallRank':
          comparison = (a.overallRank || Infinity) - (b.overallRank || Infinity);
          break;
        case 'percentile':
          comparison = (a.percentile || Infinity) - (b.percentile || Infinity);
          break;
        case 'qualificationRank':
          comparison = (a.qualificationRank || Infinity) - (b.qualificationRank || Infinity);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [playerData, sortBy, sortOrder, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const displayData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to descending
      setSortBy(column);
      setSortOrder('desc');
    }
    
    // Reset to first page when sorting
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  // Column header with sort indicator
  const SortableHeader = ({ column, label }) => (
    <th 
      className="py-2 px-3 text-left cursor-pointer transition-colors duration-200"
      onClick={() => handleSort(column)}
      style={{
        color: 'var(--color-textPrimary)',
        ':hover': {
          backgroundColor: 'var(--color-surfaceHover)'
        }
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-surfaceHover)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    >
      <div className="flex items-center">
        {label}
        {sortBy === column && (
          <span className="ml-1" style={{ color: 'var(--color-primary)' }}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>Results</h3>
        
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="rounded py-1 px-2 mr-2 w-32 md:w-auto"
            style={{
              border: `1px solid var(--color-border)`,
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-textPrimary)'
            }}
          />
          
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            className="rounded py-1 px-2"
            style={{
              border: `1px solid var(--color-border)`,
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-textPrimary)'
            }}
          >
            <option value={10}>10 entries</option>
            <option value={25}>25 entries</option>
            <option value={50}>50 entries</option>
            <option value={100}>100 entries</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-backgroundSecondary)', borderBottom: `1px solid var(--color-border)` }}>
              <SortableHeader column="date" label="Date" />
              <th className="py-2 px-3 text-left" style={{ color: 'var(--color-textPrimary)' }}>Map</th>
              <SortableHeader column="division" label="Division" />
              <SortableHeader column="divisionRank" label="Div. Rank" />
              <SortableHeader column="overallRank" label="Overall Rank" />
              <SortableHeader column="percentile" label="Top %" />
              <SortableHeader column="qualificationRank" label="Quali Rank" />
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, idx) => (
              <tr
                key={idx}
                className="transition-colors duration-200 hover:opacity-80"
                style={{
                  backgroundColor: idx % 2 === 0 ? 'var(--color-backgroundSecondary)' : 'var(--color-surface)',
                  color: 'var(--color-textPrimary)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-surfaceHover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = idx % 2 === 0 ? 'var(--color-backgroundSecondary)' : 'var(--color-surface)'}
              >
                <td className="py-2 px-3" style={{ borderBottom: `1px solid var(--color-border)` }}>{formatDate(item.date)}</td>
                <td className="py-2 px-3 font-medium" style={{ borderBottom: `1px solid var(--color-border)` }} title={item.map}>
                  {item.map ? (
                    item.map.length > 30 ? `${item.map.substring(0, 27)}...` : item.map
                  ) : '-'}
                </td>
                <td className="py-2 px-3" style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {item.division ? (
                    <span className="font-medium" style={{
                      color: item.division <= 1 ? 'var(--color-success)' :
                             item.division <= 3 ? 'var(--color-primary)' :
                             item.division <= 5 ? 'var(--color-accent)' :
                             'var(--color-textMuted)'
                    }}>
                      {item.division}
                    </span>
                  ) : '-'}
                </td>
                <td className="py-2 px-3" style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {item.divisionRank ? (
                    <span className={item.divisionRank <= 8 ? 'font-bold' : ''}>
                      {item.divisionRank}{item.divisionPlayers ? `/${item.divisionPlayers}` : ''}
                    </span>
                  ) : '-'}
                </td>
                <td className="py-2 px-3" style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {item.overallRank ? `${item.overallRank}/${item.totalPlayers || '?'}` : '-'}
                </td>
                <td className="py-2 px-3" style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {item.percentile ? (
                    <span className="font-medium" style={{
                      color: item.percentile <= 5 ? 'var(--color-success)' :
                             item.percentile <= 15 ? 'var(--color-primary)' :
                             item.percentile <= 30 ? 'var(--color-accent)' :
                             'var(--color-textMuted)'
                    }}>
                      {item.percentile.toFixed(1)}%
                    </span>
                  ) : '-'}
                </td>
                <td className="py-2 px-3" style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {item.qualificationRank ? (
                    `${item.qualificationRank}/${item.qualificationTotal || '?'}`
                  ) : '-'}
                </td>
              </tr>
            ))}
            
            {/* Empty state */}
            {displayData.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center" style={{ color: 'var(--color-textMuted)' }}>
                  {searchTerm ? 'No results found for your search.' : 'No data available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="py-1 px-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: currentPage === 1 ? 'var(--color-backgroundSecondary)' : 'var(--color-secondary)',
                color: currentPage === 1 ? 'var(--color-textMuted)' : 'var(--color-textInverse)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              &laquo;
            </button>
            <button
              onClick={() => setCurrentPage(prevPage => Math.max(1, prevPage - 1))}
              disabled={currentPage === 1}
              className="py-1 px-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: currentPage === 1 ? 'var(--color-backgroundSecondary)' : 'var(--color-secondary)',
                color: currentPage === 1 ? 'var(--color-textMuted)' : 'var(--color-textInverse)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              &lt;
            </button>
            
            <span className="py-1 px-2" style={{ color: 'var(--color-textPrimary)' }}>
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prevPage => Math.min(totalPages, prevPage + 1))}
              disabled={currentPage === totalPages}
              className="py-1 px-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: currentPage === totalPages ? 'var(--color-backgroundSecondary)' : 'var(--color-secondary)',
                color: currentPage === totalPages ? 'var(--color-textMuted)' : 'var(--color-textInverse)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="py-1 px-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: currentPage === totalPages ? 'var(--color-backgroundSecondary)' : 'var(--color-secondary)',
                color: currentPage === totalPages ? 'var(--color-textMuted)' : 'var(--color-textInverse)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
