const rateLimit = require('express-rate-limit');

// Limita a 100 peticiones por 15 minutos por IP
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    msg: 'Demasiadas peticiones desde esta IP, intenta más tarde.'
  }
});
