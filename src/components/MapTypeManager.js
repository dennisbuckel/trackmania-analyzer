// src/components/MapTypeManager.js
import React, { useState, useEffect } from 'react';

const MapTypeManager = ({ playerData, updatePlayerData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maps, setMaps] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'classified', 'unclassified'
  const [searchTerm, setSearchTerm] = useState('');

  // Available map types
  const mapTypes = [
    'Tech', 'Dirt', 'Fullspeed', 'Ice', 'Water', 'Plastic', 'Mixed', 'LOL', 'RPG', 'Other'
  ];

  // Extract unique maps from player data
  useEffect(() => {
    if (playerData && playerData.length > 0) {
      const uniqueMaps = {};
      
      playerData.forEach(entry => {
        if (entry.map && !uniqueMaps[entry.map]) {
          uniqueMaps[entry.map] = {
            name: entry.map,
            type: entry.mapType || 'Unknown',
            occurrences: 1
          };
        } else if (entry.map) {
          uniqueMaps[entry.map].occurrences++;
        }
      });
      
      setMaps(Object.values(uniqueMaps).sort((a, b) => b.occurrences - a.occurrences));
    }
  }, [playerData]);

  // Filter maps based on current filter and search term
  const filteredMaps = maps.filter(map => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'classified' && map.type !== 'Unknown') || 
      (filter === 'unclassified' && map.type === 'Unknown');
    
    const matchesSearch = 
      !searchTerm || 
      map.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Update the map type
  const handleMapTypeChange = (mapName, newType) => {
    // Update local state
    setMaps(maps.map(map => 
      map.name === mapName ? { ...map, type: newType } : map
    ));
    
    // Update player data
    const updatedPlayerData = playerData.map(entry => 
      entry.map === mapName ? { ...entry, mapType: newType } : entry
    );
    
    updatePlayerData(updatedPlayerData);
  };

  // Bulk update map types
  const handleBulkUpdate = (type) => {
    const mapNamesToUpdate = filteredMaps.map(map => map.name);
    
    // Update local state
    setMaps(maps.map(map => 
      mapNamesToUpdate.includes(map.name) ? { ...map, type } : map
    ));
    
    // Update player data
    const updatedPlayerData = playerData.map(entry => 
      mapNamesToUpdate.includes(entry.map) ? { ...entry, mapType: type } : entry
    );
    
    updatePlayerData(updatedPlayerData);
  };

  // Auto-classify maps based on name patterns
  const autoClassifyMaps = () => {
    const updatedMaps = maps.map(map => {
      if (map.type !== 'Unknown') {
        return map;
      }
      
      const name = map.name.toLowerCase();
      let type = 'Unknown';
      
      if (name.includes('tech') || name.includes('precision')) {
        type = 'Tech';
      } else if (name.includes('dirt') || name.includes('rally') || name.includes('off-road')) {
        type = 'Dirt';
      } else if (name.includes('speed') || name.includes('flow') || name.includes('fast')) {
        type = 'Fullspeed';
      } else if (name.includes('ice') || name.includes('winter') || name.includes('snow')) {
        type = 'Ice';
      } else if (name.includes('water') || name.includes('plastic')) {
        type = 'Water';
      }
      
      return { ...map, type };
    });
    
    setMaps(updatedMaps);
    
    // Update player data
    const updatedPlayerData = playerData.map(entry => {
      const matchedMap = updatedMaps.find(map => map.name === entry.map);
      return matchedMap && matchedMap.type !== 'Unknown' 
        ? { ...entry, mapType: matchedMap.type } 
        : entry;
    });
    
    updatePlayerData(updatedPlayerData);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded"
      >
        Manage Map Types
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Map Type Manager</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={autoClassifyMaps}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
            >
              Auto-Classify
            </button>
            
            <div className="ml-auto flex gap-2">
              <input
                type="text"
                placeholder="Search maps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded py-1 px-2"
              />
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded py-1 px-2"
              >
                <option value="all">All Maps</option>
                <option value="classified">Classified</option>
                <option value="unclassified">Unclassified</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filter === 'unclassified' && (
              <>
                <span className="text-sm mt-1">Bulk set to:</span>
                {mapTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleBulkUpdate(type)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs py-1 px-2 rounded"
                  >
                    {type}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left">Map Name</th>
                <th className="py-2 px-3 text-left">Type</th>
                <th className="py-2 px-3 text-left">Occurrences</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaps.map((map, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 border-t">{map.name}</td>
                  <td className="py-2 px-3 border-t">
                    <select
                      value={map.type}
                      onChange={(e) => handleMapTypeChange(map.name, e.target.value)}
                      className={`border rounded py-1 px-2 ${
                        map.type === 'Unknown' ? 'bg-yellow-50' : 'bg-green-50'
                      }`}
                    >
                      <option value="Unknown">Unknown</option>
                      {mapTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3 border-t">{map.occurrences}</td>
                </tr>
              ))}
              
              {filteredMaps.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No maps found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <span className="text-sm text-gray-500">
            {maps.length} total maps, {maps.filter(m => m.type !== 'Unknown').length} classified
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapTypeManager;