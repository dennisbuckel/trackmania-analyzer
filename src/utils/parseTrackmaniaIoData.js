/**
 * Spezialisierter Parser für trackmania.io Datenformat
 * Revolutionärer Ansatz: Strukturierte Datenextraktion statt Regex-Rätselraten
 * 
 * Unterstützt zwei Modi:
 * 1. Mit Header: Vollständige Tabelle von trackmania.io kopiert (empfohlen)
 * 2. Ohne Header: Nur die Datenzeilen kopiert (flexibler Parsing-Modus)
 */

export default function parseTrackmaniaIoData(textData) {
  
  const lines = textData.split('\n').map(line => line.trim()).filter(line => line);
  const results = [];
  const errors = [];
  

  // Erkenne Header-Zeile (optional - falls vorhanden)
  const headerIndex = lines.findIndex(line => 
    line.includes('Cup of the Day') && 
    line.includes('Map') && 
    line.includes('Division') && 
    line.includes('Rank')
  );

  let startIndex = 0;
  let hasHeader = false;

  if (headerIndex !== -1) {
    startIndex = headerIndex + 1;
    hasHeader = true;
  } else {
    startIndex = 0;
    hasHeader = false;
  }

  let currentEntry = null;
  let lineNumber = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    lineNumber = i + 1;

    try {
      // Überspringe leere Zeilen
      if (!line) continue;

      // Erkenne COTD-Zeile (beginnt mit "COTD" oder "Cup of the Day" oder enthält Datum-Pattern)
      if (line.startsWith('COTD ') || line.startsWith('Cup of the Day ') || isCotdLine(line)) {
        // Speichere vorherigen Eintrag falls vorhanden
        if (currentEntry && isValidEntry(currentEntry)) {
          calculatePoints(currentEntry);
          results.push({ ...currentEntry });
        }

        // Parse COTD-Zeile
        currentEntry = parseCotdLine(line);
        if (!currentEntry) {
          errors.push(`Zeile ${lineNumber}: Ungültiges COTD-Format: "${line}"`);
          continue;
        }
        continue;
      }

      // Überspringe Zeitangaben (z.B. "16 hours ago", "4 days ago")
      if (line.includes('ago') || line.includes('hour') || line.includes('day') || line.includes('month')) {
        continue;
      }

      // Wenn wir keinen aktuellen Eintrag haben, versuche einen zu erstellen
      if (!currentEntry) {
        // Ohne Header: Versuche aus der ersten Datenzeile ein COTD-Entry zu erstellen
        if (!hasHeader) {
          const inferredEntry = inferCotdFromDataLine(line, lineNumber);
          if (inferredEntry) {
            currentEntry = inferredEntry;
          } else {
            continue;
          }
        } else {
          continue;
        }
      }

      // Parse Datenzeile (Tab-getrennte Werte)
      const dataResult = parseDataLine(line, currentEntry);
      if (dataResult.error) {
        errors.push(`Zeile ${lineNumber}: ${dataResult.error}`);
      } else if (dataResult.entry) {
        currentEntry = dataResult.entry;
      }

    } catch (error) {
      errors.push(`Zeile ${lineNumber}: Unerwarteter Fehler - ${error.message}`);
    }
  }

  // Letzten Eintrag hinzufügen
  if (currentEntry && isValidEntry(currentEntry)) {
    calculatePoints(currentEntry);
    results.push({ ...currentEntry });
  }

  // Validiere alle Ergebnisse
  const validatedResults = results.map((entry, index) => {
    const validationErrors = validateEntry(entry);
    if (validationErrors.length > 0) {
      errors.push(`Eintrag ${index + 1} (${entry.date}): ${validationErrors.join(', ')}`);
    }
    return entry;
  });

  if (errors.length > 0) {
  }

  // Sortiere nach Datum absteigend
  const sortedResults = validatedResults.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    results: sortedResults,
    errors: errors,
    summary: {
      totalEntries: sortedResults.length,
      errorCount: errors.length,
      successRate: ((sortedResults.length / (sortedResults.length + errors.length)) * 100).toFixed(1),
      parsingMode: hasHeader ? 'Mit Header (strukturiert)' : 'Ohne Header (flexibel)',
      hasHeader: hasHeader
    }
  };
}

/**
 * Versuche COTD-Eintrag aus Datenzeile zu inferieren (für headerlose Daten)
 */
function inferCotdFromDataLine(line, lineNumber) {
  // Suche nach Datum-Pattern in der Zeile
  const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return {
      format: 'COTD',
      date: dateMatch[1],
      cotdNumber: 1
    };
  }
  
  // Fallback: Verwende aktuelles Datum wenn keine anderen Hinweise vorhanden
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  // Nur als letzter Ausweg und nur wenn die Zeile wie Trackmania-Daten aussieht
  if (line.includes('/') || line.includes('Division') || /^\d+(?:st|nd|rd|th)/.test(line)) {
    return {
      format: 'COTD',
      date: dateStr,
      cotdNumber: 1
    };
  }
  
  return null;
}

/**
 * Prüfe ob eine Zeile eine COTD-Zeile ist (flexibel für verschiedene Formate)
 */
function isCotdLine(line) {
  // Erkenne Datum-Pattern (YYYY-MM-DD) in der Zeile
  const datePattern = /\d{4}-\d{2}-\d{2}/;
  
  // Erkenne typische COTD-Indikatoren
  const cotdIndicators = [
    /^COTD/i,
    /Cup of the Day/i,
    /^\d{4}-\d{2}-\d{2}/, // Zeile beginnt mit Datum
    /#\d+/ // Enthält #Nummer
  ];
  
  return datePattern.test(line) && cotdIndicators.some(pattern => pattern.test(line));
}

/**
 * Parse COTD-Zeile (z.B. "COTD 2025-07-26 #1" oder "2025-07-26 #1" oder nur "2025-07-26")
 */
function parseCotdLine(line) {
  // Erweiterte Regex für verschiedene COTD-Formate
  const patterns = [
    // Standard: "COTD 2025-07-26 #1" oder "Cup of the Day 2025-07-26 #1"
    /(COTD|Cup of the Day)\s+(\d{4}-\d{2}-\d{2})\s*#?(\d+)?/,
    // Nur Datum mit Nummer: "2025-07-26 #1"
    /^(\d{4}-\d{2}-\d{2})\s*#?(\d+)?/,
    // Datum irgendwo in der Zeile: "... 2025-07-26 ..."
    /(\d{4}-\d{2}-\d{2})/
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      // Bestimme welches Match-Pattern verwendet wurde
      if (pattern === patterns[0]) {
        // Standard COTD Format
        return {
          format: match[1],
          date: match[2],
          cotdNumber: match[3] ? parseInt(match[3], 10) : 1
        };
      } else if (pattern === patterns[1]) {
        // Datum mit Nummer
        return {
          format: 'COTD',
          date: match[1],
          cotdNumber: match[2] ? parseInt(match[2], 10) : 1
        };
      } else {
        // Nur Datum gefunden
        return {
          format: 'COTD',
          date: match[1],
          cotdNumber: 1
        };
      }
    }
  }
  
  return null;
}

/**
 * Parse Datenzeile - erkennt verschiedene Datentypen
 */
function parseDataLine(line, currentEntry) {
  // Wenn die Zeile Tab-getrennt ist, parse als Tabellenzeile
  if (line.includes('\t')) {
    return parseTabSeparatedLine(line, currentEntry);
  }

  // Erkenne Map-Name (keine Zahlen am Anfang, kein "Division")
  if (!line.match(/^\d/) && !line.includes('Division') && !line.includes('/') && !line.includes('(top')) {
    return {
      entry: { ...currentEntry, map: line }
    };
  }

  // Erkenne reine Division-Nummer
  if (/^\d+$/.test(line) && !currentEntry.division) {
    const division = parseInt(line, 10);
    if (division >= 1 && division <= 64) {
      return {
        entry: { ...currentEntry, division }
      };
    }
  }

  // Erkenne Division Rank (z.B. "1st / 46")
  const divRankMatch = line.match(/^(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)$/);
  if (divRankMatch && !currentEntry.divisionRank) {
    return {
      entry: {
        ...currentEntry,
        divisionRank: parseInt(divRankMatch[1], 10),
        divisionPlayers: parseInt(divRankMatch[2], 10)
      }
    };
  }

  // Erkenne Overall und Qualification Ranks
  const rankResult = parseRankLine(line, currentEntry);
  if (rankResult.entry) {
    return rankResult;
  }

  // Erkenne (unplayed)
  if (line.includes('(unplayed)')) {
    return {
      entry: { ...currentEntry, unplayed: true }
    };
  }

  return { entry: currentEntry };
}

/**
 * Parse Tab-getrennte Zeile (Firefox-Format von trackmania.io)
 * Firefox kopiert Daten oft mit Tabs zwischen den Spalten
 */
function parseTabSeparatedLine(line, currentEntry) {
  const parts = line.split('\t').map(part => part.trim()).filter(part => part);
  
  // Firefox-Format: Tab-getrennte Daten in einer Zeile
  if (parts.length >= 3) {
    const entry = { ...currentEntry };
    
    // Erkenne verschiedene Firefox Tab-Formate
    // Format 1: "MapName \t Division \t DivisionRank"
    if (parts.length === 3) {
      const [mapName, division, divisionRank] = parts;
      
      // Parse Map-Name (wenn es kein reiner Zahlen-String ist)
      if (mapName && !(/^\d+$/.test(mapName))) {
        entry.map = mapName;
      }
      
      // Parse Division
      if (division && /^\d+$/.test(division)) {
        entry.division = parseInt(division, 10);
      }
      
      // Parse Division Rank
      if (divisionRank) {
        const divRankMatch = divisionRank.match(/^(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)$/);
        if (divRankMatch) {
          entry.divisionRank = parseInt(divRankMatch[1], 10);
          entry.divisionPlayers = parseInt(divRankMatch[2], 10);
        }
      }
      
      return { entry };
    }
    
    // Format 2: "OverallRank \t QualificationRank" (Rank-Zeile)
    if (parts.length === 2) {
      const [overallRank, qualificationRank] = parts;
      
      // Parse Overall Rank
      if (overallRank && overallRank.includes('(top')) {
        const overallResult = parseRankString(overallRank);
        if (overallResult) {
          entry.overallRank = overallResult.rank;
          entry.totalPlayers = overallResult.total;
          entry.percentile = overallResult.percentile;
        }
      }
      
      // Parse Qualification Rank
      if (qualificationRank && qualificationRank.includes('(top')) {
        const qualiResult = parseRankString(qualificationRank);
        if (qualiResult) {
          entry.qualificationRank = qualiResult.rank;
          entry.qualificationTotal = qualiResult.total;
          entry.qualificationPercentile = qualiResult.percentile;
        }
      }
      
      return { entry };
    }
    
    // Format 3: Vollständige Zeile mit allen Daten (5+ Teile)
    if (parts.length >= 5) {
      const [mapName, division, divisionRank, overallRank, qualificationRank] = parts;
      
      // Parse Map-Name
      if (mapName && mapName !== '') {
        entry.map = mapName;
      }

      // Parse Division
      if (division && /^\d+$/.test(division)) {
        entry.division = parseInt(division, 10);
      }

      // Parse Division Rank
      if (divisionRank) {
        const divRankMatch = divisionRank.match(/^(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)$/);
        if (divRankMatch) {
          entry.divisionRank = parseInt(divRankMatch[1], 10);
          entry.divisionPlayers = parseInt(divRankMatch[2], 10);
        } else if (divisionRank.includes('(unplayed)')) {
          entry.unplayed = true;
        }
      }

      // Parse Overall Rank
      if (overallRank) {
        const overallResult = parseRankString(overallRank);
        if (overallResult) {
          entry.overallRank = overallResult.rank;
          entry.totalPlayers = overallResult.total;
          entry.percentile = overallResult.percentile;
        }
      }

      // Parse Qualification Rank
      if (qualificationRank) {
        const qualiResult = parseRankString(qualificationRank);
        if (qualiResult) {
          entry.qualificationRank = qualiResult.rank;
          entry.qualificationTotal = qualiResult.total;
          entry.qualificationPercentile = qualiResult.percentile;
        }
      }

      return { entry };
    }
  }

  // ENDLOSSCHLEIFE VERMEIDEN: Nicht parseDataLine aufrufen!
  // Stattdessen direkt die Logik hier implementieren
  
  // Erkenne Map-Name (keine Zahlen am Anfang, kein "Division")
  if (!line.match(/^\d/) && !line.includes('Division') && !line.includes('/') && !line.includes('(top')) {
    return {
      entry: { ...currentEntry, map: line }
    };
  }

  // Erkenne reine Division-Nummer
  if (/^\d+$/.test(line) && !currentEntry.division) {
    const division = parseInt(line, 10);
    if (division >= 1 && division <= 64) {
      return {
        entry: { ...currentEntry, division }
      };
    }
  }

  // Erkenne Division Rank (z.B. "1st / 46")
  const divRankMatch = line.match(/^(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)$/);
  if (divRankMatch && !currentEntry.divisionRank) {
    return {
      entry: {
        ...currentEntry,
        divisionRank: parseInt(divRankMatch[1], 10),
        divisionPlayers: parseInt(divRankMatch[2], 10)
      }
    };
  }

  // Erkenne Overall und Qualification Ranks
  const rankResult = parseRankLine(line, currentEntry);
  if (rankResult.entry !== currentEntry) {
    return rankResult;
  }

  // Erkenne (unplayed)
  if (line.includes('(unplayed)')) {
    return {
      entry: { ...currentEntry, unplayed: true }
    };
  }

  return { entry: currentEntry };
}

/**
 * Parse Rank-Zeile mit Overall und Qualification (z.B. "705th / 2134 (top 33.04%) 761st / 2134 (top 35.66%)")
 */
function parseRankLine(line, currentEntry) {
  // Regex für Rank-Format: "123rd / 456 (top 12.34%)" - mit Kommas in Zahlen
  const rankRegex = /([\d,]+)(?:st|nd|rd|th)?\s*\/\s*([\d,]+)\s*\(top\s+(\d+\.\d+)%\)/g;
  const matches = [...line.matchAll(rankRegex)];

  if (matches.length === 0) {
    return { entry: currentEntry };
  }

  const entry = { ...currentEntry };

  // Erstes Match = Overall Rank
  if (matches[0]) {
    const [, rank, total, percentile] = matches[0];
    entry.overallRank = parseInt(rank.replace(/,/g, ''), 10);
    entry.totalPlayers = parseInt(total.replace(/,/g, ''), 10);
    entry.percentile = parseFloat(percentile);
  }

  // Zweites Match = Qualification Rank
  if (matches[1]) {
    const [, rank, total, percentile] = matches[1];
    entry.qualificationRank = parseInt(rank.replace(/,/g, ''), 10);
    entry.qualificationTotal = parseInt(total.replace(/,/g, ''), 10);
    entry.qualificationPercentile = parseFloat(percentile);
  }

  return { entry };
}

/**
 * Parse einzelnen Rank-String
 */
function parseRankString(rankStr) {
  const match = rankStr.match(/(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)(?:\s*\(top\s+(\d+\.\d+)%\))?/);
  if (!match) return null;

  return {
    rank: parseInt(match[1], 10),
    total: parseInt(match[2], 10),
    percentile: match[3] ? parseFloat(match[3]) : null
  };
}

/**
 * Validiere Eintrag auf Plausibilität
 */
function validateEntry(entry) {
  const errors = [];

  // Basis-Validierungen
  if (!entry.date) errors.push('Datum fehlt');
  if (!entry.map) errors.push('Map-Name fehlt');

  // Division-Validierungen
  if (entry.division && (entry.division < 1 || entry.division > 64)) {
    errors.push(`Ungültige Division: ${entry.division}`);
  }

  // Division Rank Validierungen
  if (entry.divisionRank && entry.divisionPlayers) {
    if (entry.divisionRank > entry.divisionPlayers) {
      errors.push(`Division Rank (${entry.divisionRank}) größer als Division Players (${entry.divisionPlayers})`);
    }
  }

  // Overall Rank Validierungen
  if (entry.overallRank && entry.totalPlayers) {
    if (entry.overallRank > entry.totalPlayers) {
      errors.push(`Overall Rank (${entry.overallRank}) größer als Total Players (${entry.totalPlayers})`);
    }
  }

  // Qualification Rank Validierungen
  if (entry.qualificationRank && entry.qualificationTotal) {
    if (entry.qualificationRank > entry.qualificationTotal) {
      errors.push(`Qualification Rank (${entry.qualificationRank}) größer als Qualification Total (${entry.qualificationTotal})`);
    }
  }

  // Percentile Validierungen
  if (entry.percentile && (entry.percentile < 0 || entry.percentile > 100)) {
    errors.push(`Ungültiges Percentile: ${entry.percentile}%`);
  }

  if (entry.qualificationPercentile && (entry.qualificationPercentile < 0 || entry.qualificationPercentile > 100)) {
    errors.push(`Ungültiges Qualification Percentile: ${entry.qualificationPercentile}%`);
  }

  return errors;
}

/**
 * Prüfe ob Eintrag gültig ist
 */
function isValidEntry(entry) {
  return entry && entry.date && entry.map;
}

/**
 * Berechne Punkte basierend auf Division und Rang
 */
function calculatePoints(entry) {
  if (entry.unplayed || !entry.division || !entry.divisionRank) {
    entry.points = 0;
    return;
  }
  
  // Division 1 = 500 Basis, jede weitere Division -100
  const divisionBase = Math.max(0, 600 - (entry.division * 100));

  // Rang-Punkte: linear abnehmend von 100% (1.) bis 0% (64.)
  const rankPercentage = Math.max(0, 1 - ((entry.divisionRank - 1) / 64));
  entry.points = Math.round(divisionBase * rankPercentage);

  // Bonus für Division 1 in den Top 8
  if (entry.division === 1 && entry.divisionRank <= 8) {
    entry.points += (9 - entry.divisionRank) * 25;
  }
}
