import { useEffect } from 'react';
import { getPageSEO, getStructuredData } from '../utils/seoConfig';

// Custom hook for managing SEO meta tags
export const useSEO = (page = 'home', customData = {}) => {
  useEffect(() => {
    const seoData = { ...getPageSEO(page), ...customData };
    
    // Update document title
    document.title = seoData.title;
    
    // Update meta tags
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', seoData.title);
    updateMetaProperty('og:description', seoData.description);
    updateMetaProperty('og:url', seoData.url);
    updateMetaProperty('og:image', seoData.image);
    
    // Update Twitter tags
    updateMetaProperty('twitter:title', seoData.title);
    updateMetaProperty('twitter:description', seoData.description);
    updateMetaProperty('twitter:url', seoData.url);
    updateMetaProperty('twitter:image', seoData.twitterImage);
    
    // Update canonical URL
    updateCanonicalUrl(seoData.url);
    
    // Update structured data
    updateStructuredData(getStructuredData(page));
    
  }, [page, customData]);
};

// Helper function to update meta tags
const updateMetaTag = (name, content) => {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

// Helper function to update meta property tags (Open Graph, Twitter)
const updateMetaProperty = (property, content) => {
  if (!content) return;
  
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

// Helper function to update canonical URL
const updateCanonicalUrl = (url) => {
  if (!url) return;
  
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

// Helper function to update structured data
const updateStructuredData = (data) => {
  if (!data) return;
  
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Hook for setting page-specific SEO
export const usePageSEO = (pageConfig) => {
  useEffect(() => {
    if (pageConfig.title) {
      document.title = pageConfig.title;
    }
    
    if (pageConfig.description) {
      updateMetaTag('description', pageConfig.description);
    }
    
    if (pageConfig.keywords) {
      updateMetaTag('keywords', pageConfig.keywords);
    }
  }, [pageConfig]);
};

export default useSEO;
