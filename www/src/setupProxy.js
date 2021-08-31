const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function (app) {
	['/api', '/media'].forEach((endpoint) => {
		app.use(endpoint, createProxyMiddleware({
			target: 'http://localhost:3001',
			changeOrigin: true,
		}));
	})
};
