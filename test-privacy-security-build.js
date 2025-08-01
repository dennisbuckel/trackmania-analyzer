/**
 * Privacy and Security Test Suite für Production Build
 * Tests für verbotene Schriftarten-Downloads und Cookie-Verwendung in der Build-Version
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class PrivacySecurityBuildTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.server = null;
    this.testResults = {
      fonts: {
        externalFonts: [],
        googleFonts: [],
        forbiddenFonts: [],
        localFonts: []
      },
      cookies: {
        httpCookies: [],
        sessionStorage: [],
        localStorage: [],
        indexedDB: []
      },
      networkRequests: [],
      privacy: {
        trackingScripts: [],
        analytics: [],
        thirdPartyDomains: []
      }
    };
  }

  async buildApp() {
    console.log('🔨 Erstelle Production Build...');
    
    return new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let errorOutput = '';

      buildProcess.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });

      buildProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        process.stderr.write(data);
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Build erfolgreich erstellt');
          resolve();
        } else {
          console.error('❌ Build fehlgeschlagen');
          reject(new Error(`Build failed with code ${code}: ${errorOutput}`));
        }
      });
    });
  }

  async startStaticServer() {
    console.log('🌐 Starte statischen Server für Build...');
    
    // Prüfen ob serve installiert ist
    try {
      const { execSync } = require('child_process');
      execSync('npx serve --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('📦 Installiere serve...');
      const { execSync } = require('child_process');
      execSync('npm install -g serve', { stdio: 'inherit' });
    }

    return new Promise((resolve, reject) => {
      this.server = spawn('npx', ['serve', '-s', 'build', '-l', '3001'], {
        stdio: 'pipe',
        shell: true
      });

      let serverReady = false;

      this.server.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);
        
        if (output.includes('Local:') && !serverReady) {
          serverReady = true;
          setTimeout(() => resolve(), 2000); // Warten bis Server bereit ist
        }
      });

      this.server.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      this.server.on('close', (code) => {
        console.log(`Server beendet mit Code: ${code}`);
      });

      // Timeout falls Server nicht startet
      setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server konnte nicht gestartet werden'));
        }
      }, 10000);
    });
  }

  async setup() {
    console.log('🚀 Starte Privacy & Security Tests für Build...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--enable-logging',
        '--v=1'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Network monitoring aktivieren
    await this.page.setRequestInterception(true);
    
    // Alle Netzwerk-Requests überwachen
    this.page.on('request', (request) => {
      this.testResults.networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      });
      request.continue();
    });

    // Console logs überwachen
    this.page.on('console', (msg) => {
      console.log(`🖥️  Console ${msg.type()}: ${msg.text()}`);
    });

    // Fehler überwachen
    this.page.on('pageerror', (error) => {
      console.error(`❌ Page Error: ${error.message}`);
    });
  }

  async testFontUsage() {
    console.log('\n📝 Teste Schriftarten-Verwendung...');
    
    try {
      // Alle geladenen Schriftarten analysieren
      const fontInfo = await this.page.evaluate(() => {
        const fonts = [];
        const computedStyles = [];
        
        // Alle Elemente durchgehen und verwendete Schriftarten sammeln
        const allElements = document.querySelectorAll('*');
        const fontFamilies = new Set();
        
        allElements.forEach(element => {
          const style = window.getComputedStyle(element);
          const fontFamily = style.fontFamily;
          if (fontFamily && fontFamily !== 'inherit') {
            fontFamilies.add(fontFamily);
          }
        });
        
        // CSS-Regeln nach @font-face durchsuchen
        const fontFaceRules = [];
        for (let i = 0; i < document.styleSheets.length; i++) {
          try {
            const styleSheet = document.styleSheets[i];
            if (styleSheet.cssRules) {
              for (let j = 0; j < styleSheet.cssRules.length; j++) {
                const rule = styleSheet.cssRules[j];
                if (rule.type === CSSRule.FONT_FACE_RULE) {
                  fontFaceRules.push({
                    fontFamily: rule.style.fontFamily,
                    src: rule.style.src,
                    href: styleSheet.href
                  });
                }
              }
            }
          } catch (e) {
            // Cross-origin stylesheet - kann nicht gelesen werden
          }
        }
        
        return {
          usedFontFamilies: Array.from(fontFamilies),
          fontFaceRules: fontFaceRules
        };
      });

      // Netzwerk-Requests nach Schriftarten filtern
      const fontRequests = this.testResults.networkRequests.filter(req => 
        req.resourceType === 'font' || 
        req.url.includes('.woff') || 
        req.url.includes('.woff2') || 
        req.url.includes('.ttf') || 
        req.url.includes('.otf') ||
        req.url.includes('fonts.googleapis.com') ||
        req.url.includes('fonts.gstatic.com')
      );

      // Google Fonts erkennen
      const googleFontRequests = fontRequests.filter(req => 
        req.url.includes('fonts.googleapis.com') || 
        req.url.includes('fonts.gstatic.com')
      );

      // Externe Schriftarten (nicht von der eigenen Domain)
      const currentDomain = new URL(this.page.url()).hostname;
      const externalFontRequests = fontRequests.filter(req => {
        try {
          const reqDomain = new URL(req.url).hostname;
          return reqDomain !== currentDomain && reqDomain !== 'localhost';
        } catch {
          return false;
        }
      });

      this.testResults.fonts = {
        usedFontFamilies: fontInfo.usedFontFamilies,
        fontFaceRules: fontInfo.fontFaceRules,
        externalFonts: externalFontRequests,
        googleFonts: googleFontRequests,
        allFontRequests: fontRequests,
        forbiddenFonts: this.checkForbiddenFonts(fontRequests, fontInfo)
      };

      console.log(`✅ Gefundene Schriftarten: ${fontInfo.usedFontFamilies.length}`);
      console.log(`📡 Externe Font-Requests: ${externalFontRequests.length}`);
      console.log(`🔤 Google Fonts: ${googleFontRequests.length}`);

    } catch (error) {
      console.error('❌ Fehler beim Testen der Schriftarten:', error);
    }
  }

  checkForbiddenFonts(fontRequests, fontInfo) {
    const forbiddenPatterns = [
      // Bekannte problematische Font-Services
      'typekit.net',
      'use.typekit.net',
      'fonts.com',
      'webfonts.fonts.com',
      'fast.fonts.net',
      'cloud.typography.com',
      // Tracking-verdächtige Font-Services
      'fontawesome.com',
      'bootstrapcdn.com'
    ];

    const forbidden = [];
    
    fontRequests.forEach(req => {
      forbiddenPatterns.forEach(pattern => {
        if (req.url.includes(pattern)) {
          forbidden.push({
            url: req.url,
            reason: `Potentially problematic font service: ${pattern}`,
            type: 'external_service'
          });
        }
      });
    });

    return forbidden;
  }

  async testCookieUsage() {
    console.log('\n🍪 Teste Cookie-Verwendung...');
    
    try {
      // HTTP Cookies
      const cookies = await this.page.cookies();
      
      // Local Storage
      const localStorage = await this.page.evaluate(() => {
        const items = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          const value = window.localStorage.getItem(key);
          items.push({ key, value, type: 'localStorage' });
        }
        return items;
      });

      // Session Storage
      const sessionStorage = await this.page.evaluate(() => {
        const items = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          const value = window.sessionStorage.getItem(key);
          items.push({ key, value, type: 'sessionStorage' });
        }
        return items;
      });

      // IndexedDB
      const indexedDBInfo = await this.page.evaluate(async () => {
        try {
          const databases = await indexedDB.databases();
          return databases.map(db => ({
            name: db.name,
            version: db.version,
            type: 'indexedDB'
          }));
        } catch (error) {
          return [];
        }
      });

      this.testResults.cookies = {
        httpCookies: cookies,
        localStorage: localStorage,
        sessionStorage: sessionStorage,
        indexedDB: indexedDBInfo
      };

      console.log(`🍪 HTTP Cookies: ${cookies.length}`);
      console.log(`💾 LocalStorage Items: ${localStorage.length}`);
      console.log(`🔄 SessionStorage Items: ${sessionStorage.length}`);
      console.log(`🗃️  IndexedDB Databases: ${indexedDBInfo.length}`);

    } catch (error) {
      console.error('❌ Fehler beim Testen der Cookies:', error);
    }
  }

  async testPrivacyCompliance() {
    console.log('\n🔒 Teste Datenschutz-Compliance...');
    
    try {
      // Tracking-Scripts erkennen
      const trackingRequests = this.testResults.networkRequests.filter(req => {
        const trackingPatterns = [
          'google-analytics.com',
          'googletagmanager.com',
          'facebook.com',
          'doubleclick.net',
          'googlesyndication.com',
          'amazon-adsystem.com',
          'adsystem.amazon.com',
          'hotjar.com',
          'mixpanel.com',
          'segment.com',
          'amplitude.com'
        ];
        
        return trackingPatterns.some(pattern => req.url.includes(pattern));
      });

      // Third-party Domains
      const currentDomain = new URL(this.page.url()).hostname;
      const thirdPartyDomains = new Set();
      
      this.testResults.networkRequests.forEach(req => {
        try {
          const reqDomain = new URL(req.url).hostname;
          if (reqDomain !== currentDomain && reqDomain !== 'localhost') {
            thirdPartyDomains.add(reqDomain);
          }
        } catch {
          // Invalid URL
        }
      });

      this.testResults.privacy = {
        trackingScripts: trackingRequests,
        thirdPartyDomains: Array.from(thirdPartyDomains),
        totalExternalRequests: this.testResults.networkRequests.filter(req => {
          try {
            const reqDomain = new URL(req.url).hostname;
            return reqDomain !== currentDomain && reqDomain !== 'localhost';
          } catch {
            return false;
          }
        }).length
      };

      console.log(`📊 Tracking Scripts: ${trackingRequests.length}`);
      console.log(`🌐 Third-party Domains: ${thirdPartyDomains.size}`);

    } catch (error) {
      console.error('❌ Fehler beim Datenschutz-Test:', error);
    }
  }

  async runTests() {
    try {
      // Build erstellen
      await this.buildApp();
      
      // Statischen Server starten
      await this.startStaticServer();
      
      await this.setup();
      
      console.log('🌐 Lade Build-Anwendung...');
      await this.page.goto('http://localhost:3001', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Warten bis die Seite vollständig geladen ist
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Tests ausführen
      await this.testFontUsage();
      await this.testCookieUsage();
      await this.testPrivacyCompliance();

      // Interaktion simulieren um weitere Requests zu triggern
      console.log('\n🖱️  Simuliere Benutzerinteraktionen...');
      
      try {
        // Auf verschiedene Elemente klicken
        const clickableElements = await this.page.$$('button, a, [role="button"]');
        for (let i = 0; i < Math.min(3, clickableElements.length); i++) {
          await clickableElements[i].click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log('⚠️  Einige Interaktionen konnten nicht ausgeführt werden');
      }

      // Finale Tests nach Interaktionen
      await this.testCookieUsage();
      
      // Ergebnisse generieren
      this.generateReport();

    } catch (error) {
      console.error('❌ Fehler beim Ausführen der Tests:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
      if (this.server) {
        this.server.kill();
      }
    }
  }

  generateReport() {
    console.log('\n📋 TESTERGEBNISSE - PRIVACY & SECURITY REPORT (BUILD)');
    console.log('='.repeat(60));
    
    // Schriftarten-Report
    console.log('\n📝 SCHRIFTARTEN-ANALYSE:');
    console.log(`✅ Verwendete Schriftarten: ${this.testResults.fonts.usedFontFamilies?.length || 0}`);
    if (this.testResults.fonts.usedFontFamilies) {
      this.testResults.fonts.usedFontFamilies.forEach(font => {
        console.log(`   - ${font}`);
      });
    }
    
    console.log(`📡 Externe Font-Requests: ${this.testResults.fonts.externalFonts?.length || 0}`);
    if (this.testResults.fonts.externalFonts?.length > 0) {
      this.testResults.fonts.externalFonts.forEach(font => {
        console.log(`   ⚠️  ${font.url}`);
      });
    }
    
    console.log(`🔤 Google Fonts: ${this.testResults.fonts.googleFonts?.length || 0}`);
    if (this.testResults.fonts.googleFonts?.length > 0) {
      this.testResults.fonts.googleFonts.forEach(font => {
        console.log(`   ⚠️  ${font.url}`);
      });
    }

    console.log(`❌ Verbotene Schriftarten: ${this.testResults.fonts.forbiddenFonts?.length || 0}`);
    if (this.testResults.fonts.forbiddenFonts?.length > 0) {
      this.testResults.fonts.forbiddenFonts.forEach(font => {
        console.log(`   🚫 ${font.url} - ${font.reason}`);
      });
    }

    // Cookie-Report
    console.log('\n🍪 COOKIE-ANALYSE:');
    console.log(`🍪 HTTP Cookies: ${this.testResults.cookies.httpCookies?.length || 0}`);
    if (this.testResults.cookies.httpCookies?.length > 0) {
      this.testResults.cookies.httpCookies.forEach(cookie => {
        console.log(`   - ${cookie.name}: ${cookie.value.substring(0, 50)}${cookie.value.length > 50 ? '...' : ''}`);
        console.log(`     Domain: ${cookie.domain}, Secure: ${cookie.secure}, HttpOnly: ${cookie.httpOnly}`);
      });
    }

    console.log(`💾 LocalStorage: ${this.testResults.cookies.localStorage?.length || 0} Items`);
    if (this.testResults.cookies.localStorage?.length > 0) {
      this.testResults.cookies.localStorage.forEach(item => {
        console.log(`   - ${item.key}: ${item.value.substring(0, 50)}${item.value.length > 50 ? '...' : ''}`);
      });
    }

    console.log(`🔄 SessionStorage: ${this.testResults.cookies.sessionStorage?.length || 0} Items`);
    if (this.testResults.cookies.sessionStorage?.length > 0) {
      this.testResults.cookies.sessionStorage.forEach(item => {
        console.log(`   - ${item.key}: ${item.value.substring(0, 50)}${item.value.length > 50 ? '...' : ''}`);
      });
    }

    // Privacy-Report
    console.log('\n🔒 DATENSCHUTZ-ANALYSE:');
    console.log(`📊 Tracking Scripts: ${this.testResults.privacy.trackingScripts?.length || 0}`);
    if (this.testResults.privacy.trackingScripts?.length > 0) {
      this.testResults.privacy.trackingScripts.forEach(script => {
        console.log(`   🚫 ${script.url}`);
      });
    }

    console.log(`🌐 Third-party Domains: ${this.testResults.privacy.thirdPartyDomains?.length || 0}`);
    if (this.testResults.privacy.thirdPartyDomains?.length > 0) {
      this.testResults.privacy.thirdPartyDomains.forEach(domain => {
        console.log(`   - ${domain}`);
      });
    }

    // Zusammenfassung
    console.log('\n📊 ZUSAMMENFASSUNG (BUILD):');
    const hasExternalFonts = (this.testResults.fonts.externalFonts?.length || 0) > 0;
    const hasGoogleFonts = (this.testResults.fonts.googleFonts?.length || 0) > 0;
    const hasForbiddenFonts = (this.testResults.fonts.forbiddenFonts?.length || 0) > 0;
    const hasCookies = (this.testResults.cookies.httpCookies?.length || 0) > 0;
    const hasLocalStorage = (this.testResults.cookies.localStorage?.length || 0) > 0;
    const hasTracking = (this.testResults.privacy.trackingScripts?.length || 0) > 0;

    console.log(`${hasExternalFonts ? '❌' : '✅'} Externe Schriftarten: ${hasExternalFonts ? 'GEFUNDEN' : 'KEINE'}`);
    console.log(`${hasGoogleFonts ? '❌' : '✅'} Google Fonts: ${hasGoogleFonts ? 'GEFUNDEN' : 'KEINE'}`);
    console.log(`${hasForbiddenFonts ? '❌' : '✅'} Verbotene Schriftarten: ${hasForbiddenFonts ? 'GEFUNDEN' : 'KEINE'}`);
    console.log(`${hasCookies ? '⚠️' : '✅'} HTTP Cookies: ${hasCookies ? 'GEFUNDEN' : 'KEINE'}`);
    console.log(`${hasLocalStorage ? '⚠️' : '✅'} Local Storage: ${hasLocalStorage ? 'GEFUNDEN' : 'KEINE'}`);
    console.log(`${hasTracking ? '❌' : '✅'} Tracking Scripts: ${hasTracking ? 'GEFUNDEN' : 'KEINE'}`);

    // JSON Report speichern
    const reportPath = path.join(__dirname, 'privacy-security-report-build.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`\n💾 Detaillierter Build-Report gespeichert: ${reportPath}`);

    console.log('\n' + '='.repeat(60));
  }
}

// Test ausführen
async function runPrivacySecurityBuildTests() {
  const tester = new PrivacySecurityBuildTester();
  await tester.runTests();
}

// Main execution
if (require.main === module) {
  console.log('🔍 Privacy & Security Test Suite für Trackmania Analyzer (BUILD)');
  console.log('Überprüft: Schriftarten-Downloads und Cookie-Verwendung in Production Build\n');
  
  runPrivacySecurityBuildTests();
}

module.exports = PrivacySecurityBuildTester;
