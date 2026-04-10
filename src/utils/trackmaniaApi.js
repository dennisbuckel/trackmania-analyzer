/**
 * Trackmania.io API Utility
 * Fetches player data directly from trackmania.io via local proxy
 */

const API_BASE = '/tmio-api';

/**
 * Strip Trackmania formatting codes from strings (e.g. $f70, $s, $o, $i, $z, $FFF, etc.)
 */
function stripTmFormatting(str) {
  if (!str) return '';
  // Remove $l[...] link tags
  let cleaned = str.replace(/\$[lL]\[.*?\]/g, '');
  // Remove $$ (escaped dollar sign) → single $
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/\$\$/g, '\u0000');
  // Remove all $X, $XX, $XXX format codes (color, style, etc.)
  cleaned = cleaned.replace(/\$[0-9a-fA-F]{1,3}/g, '');
  cleaned = cleaned.replace(/\$[sobiwngtlhpSOBIWNGTLHP]/g, '');
  cleaned = cleaned.replace(/\$[zZ]/g, '');
  // Restore escaped dollar signs
  cleaned = cleaned.replace(/\u0000/g, '$');
  // Replace HTML entities
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  return cleaned.trim();
}

/**
 * Search for players by name
 * @param {string} name - Player name to search for
 * @returns {Promise<Array>} - Array of player objects { id, name, zone }
 */
export async function searchPlayer(name) {
  if (!name || name.trim().length < 2) {
    throw new Error('Please enter at least 2 characters.');
  }

  const response = await fetch(`${API_BASE}/players/find?search=${encodeURIComponent(name.trim())}`);
  
  if (!response.ok) {
    throw new Error(`Search failed (${response.status}). Please try again.`);
  }

  const data = await response.json();
  
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No players found for "${name}".`);
  }

  // Map to simplified format
  return data.map(item => ({
    id: item.player.id,
    name: stripTmFormatting(item.player.name),
    tag: item.player.tag ? stripTmFormatting(item.player.tag) : null,
    zone: buildZoneString(item.player.zone),
    flag: item.player.zone?.parent?.flag || item.player.zone?.flag || null,
    country: getCountryFromZone(item.player.zone),
  }));
}

/**
 * Fetch player profile by account ID
 * @param {string} accountId - Player UUID
 * @returns {Promise<Object>} - Player profile
 */
export async function fetchPlayerProfile(accountId) {
  const response = await fetch(`${API_BASE}/player/${accountId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to load player profile (${response.status}).`);
  }

  const data = await response.json();
  return {
    id: data.accountid,
    name: stripTmFormatting(data.displayname),
    tag: data.clubtag ? stripTmFormatting(data.clubtag) : null,
  };
}

/**
 * Fetch ALL COTD data for a player (handles pagination automatically)
 * @param {string} accountId - Player UUID
 * @param {function} onProgress - Progress callback (loaded, total)
 * @returns {Promise<Object>} - { cups: Array, stats: Object, playerName: string }
 */
export async function fetchPlayerCotdData(accountId, onProgress = null) {
  // First page to get total count and stats
  const firstPage = await fetchCotdPage(accountId, 0);
  
  if (!firstPage || !firstPage.cups || firstPage.cups.length === 0) {
    throw new Error('No COTD data found for this player.');
  }

  const totalEntries = firstPage.stats?.total || firstPage.cups.length;
  const entriesPerPage = firstPage.cups.length; // Usually 25
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  let allCups = [...firstPage.cups];
  
  if (onProgress) {
    onProgress(allCups.length, totalEntries);
  }

  // Fetch remaining pages
  for (let page = 1; page < totalPages; page++) {
    try {
      const pageData = await fetchCotdPage(accountId, page);
      if (pageData && pageData.cups && pageData.cups.length > 0) {
        allCups = [...allCups, ...pageData.cups];
        if (onProgress) {
          onProgress(allCups.length, totalEntries);
        }
      } else {
        break; // No more data
      }
    } catch (err) {
      console.warn(`Failed to fetch page ${page}:`, err.message);
      break;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  return {
    cups: allCups,
    stats: firstPage.stats || {},
    statsPrimary: firstPage.statsprimary || {},
  };
}

/**
 * Fetch a single COTD page
 */
async function fetchCotdPage(accountId, page) {
  const response = await fetch(`${API_BASE}/player/${accountId}/cotd/${page}`);
  
  if (!response.ok) {
    throw new Error(`Failed to load COTD data page ${page} (${response.status}).`);
  }

  return response.json();
}

/**
 * Calculate the number of players in a specific division.
 * In COTD, each division has up to 64 players. The last division may have fewer.
 * @param {number} division - The division number (1-based)
 * @param {number} totalPlayers - Total number of players in the COTD
 * @returns {number} - Estimated number of players in that division
 */
function estimateDivisionPlayers(division, totalPlayers) {
  if (!division || !totalPlayers || division <= 0) return 64;
  const totalDivisions = Math.ceil(totalPlayers / 64);
  // Last division gets the remainder
  if (division >= totalDivisions) {
    const remainder = totalPlayers % 64;
    return remainder === 0 ? 64 : remainder;
  }
  return 64;
}

/**
 * Convert API COTD data to the app's internal format.
 * Output matches the exact same data model as the manual text parser,
 * ensuring consistent display regardless of data source.
 * 
 * Expected fields per entry (same as manual parser):
 *   format, date, cotdNumber, map, division, divisionRank, divisionPlayers,
 *   overallRank, totalPlayers, percentile, qualificationRank, qualificationTotal,
 *   qualificationPercentile, points
 * 
 * @param {Array} cups - Raw cups array from API
 * @returns {Array} - Converted data in app format
 */
export function convertApiDataToAppFormat(cups) {
  return cups
    .filter(cup => cup && cup.name)
    .map(cup => {
      // Parse date from name "COTD 2026-04-08 #1"
      const dateMatch = cup.name.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : new Date(cup.timestamp).toISOString().split('T')[0];
      
      // Parse COTD number
      const numberMatch = cup.name.match(/#(\d+)/);
      const cotdNumber = numberMatch ? parseInt(numberMatch[1], 10) : 1;

      // Clean map name (strip Trackmania formatting codes)
      const mapName = stripTmFormatting(cup.mapname || 'Unknown Map');

      const totalPlayers = cup.totalplayers || 0;
      const division = cup.div || 0;
      const divisionRank = cup.divrank || 0;
      const overallRank = cup.rank || 0;
      const qualificationRank = cup.qualificationrank || 0;

      // Calculate divisionPlayers dynamically (not hardcoded 64)
      const divisionPlayers = estimateDivisionPlayers(division, totalPlayers);

      // Calculate percentile (top X%) — same formula as trackmania.io
      const percentile = totalPlayers > 0 && overallRank > 0
        ? parseFloat(((overallRank / totalPlayers) * 100).toFixed(2))
        : 0;

      // Calculate qualification percentile
      const qualificationPercentile = totalPlayers > 0 && qualificationRank > 0
        ? parseFloat(((qualificationRank / totalPlayers) * 100).toFixed(2))
        : 0;

      const entry = {
        format: 'COTD',
        date,
        cotdNumber,
        map: mapName,
        division: division,
        divisionRank: divisionRank,
        divisionPlayers: divisionPlayers,
        overallRank: overallRank,
        totalPlayers: totalPlayers,
        percentile: percentile,
        qualificationRank: qualificationRank,
        qualificationTotal: totalPlayers,
        qualificationPercentile: qualificationPercentile,
      };

      // Calculate points (same as manual parser)
      calculatePoints(entry);

      return entry;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Calculate points based on division and rank (same logic as existing parsers)
 */
function calculatePoints(entry) {
  if (entry.unplayed || !entry.division || !entry.divisionRank) {
    entry.points = 0;
    return;
  }
  
  const divisionBase = Math.max(0, 600 - (entry.division * 100));
  const rankPercentage = Math.max(0, 1 - ((entry.divisionRank - 1) / 64));
  entry.points = Math.round(divisionBase * rankPercentage);

  if (entry.division === 1 && entry.divisionRank <= 8) {
    entry.points += (9 - entry.divisionRank) * 25;
  }
}

/**
 * Build zone string from nested zone object
 */
function buildZoneString(zone) {
  if (!zone) return 'Unknown';
  const parts = [];
  let current = zone;
  while (current && current.name !== 'World') {
    parts.push(current.name);
    current = current.parent;
  }
  // Show: City, Country or just Country
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[parts.length - 1]}`;
  }
  return parts[0] || 'Unknown';
}

/**
 * Get country name from zone
 */
function getCountryFromZone(zone) {
  if (!zone) return 'Unknown';
  let current = zone;
  // Walk up to the country level (parent of continent)
  while (current && current.parent && current.parent.name !== 'World' && current.parent.parent && current.parent.parent.name !== 'World') {
    current = current.parent;
  }
  return current?.name || 'Unknown';
}
