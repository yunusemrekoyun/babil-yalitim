// backend/middleware/errorHandler.js
/* Merkezi hata yakalayıcı */
module.exports = function errorHandler(err, req, res, next) {
  // Eğer zaten cevap gönderildiyse pas geç
  if (res.headersSent) return next(err);

  const status =
    err.status ||
    err.statusCode ||
    (err.name === "ValidationError" ? 400 : 500);

  // Prod'da stack göndermeyelim
  const isProd = process.env.NODE_ENV === "production";

  const payload = {
    success: false,
    message:
      err.message ||
      (status === 404 ? "Kaynak bulunamadı." : "Beklenmeyen bir hata oluştu."),
  };

  if (!isProd) {
    payload.name = err.name;
    payload.stack = err.stack;
    payload.details = err.errors || undefined;
  }

  // Basit log
  // eslint-disable-next-line no-console
  console.error("❌ Error:", {
    method: req.method,
    url: req.originalUrl,
    status,
    message: err.message,
  });

  res.status(status).json(payload);
};
