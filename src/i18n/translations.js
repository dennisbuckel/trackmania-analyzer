// src/i18n/translations.js
export const translations = {
  en: {
    // Header
    title: "Trackmania COTD Analyzer",
    subtitle: "Analyze your Cup of the Day performance like a pro",
    
    // Navigation
    races: "Races",
    avgDivision: "Avg Division",
    filtered: "Filtered",
    
    // Welcome Section
    welcomeTitle: "Welcome to COTD Analyzer! 🏁",
    welcomeDescription: "Import your Trackmania COTD data and get detailed performance analysis. Copy your results from the game or trackmania.io and paste them below.",
    showInstructions: "Show Instructions 📖",
    hideInstructions: "Hide Instructions 📖",
    
    // Instructions
    instructionsTitle: "How to use the COTD Analyzer:",
    instructionSteps: [
      "Go to your Trackmania profile",
      "Navigate to your Cup of the Day results",
      "Select and copy the results (Ctrl+C/Cmd+C)",
      "Paste them into the text field below",
      "Click on 'Process Data'"
    ],
    privacyNote: "Privacy: Your data is stored locally in your browser only and never transmitted to a server.",
    
    // Data Import
    processData: "Process Data",
    processing: "Processing...",
    importFile: "Import File",
    loadSampleData: "Load Sample Data",
    characters: "characters",
    lines: "lines",
    pasteDataHere: "Paste your data or import a file",
    
    // Analysis Views
    yourAnalysis: "Your COTD Analysis",
    advancedSearch: "🔍 Advanced Search",
    addData: "➕ Add Data",
    export: "📤 Export",
    delete: "🗑️ Delete",
    
    // Chart Views
    analysisViews: "📊 Analysis Views",
    performance: "📈 Performance",
    divisionDistribution: "🏆 Division Distribution",
    divisionProgress: "📊 Division Progress",
    divisionRank: "🎯 Division Rank",
    totalPlayers: "👥 Total Players",
    
    // Statistics
    totalRaces: "Total Races",
    bestDivision: "Best Division",
    avgPercentile: "Avg Top %",
    bestRank: "Best Rank",
    bestQualification: "Best Quali",
    avgQualification: "Avg Quali Top %",
    
    // Quick Actions
    quickActions: {
      addData: "Add Data",
      addDataDesc: "Import new COTD results",
      exportData: "Export",
      exportDataDesc: "Download data as JSON",
      viewTrends: "View Trends",
      viewTrendsDesc: "Visualize performance development",
      bestPerformance: "Best Results",
      bestPerformanceDesc: "Show top placements",
      mapAnalysis: "Map Analysis",
      mapAnalysisDesc: "Performance by map type",
      shareStats: "Share",
      shareStatsDesc: "Share statistics"
    },
    
    // Smart Notifications
    smartInsights: "Smart Insights",
    dismissAll: "Dismiss All",
    notifications: {
      improvement: "Strong Improvement!",
      improvementMsg: "You've improved by {percent}% in the last 5 races!",
      div1Streak: "Division 1 Streak!",
      div1StreakMsg: "{count} consecutive Division 1 placements!",
      personalBest: "New Record!",
      personalBestMsg: "Best placement: Top {percent}% on {map}",
      mapRecommendation: "Performance Tip",
      mapRecommendationMsg: "You perform best on {bestType} maps ({avg}% avg). Practice more {worstType} maps!",
      consistencyWarning: "Inconsistent Performance",
      consistencyWarningMsg: "Your recent results vary greatly. Focus on consistency!",
      qualificationTip: "Qualification Strength!",
      qualificationTipMsg: "You qualify better than you perform in finals. Work on your nerves!"
    },
    
    // Advanced Search
    advancedSearchTitle: "Advanced Search",
    advancedSearchDesc: "Filter your COTD data by various criteria",
    dateRange: "📅 Date Range",
    from: "From",
    to: "To",
    division: "🏆 Division",
    min: "Min",
    max: "Max",
    topPercent: "📊 Top Percent",
    mapName: "🏁 Map Name",
    searchMapName: "Search map name...",
    streakFilter: "🔥 Streak Filter",
    streakType: "Streak Type",
    noStreak: "No Streak",
    div1Streak: "Division 1 Streak",
    top10Streak: "Top 10% Streak",
    top20Streak: "Top 20% Streak",
    minLength: "Min Length",
    savedFilters: "💾 Saved Filters",
    saveCurrentFilter: "Save Current Filter",
    filterName: "Filter name...",
    load: "Load",
    noSavedFilters: "No saved filters",
    activeFilters: "active filters",
    reset: "Reset",
    applyFilters: "Apply Filters",
    
    // Keyboard Shortcuts
    keyboardShortcuts: "⌨️ Keyboard Shortcuts",
    keyboardShortcutsDesc: "Work more efficiently with keyboard shortcuts",
    navigation: "Navigation",
    actions: "Actions",
    general: "General",
    shortcuts: {
      openSearch: "Open advanced search",
      addNewData: "Add new data",
      exportData: "Export data",
      deleteAllData: "Delete all data",
      performanceView: "Performance view",
      divisionView: "Division view",
      progressView: "Progress view",
      rankView: "Rank view",
      showShortcuts: "Show keyboard shortcuts",
      closeDialogs: "Close dialogs",
      focusSearch: "Focus search field",
      refreshData: "Refresh data",
      saveFilter: "Save current filter"
    },
    tips: "💡 Tips",
    shortcutTips: [
      "Keyboard shortcuts only work when no input field is active",
      "Press ? anytime to open this help",
      "Esc closes all open dialogs",
      "Use Ctrl + F to quickly search"
    ],
    understood: "Understood",
    shortcutsAvailable: "keyboard shortcuts available",
    
    // Onboarding Tour
    tour: {
      welcome: "Welcome to COTD Analyzer! 🏁",
      welcomeDesc: "Analyze your Trackmania Cup of the Day performance like a pro. Let's take a quick tour!",
      dataImport: "Import Data 📊",
      dataImportDesc: "Copy your COTD results from Trackmania or trackmania.io and paste them here. The parser automatically detects the format!",
      liveStats: "Live Statistics 📈",
      liveStatsDesc: "Here you see your key metrics immediately: average division, best placements, and improvement trends.",
      interactiveCharts: "Interactive Charts 📊",
      interactiveChartsDesc: "Visualize your performance with different chart types. Zoom, filter, and discover trends in your data!",
      detailedTable: "Detailed Table 📋",
      detailedTableDesc: "Search and sort all your races. Every column is sortable and the table is fully searchable.",
      ready: "You're ready! 🚀",
      readyDesc: "All features are now unlocked. Have fun analyzing your COTD performance!",
      next: "Next",
      back: "Back",
      skip: "Skip",
      finish: "Finish!"
    },
    
    // Messages
    confirmAppend: "Do you want to add this data to your existing data? Click 'Cancel' to replace all current data.",
    confirmDelete: "Are you sure you want to delete all data?",
    noValidData: "No valid data found. Please check the format.",
    dataProcessingError: "Error processing data: {error}",
    noDataToExport: "No data available to export.",
    statsCopied: "Statistics copied to clipboard!",
    enterFilterName: "Please enter a name for the filter.",
    
    // Footer
    dataStoredLocally: "🔒 Your data is stored locally in your browser. Use the Export function for a backup.",
    disclaimer: "Trackmania COTD Analyzer is an unofficial tool and is not affiliated with Ubisoft or Nadeo.",
    
    // Map Types
    mapTypes: {
      Tech: "Tech",
      Dirt: "Dirt", 
      Fullspeed: "Fullspeed",
      Ice: "Ice",
      Water: "Water",
      Plastic: "Plastic",
      Mixed: "Mixed",
      LOL: "LOL",
      RPG: "RPG",
      Other: "Other"
    }
  },
  
  de: {
    // Header
    title: "Trackmania COTD Analyzer",
    subtitle: "Analysiere deine Cup of the Day Performance wie ein Profi",
    
    // Navigation
    races: "Rennen",
    avgDivision: "Ø Division",
    filtered: "Gefiltert",
    
    // Welcome Section
    welcomeTitle: "Willkommen zum COTD Analyzer! 🏁",
    welcomeDescription: "Füge deine Trackmania COTD-Daten ein und erhalte detaillierte Analysen deiner Performance. Kopiere deine Ergebnisse aus dem Spiel oder von trackmania.io und füge sie unten ein.",
    showInstructions: "Anleitung anzeigen 📖",
    hideInstructions: "Anleitung ausblenden 📖",
    
    // Instructions
    instructionsTitle: "So verwendest du den COTD Analyzer:",
    instructionSteps: [
      "Gehe zu deinem Trackmania-Profil",
      "Navigiere zu deinen Cup of the Day Ergebnissen",
      "Markiere und kopiere die Ergebnisse (Strg+C/Cmd+C)",
      "Füge sie in das Textfeld unten ein",
      "Klicke auf 'Daten verarbeiten'"
    ],
    privacyNote: "Datenschutz: Deine Daten werden nur lokal in deinem Browser gespeichert und niemals an einen Server übertragen.",
    
    // Data Import
    processData: "Daten verarbeiten",
    processing: "Verarbeitung...",
    importFile: "Datei importieren",
    loadSampleData: "Beispieldaten laden",
    characters: "Zeichen",
    lines: "Zeilen",
    pasteDataHere: "Füge deine Daten ein oder importiere eine Datei",
    
    // Analysis Views
    yourAnalysis: "Deine COTD Analyse",
    advancedSearch: "🔍 Erweiterte Suche",
    addData: "➕ Daten hinzufügen",
    export: "📤 Export",
    delete: "🗑️ Löschen",
    
    // Chart Views
    analysisViews: "📊 Analyse-Ansichten",
    performance: "📈 Performance",
    divisionDistribution: "🏆 Division Verteilung",
    divisionProgress: "📊 Division Verlauf",
    divisionRank: "🎯 Division Rang",
    totalPlayers: "👥 Gesamtspieler",
    
    // Statistics
    totalRaces: "Anzahl Rennen",
    bestDivision: "Beste Division",
    avgPercentile: "Ø Top %",
    bestRank: "Beste Platzierung",
    bestQualification: "Beste Quali",
    avgQualification: "Ø Quali Top %",
    
    // Quick Actions
    quickActions: {
      addData: "Daten hinzufügen",
      addDataDesc: "Neue COTD-Ergebnisse importieren",
      exportData: "Exportieren",
      exportDataDesc: "Daten als JSON herunterladen",
      viewTrends: "Trends anzeigen",
      viewTrendsDesc: "Performance-Entwicklung visualisieren",
      bestPerformance: "Beste Ergebnisse",
      bestPerformanceDesc: "Top-Platzierungen anzeigen",
      mapAnalysis: "Map-Analyse",
      mapAnalysisDesc: "Performance nach Map-Typ",
      shareStats: "Teilen",
      shareStatsDesc: "Statistiken teilen"
    },
    
    // Smart Notifications
    smartInsights: "Smart Insights",
    dismissAll: "Alle schließen",
    notifications: {
      improvement: "Starke Verbesserung!",
      improvementMsg: "Du hast dich in den letzten 5 Rennen um {percent}% verbessert!",
      div1Streak: "Division 1 Serie!",
      div1StreakMsg: "{count} aufeinanderfolgende Division 1 Platzierungen!",
      personalBest: "Neuer Rekord!",
      personalBestMsg: "Beste Platzierung: Top {percent}% auf {map}",
      mapRecommendation: "Performance-Tipp",
      mapRecommendationMsg: "Du performst am besten auf {bestType}-Maps ({avg}% avg). Übe mehr {worstType}-Maps!",
      consistencyWarning: "Inkonsistente Performance",
      consistencyWarningMsg: "Deine letzten Ergebnisse schwanken stark. Fokussiere dich auf Konsistenz!",
      qualificationTip: "Qualifikations-Stärke!",
      qualificationTipMsg: "Du qualifizierst dich besser als du im Finale abschneidest. Arbeite an deiner Nervenstärke!"
    },
    
    // Advanced Search
    advancedSearchTitle: "Erweiterte Suche",
    advancedSearchDesc: "Filtere deine COTD-Daten nach verschiedenen Kriterien",
    dateRange: "📅 Zeitraum",
    from: "Von",
    to: "Bis",
    division: "🏆 Division",
    min: "Min",
    max: "Max",
    topPercent: "📊 Top Prozent",
    mapName: "🏁 Map-Name",
    searchMapName: "Map-Name suchen...",
    streakFilter: "🔥 Serien-Filter",
    streakType: "Serie-Typ",
    noStreak: "Keine Serie",
    div1Streak: "Division 1 Serie",
    top10Streak: "Top 10% Serie",
    top20Streak: "Top 20% Serie",
    minLength: "Mindestlänge",
    savedFilters: "💾 Gespeicherte Filter",
    saveCurrentFilter: "Aktuellen Filter speichern",
    filterName: "Filter-Name...",
    load: "Laden",
    noSavedFilters: "Keine gespeicherten Filter",
    activeFilters: "aktive Filter",
    reset: "Zurücksetzen",
    applyFilters: "Filter anwenden",
    
    // Keyboard Shortcuts
    keyboardShortcuts: "⌨️ Tastenkürzel",
    keyboardShortcutsDesc: "Arbeite effizienter mit Keyboard-Shortcuts",
    navigation: "Navigation",
    actions: "Aktionen",
    general: "Allgemein",
    shortcuts: {
      openSearch: "Erweiterte Suche öffnen",
      addNewData: "Neue Daten hinzufügen",
      exportData: "Daten exportieren",
      deleteAllData: "Alle Daten löschen",
      performanceView: "Performance-Ansicht",
      divisionView: "Division-Ansicht",
      progressView: "Verlaufs-Ansicht",
      rankView: "Rang-Ansicht",
      showShortcuts: "Tastenkürzel anzeigen",
      closeDialogs: "Dialoge schließen",
      focusSearch: "Suchfeld fokussieren",
      refreshData: "Daten neu laden",
      saveFilter: "Aktuellen Filter speichern"
    },
    tips: "💡 Tipps",
    shortcutTips: [
      "Tastenkürzel funktionieren nur, wenn kein Eingabefeld aktiv ist",
      "Drücke ? jederzeit um diese Hilfe zu öffnen",
      "Esc schließt alle offenen Dialoge",
      "Verwende Strg + F um schnell zu suchen"
    ],
    understood: "Verstanden",
    shortcutsAvailable: "Tastenkürzel verfügbar",
    
    // Onboarding Tour
    tour: {
      welcome: "Willkommen zum COTD Analyzer! 🏁",
      welcomeDesc: "Analysiere deine Trackmania Cup of the Day Performance wie ein Profi. Lass uns eine kurze Tour machen!",
      dataImport: "Daten importieren 📊",
      dataImportDesc: "Kopiere deine COTD-Ergebnisse aus Trackmania oder trackmania.io und füge sie hier ein. Der Parser erkennt das Format automatisch!",
      liveStats: "Live-Statistiken 📈",
      liveStatsDesc: "Hier siehst du sofort deine wichtigsten Kennzahlen: Durchschnittsdivision, beste Platzierungen und Verbesserungstrends.",
      interactiveCharts: "Interaktive Charts 📊",
      interactiveChartsDesc: "Visualisiere deine Performance mit verschiedenen Chart-Typen. Zoome, filtere und entdecke Trends in deinen Daten!",
      detailedTable: "Detaillierte Tabelle 📋",
      detailedTableDesc: "Durchsuche und sortiere alle deine Rennen. Jede Spalte ist sortierbar und die Tabelle ist vollständig durchsuchbar.",
      ready: "Du bist startklar! 🚀",
      readyDesc: "Alle Features sind jetzt freigeschaltet. Viel Spaß beim Analysieren deiner COTD-Performance!",
      next: "Weiter",
      back: "Zurück",
      skip: "Überspringen",
      finish: "Fertig!"
    },
    
    // Messages
    confirmAppend: "Möchtest du diese Daten zu deinen bestehenden Daten hinzufügen? Klicke 'Abbrechen' um alle aktuellen Daten zu ersetzen.",
    confirmDelete: "Bist du sicher, dass du alle Daten löschen möchtest?",
    noValidData: "Keine gültigen Daten gefunden. Bitte überprüfe das Format.",
    dataProcessingError: "Fehler beim Verarbeiten der Daten: {error}",
    noDataToExport: "Keine Daten zum Exportieren verfügbar.",
    statsCopied: "Statistiken in die Zwischenablage kopiert!",
    enterFilterName: "Bitte gib einen Namen für den Filter ein.",
    
    // Footer
    dataStoredLocally: "🔒 Deine Daten werden lokal in deinem Browser gespeichert. Nutze die Export-Funktion für ein Backup.",
    disclaimer: "Trackmania COTD Analyzer ist ein inoffizielles Tool und steht in keiner Verbindung zu Ubisoft oder Nadeo.",
    
    // Map Types
    mapTypes: {
      Tech: "Tech",
      Dirt: "Dirt", 
      Fullspeed: "Fullspeed",
      Ice: "Ice",
      Water: "Water",
      Plastic: "Plastic",
      Mixed: "Mixed",
      LOL: "LOL",
      RPG: "RPG",
      Other: "Andere"
    }
  }
};

export const getTranslation = (key, lang = 'en', params = {}) => {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object') {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }
  
  if (typeof value === 'string') {
    // Replace parameters in the string
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }
  
  return value || key;
};
