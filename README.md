# 🏁 Trackmania COTD Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.10.3-8884d8.svg)](https://recharts.org/)

A modern, feature-rich web application for analyzing your Trackmania Cup of the Day (COTD) performance. Get detailed insights, track your progress, and discover patterns in your racing data.

## ✨ Features

### 🎯 Core Analytics
- **Performance Tracking**: Visualize your percentile rankings over time
- **Division Analysis**: Track your division placements and progress
- **Trend Analysis**: Identify improvement patterns with moving averages and trendlines
- **Map Type Performance**: Analyze your strengths across different map types
- **Points System**: Custom scoring system based on division and rank

### 🚀 Advanced Features
- **Smart Notifications**: AI-powered insights that detect improvements, streaks, and patterns
- **Advanced Search**: Filter data by date, division, percentile, map type, and more
- **Keyboard Shortcuts**: 14+ shortcuts for power users (Ctrl+K, Ctrl+1-5, etc.)
- **Interactive Charts**: Zoom, brush, and explore your data with Recharts
- **Data Export/Import**: JSON export for backup and sharing

### 🎨 User Experience
- **Guided Onboarding**: Interactive tour for new users
- **Floating Action Button**: Quick access to common actions
- **Glass Morphism Design**: Modern UI with backdrop blur effects
- **Responsive Design**: Works perfectly on desktop and mobile
- **Internationalization**: Available in English and German

### 🔒 Privacy & Security
- **Local Storage Only**: Your data never leaves your browser
- **No Server Required**: Completely client-side application
- **GDPR Compliant**: No tracking, no cookies, no data collection

## 🚀 Quick Start

### Option 1: Use Online (Recommended)
Visit the live application: **[trackmania-cotd-analyzer.vercel.app](https://trackmania-cotd-analyzer.vercel.app)**

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trackmania-cotd-analyzer.git
   cd trackmania-cotd-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 How to Use

### 1. Import Your Data
- Go to your Trackmania profile
- Navigate to your Cup of the Day results
- Copy the results (Ctrl+C)
- Paste them into the analyzer
- Click "Process Data"

### 2. Explore Your Analytics
- **Performance View**: See your percentile rankings over time
- **Division Distribution**: Understand your division placements
- **Division Progress**: Track your division improvements
- **Points Progress**: Monitor your custom point scoring
- **Division Rank**: Analyze your positions within divisions

### 3. Use Advanced Features
- Press `Ctrl+K` for advanced search
- Use `Ctrl+1-5` to switch between views quickly
- Press `?` to see all keyboard shortcuts
- Export your data for backup with `Ctrl+E`

## 🛠️ Technical Stack

- **Frontend**: React 18.3.1 with Hooks
- **Styling**: Tailwind CSS 3.4.17 with custom animations
- **Charts**: Recharts 2.10.3 for data visualization
- **Build Tool**: Create React App
- **Internationalization**: Custom i18n system
- **State Management**: React useState/useEffect

## 🎨 Design Philosophy

- **User-Centric**: Every feature designed with user experience in mind
- **Performance First**: Optimized for speed and responsiveness
- **Accessibility**: WCAG compliant with keyboard navigation
- **Modern**: Glass morphism, smooth animations, and micro-interactions
- **Privacy-Focused**: No data collection, completely local

## 🌍 Internationalization

Currently supported languages:
- 🇺🇸 **English** (Default)
- 🇩🇪 **German** (Deutsch)

Want to add your language? See [Contributing](#contributing) below!

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🌐 Add a New Language
1. Fork the repository
2. Add your translations to `src/i18n/translations.js`
3. Add your language to `src/components/LanguageSelector.js`
4. Test the translation
5. Submit a pull request

### 🐛 Report Bugs
- Use the [Issues](https://github.com/yourusername/trackmania-cotd-analyzer/issues) tab
- Include steps to reproduce
- Add screenshots if applicable

### 💡 Suggest Features
- Open a [Feature Request](https://github.com/yourusername/trackmania-cotd-analyzer/issues/new?template=feature_request.md)
- Describe the use case
- Explain why it would be valuable

### 🔧 Development Setup
```bash
# Clone and install
git clone https://github.com/yourusername/trackmania-cotd-analyzer.git
cd trackmania-cotd-analyzer
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ubisoft/Nadeo** for creating Trackmania
- **Trackmania.io** for providing COTD data
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for the beautiful chart library

## 📞 Support

- 📧 **Email**: support@trackmania-analyzer.com
- 💬 **Discord**: [Join our community](https://discord.gg/trackmania-analyzer)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/trackmania-cotd-analyzer/issues)

## 🔄 Changelog

### v2.0.0 (Latest)
- ✨ Complete UI/UX overhaul
- 🚀 Smart notifications system
- ⌨️ Keyboard shortcuts
- 🔍 Advanced search and filtering
- 🌍 Internationalization (EN/DE)
- 🎨 Glass morphism design
- 📱 Mobile-first responsive design

### v1.0.0
- 📊 Basic COTD data analysis
- 📈 Performance charts
- 📋 Results table
- 💾 Local data storage

---

<div align="center">

**Made with ❤️ for the Trackmania community**

[⭐ Star this repo](https://github.com/yourusername/trackmania-cotd-analyzer) • [🐛 Report Bug](https://github.com/yourusername/trackmania-cotd-analyzer/issues) • [💡 Request Feature](https://github.com/yourusername/trackmania-cotd-analyzer/issues)

</div>
