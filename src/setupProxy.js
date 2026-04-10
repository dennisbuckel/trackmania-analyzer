const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // In http-proxy-middleware v3, use pathFilter instead of app.use mount path
  // to ensure pathRewrite works correctly
  app.use(
    createProxyMiddleware({
      target: 'https://trackmania.io',
      changeOrigin: true,
      pathFilter: '/tmio-api',
      pathRewrite: {
        '^/tmio-api': '/api',
      },
      headers: {
        'User-Agent': 'trackmania-analyzer/2.0',
      },
    })
  );
};
