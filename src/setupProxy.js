const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Tất cả request có tiền tố "/api" sẽ được chuyển tiếp
    createProxyMiddleware({
      target: "http://localhost:3001", // URL của back-end
      changeOrigin: true, // Thay đổi origin của request cho phù hợp với back-end
    })
  );
};
