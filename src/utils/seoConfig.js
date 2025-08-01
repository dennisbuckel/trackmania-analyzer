// SEO Configuration for COTD Analyzer
export const seoConfig = {
  siteName: 'Trackmania COTD Analyzer',
  siteUrl: 'https://cotdanalyzer.com',
  defaultTitle: 'Trackmania COTD Analyzer - Analyze Your Cup of the Day Performance',
  defaultDescription: 'Modern web application for analyzing your Trackmania Cup of the Day performance. Track rankings, visualize progress, and discover patterns in your racing data. Free, privacy-focused, and works offline.',
  defaultKeywords: 'trackmania, cotd, cup of the day, racing, analytics, performance, charts, gaming, trackmania analyzer, racing statistics, esports, competitive racing',
  author: 'Trackmania COTD Analyzer Team',
  twitterHandle: '@TrackmaniaAnalyzer',
  
  // Page-specific SEO data
  pages: {
    home: {
      title: 'Trackmania COTD Analyzer - Analyze Your Cup of the Day Performance',
      description: 'Modern web application for analyzing your Trackmania Cup of the Day performance. Track rankings, visualize progress, and discover patterns in your racing data.',
      keywords: 'trackmania, cotd, cup of the day, racing, analytics, performance, charts'
    },
    analytics: {
      title: 'Analytics Dashboard - COTD Analyzer',
      description: 'Comprehensive analytics dashboard for your Trackmania Cup of the Day performance. View detailed statistics, charts, and performance trends.',
      keywords: 'trackmania analytics, cotd dashboard, racing statistics, performance charts'
    },
    performance: {
      title: 'Performance Analysis - COTD Analyzer',
      description: 'Analyze your Trackmania COTD performance with detailed metrics, ranking progression, and improvement insights.',
      keywords: 'trackmania performance, cotd analysis, racing improvement, ranking progression'
    },
    divisions: {
      title: 'Division Analysis - COTD Analyzer',
      description: 'Track your division progression and compare performance across different Trackmania COTD divisions.',
      keywords: 'trackmania divisions, cotd ranking, division progression, competitive analysis'
    },
    import: {
      title: 'Data Import - COTD Analyzer',
      description: 'Import your Trackmania COTD data easily and securely. Support for multiple data formats and sources.',
      keywords: 'trackmania data import, cotd data, racing data analysis'
    },
    help: {
      title: 'Help & Tutorial - COTD Analyzer',
      description: 'Learn how to use the Trackmania COTD Analyzer. Step-by-step guides and tutorials for data analysis.',
      keywords: 'trackmania help, cotd tutorial, racing data guide'
    }
  },

  // Open Graph images
  images: {
    default: '/og-image.png',
    twitter: '/twitter-image.png',
    screenshot: '/screenshot-wide.png'
  },

  // Structured data
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Trackmania COTD Analyzer',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    isAccessibleForFree: true,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    inLanguage: ['en', 'de']
  }
};

// Helper function to get page-specific SEO data
export const getPageSEO = (page = 'home') => {
  const pageData = seoConfig.pages[page] || seoConfig.pages.home;
  
  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    url: `${seoConfig.siteUrl}${page === 'home' ? '/' : `/#/${page}`}`,
    image: `${seoConfig.siteUrl}${seoConfig.images.default}`,
    twitterImage: `${seoConfig.siteUrl}${seoConfig.images.twitter}`
  };
};

// Helper function to generate structured data for a specific page
export const getStructuredData = (page = 'home') => {
  const pageData = getPageSEO(page);
  
  return {
    ...seoConfig.structuredData,
    url: pageData.url,
    description: pageData.description,
    screenshot: `${seoConfig.siteUrl}${seoConfig.images.screenshot}`,
    author: {
      '@type': 'Organization',
      name: seoConfig.author
    },
    dateModified: new Date().toISOString().split('T')[0]
  };
};
