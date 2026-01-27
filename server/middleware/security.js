const rateLimit = require('express-rate-limit');

// Rate limiting general para todas las rutas
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 1000, // 1000 peticiones por IP
    message: {
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting para autenticación (más estricto)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Solo 5 intentos de login
    skipSuccessfulRequests: true, // No cuenta los login exitosos
    message: {
        error: 'Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting para registro (prevenir spam)
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // Solo 3 registros por hora por IP
    message: {
        error: 'Demasiados intentos de registro. Por favor, intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting para creación de recursos (moderado)
const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 30, // 30 creaciones por minuto
    message: {
        error: 'Demasiadas peticiones de creación, por favor intenta de nuevo en un minuto.'
    },
});

// Rate limiting para endpoints públicos (productos, categorías)
const publicLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 200, // 200 peticiones por minuto
    message: {
        error: 'Demasiadas peticiones, por favor intenta de nuevo en un momento.'
    },
});

module.exports = {
    generalLimiter,
    authLimiter,
    registerLimiter,
    createLimiter,
    publicLimiter
};
