# Deployment Guide

This guide covers different deployment options for the Trackmania COTD Analyzer.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment with automatic builds and global CDN.

#### Deploy with Git Integration
1. Fork the repository to your GitHub account
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your forked repository
5. Configure build settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Click "Deploy"

#### Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Build the project
npm run build

# Deploy
vercel --prod
```

### 2. Netlify

Netlify offers similar features with drag-and-drop deployment.

#### Deploy with Git Integration
1. Fork the repository
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub account
5. Select your forked repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
7. Click "Deploy site"

#### Deploy with Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### 3. GitHub Pages

Free hosting directly from your GitHub repository.

#### Setup GitHub Pages
1. Fork the repository
2. Install gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/trackmania-cotd-analyzer",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

Google's hosting platform with global CDN.

#### Setup Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Build the project
npm run build

# Deploy
firebase deploy
```

## 🔧 Build Configuration

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
# .env
REACT_APP_VERSION=2.0.0
REACT_APP_BUILD_DATE=2025-01-29
REACT_APP_ANALYTICS_ID=your-analytics-id
```

### Build Optimization

#### Production Build
```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm install -g source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

#### Performance Optimization
- Enable gzip compression on your server
- Set proper cache headers for static assets
- Use a CDN for global distribution
- Enable HTTP/2 if possible

## 🌐 Custom Domain Setup

### Vercel Custom Domain
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Netlify Custom Domain
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

### DNS Configuration
```
# Example DNS records
Type: CNAME
Name: www
Value: your-deployment-url.vercel.app

Type: A
Name: @
Value: [IP addresses provided by hosting service]
```

## 📊 Analytics Setup

### Google Analytics 4
1. Create a GA4 property
2. Get your Measurement ID
3. Add to environment variables:
   ```env
   REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. Add tracking code to `public/index.html`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Privacy-Friendly Analytics
Consider privacy-friendly alternatives:
- [Plausible](https://plausible.io/)
- [Fathom Analytics](https://usefathom.com/)
- [Simple Analytics](https://simpleanalytics.com/)

## 🔒 Security Headers

### Recommended Security Headers
```
# _headers (Netlify) or vercel.json (Vercel)
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
```

### Vercel Configuration
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 🚨 Monitoring & Error Tracking

### Sentry Integration
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Uptime Monitoring
Set up monitoring with:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📱 PWA Configuration

### Service Worker
The app includes basic PWA support. To enhance it:

1. Update `public/manifest.json`
2. Add custom service worker
3. Implement offline functionality
4. Add install prompts

### Manifest Configuration
```json
{
  "short_name": "COTD Analyzer",
  "name": "Trackmania COTD Analyzer",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Routing Issues (404 on refresh)
Add redirects configuration:

**Netlify** (`public/_redirects`):
```
/*    /index.html   200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Large Bundle Size
- Analyze bundle with `source-map-explorer`
- Implement code splitting
- Remove unused dependencies
- Optimize images and assets

### Performance Issues
- Enable compression (gzip/brotli)
- Optimize images
- Use lazy loading
- Implement service worker caching

## 📞 Support

If you encounter deployment issues:
1. Check the [troubleshooting section](#troubleshooting)
2. Review hosting provider documentation
3. Open an issue on GitHub
4. Contact the community for help

---

Happy deploying! 🚀
