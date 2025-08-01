export default function parseTrackmaniaData(textData) {
  // Split text into lines and remove any empty lines
  const lines = textData.split('\n');
  const results = [];
  

  let currentEntry = {};

  // Beide möglichen Formate erkennen - COTD und Cup of the Day
  const datePattern = /(COTD|Cup of the Day) (\d{4}-\d{2}-\d{2})/;

  // Division-Rang (z.B. "12 / 64"), aber OHNE "top"
  const rankPattern = /^(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)$/;

  // Komplettes Rang+Prozent-Muster (z.B. "12 / 64 (top 0.25%)") – GLOBAL
  const rankPercentRegex = /(\d+)(?:st|nd|rd|th)?\s*\/\s*(\d+)\s*\(top\s+(\d+\.\d+)%\)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Neues Datum (COTD oder Cup of the Day)
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      // Vorherigen Eintrag speichern
      if (Object.keys(currentEntry).length > 0) {
        if (currentEntry.division && currentEntry.divisionRank) {
          calculatePoints(currentEntry);
        }
        results.push({ ...currentEntry });
      }
      
      // Neuen Eintrag anlegen
      currentEntry = { 
        date: dateMatch[2],
        format: dateMatch[1] 
      };
      
      // Prüft auf optionales "#1" am Ende
      const numberMatch = line.match(/#(\d+)/);
      if (numberMatch) {
        currentEntry.cotdNumber = parseInt(numberMatch[1], 10);
      }
      continue;
    }

    // Map-Name (keine Zahl am Anfang, kein "COTD"/"Cup of the Day"/"Division" im Text)
    if (
      line &&
      !/^\d/.test(line) &&
      !line.includes('Cup of the Day') &&
      !line.includes('COTD') &&
      !line.includes('Division') &&
      !line.includes('Rank') &&
      !line.includes('ago')
    ) {
      currentEntry.map = line.replace(/\*\*/g, '');
      continue;
    }

    // Division (reine Zahl in einer Zeile)
    if (/^\d+$/.test(line) && !currentEntry.division) {
      currentEntry.division = parseInt(line, 10);
      continue;
    }

    // (unplayed)
    if (line.includes('(unplayed)')) {
      currentEntry.unplayed = true;
      continue;
    }

    // Schauen, ob irgendwo "X / Y" ohne "top"-Angabe für Division-Rang steht
    // (Z.B. "47 / 58" ohne weitere Klammern)
    const pureRankMatch = line.match(rankPattern);
    if (pureRankMatch && !currentEntry.divisionRank) {
      currentEntry.divisionRank = parseInt(pureRankMatch[1], 10);
      currentEntry.divisionPlayers = parseInt(pureRankMatch[2], 10);
      continue;
    }

    // Hier prüfen wir, ob "top x.xx%" im Text ist (Overall oder Qualification)
    if (line.includes('top')) {
      // Alle Matches im aktuellen String (können 1 oder 2 sein)
      const matches = [...line.matchAll(rankPercentRegex)];
      if (matches.length > 0) {
        // 1. Match = Overall
        const [overallRankStr, overallTotalStr, overallPctStr] = matches[0].slice(1);
        currentEntry.overallRank = parseInt(overallRankStr, 10);
        currentEntry.totalPlayers = parseInt(overallTotalStr, 10);
        currentEntry.percentile = parseFloat(overallPctStr);

        // Wenn 2 Matches, dann 2. Match = Qualification
        if (matches.length > 1) {
          const [qualiRankStr, qualiTotalStr, qualiPctStr] = matches[1].slice(1);
          currentEntry.qualificationRank = parseInt(qualiRankStr, 10);
          currentEntry.qualificationTotal = parseInt(qualiTotalStr, 10);
          currentEntry.qualificationPercentile = parseFloat(qualiPctStr);
        }
      }
    }
  }

  // Letzten Eintrag hinzufügen
  if (Object.keys(currentEntry).length > 0) {
    if (currentEntry.division && currentEntry.divisionRank) {
      calculatePoints(currentEntry);
    }
    results.push({ ...currentEntry });
  }


  // Sortiert nach Datum absteigend
  return results.sort((a, b) => new Date(b.date) - new Date(a.date));
}


// Punkte basierend auf Division und Rang
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
