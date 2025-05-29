// src/components/ResultsTable.js
import React, { useState, useMemo } from 'react';

const ResultsTable = ({ playerData }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Sort and filter data
  const sortedData = useMemo(() => {
    // First apply search filter if any
    let filtered = [...playerData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          (item.map && item.map.toLowerCase().includes(term)) ||
          (item.date && item.date.includes(term)) ||
          (item.mapType && item.mapType.toLowerCase().includes(term))
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
        case 'points':
          comparison = (a.points || 0) - (b.points || 0);
          break;
        case 'mapType':
          comparison = (a.mapType || '').localeCompare(b.mapType || '');
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
      className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {label}
        {sortBy === column && (
          <span className="ml-1">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Ergebnisse</h3>
        
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="border rounded py-1 px-2 mr-2 w-32 md:w-auto"
          />
          
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            className="border rounded py-1 px-2"
          >
            <option value={10}>10 Einträge</option>
            <option value={25}>25 Einträge</option>
            <option value={50}>50 Einträge</option>
            <option value={100}>100 Einträge</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <SortableHeader column="date" label="Datum" />
              <th className="py-2 px-3 text-left">Map</th>
              <SortableHeader column="mapType" label="Map-Typ" />
              <SortableHeader column="division" label="Division" />
              <SortableHeader column="divisionRank" label="Div. Rang" />
              <SortableHeader column="overallRank" label="Gesamt Rang" />
              <SortableHeader column="percentile" label="Top %" />
              <SortableHeader column="qualificationRank" label="Quali Rang" />
              <SortableHeader column="points" label="Punkte" />
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50' : 'bg-white hover:bg-blue-50'}
              >
                <td className="py-2 px-3 border-b">{formatDate(item.date)}</td>
                <td className="py-2 px-3 border-b font-medium" title={item.map}>
                  {item.map ? (
                    item.map.length > 30 ? `${item.map.substring(0, 27)}...` : item.map
                  ) : '-'}
                </td>
                <td className="py-2 px-3 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.mapType === 'Tech' ? 'bg-blue-100 text-blue-800' :
                    item.mapType === 'Dirt' ? 'bg-yellow-100 text-yellow-800' :
                    item.mapType === 'Fullspeed' ? 'bg-green-100 text-green-800' :
                    item.mapType === 'Ice' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.mapType || 'Other'}
                  </span>
                </td>
                <td className="py-2 px-3 border-b">
                  {item.division ? (
                    <span className={`font-medium ${
                      item.division <= 1 ? 'text-green-600' :
                      item.division <= 3 ? 'text-blue-600' :
                      item.division <= 5 ? 'text-purple-600' :
                      'text-gray-600'
                    }`}>
                      {item.division}
                    </span>
                  ) : '-'}
                </td>
                <td className="py-2 px-3 border-b">
                  {item.divisionRank ? (
                    <span className={
                      item.divisionRank <= 8 ? 'font-bold' : ''
                    }>
                      {item.divisionRank}{item.divisionPlayers ? `/${item.divisionPlayers}` : ''}
                    </span>
                  ) : '-'}
                </td>
                <td className="py-2 px-3 border-b">
                  {item.overallRank ? `${item.overallRank}/${item.totalPlayers || '?'}` : '-'}
                </td>
                <td className="py-2 px-3 border-b">
                  {item.percentile ? (
                    <span className={`font-medium ${
                      item.percentile <= 5 ? 'text-green-600' :
                      item.percentile <= 15 ? 'text-blue-600' :
                      item.percentile <= 30 ? 'text-purple-600' :
                      'text-gray-600'
                    }`}>
                      {item.percentile.toFixed(1)}%
                    </span>
                  ) : '-'}
                </td>
                <td className="py-2 px-3 border-b">
                  {item.qualificationRank ? (
                    `${item.qualificationRank}/${item.qualificationTotal || '?'}`
                  ) : '-'}
                </td>
                <td className="py-2 px-3 border-b font-semibold">
                  {item.points || '-'}
                </td>
              </tr>
            ))}
            
            {/* Empty state */}
            {displayData.length === 0 && (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">
                  {searchTerm ? 'Keine Ergebnisse für die Suche gefunden.' : 'Keine Daten vorhanden.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Zeige {((currentPage - 1) * pageSize) + 1} bis {Math.min(currentPage * pageSize, sortedData.length)} von {sortedData.length} Einträgen
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`py-1 px-2 rounded ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              &laquo;
            </button>
            <button
              onClick={() => setCurrentPage(prevPage => Math.max(1, prevPage - 1))}
              disabled={currentPage === 1}
              className={`py-1 px-2 rounded ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              &lt;
            </button>
            
            <span className="py-1 px-2">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prevPage => Math.min(totalPages, prevPage + 1))}
              disabled={currentPage === totalPages}
              className={`py-1 px-2 rounded ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`py-1 px-2 rounded ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'
              }`}
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