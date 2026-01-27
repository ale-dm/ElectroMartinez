const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

require('dotenv').config({
    path: './config/index.env'
});

// MongoDB
const connectDB = require('./config/db');
connectDB();

// Seguridad: Headers HTTP seguros con Helmet
app.use(helmet());

// Middleware para parsear JSON con límite de tamaño
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging en desarrollo
app.use(morgan('dev'));

// CORS configurado
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://tu-dominio.com' // Cambiar en producción
        : 'http://localhost:5173',
    credentials: true
}));

// Seguridad: Sanitizar datos para prevenir NoSQL injection
// NOTA: Temporalmente deshabilitado por incompatibilidad con Express 5
// Alternativa: Validación manual en controladores con express-validator
// app.use(mongoSanitize({
//     replaceWith: '_',
//     onSanitize: ({ req, key }) => {
//         console.warn(`⚠️ Intento de NoSQL injection detectado en ${req.path}: ${key}`);
//     }
// }));

// Importar limiters de seguridad
const { generalLimiter, publicLimiter } = require('./middleware/security');

// Aplicar rate limiting general
app.use('/api/', generalLimiter);

// Routes
app.use('/api/user/', require('./routes/auth.route'));
app.use('/api/category/', require('./routes/category.route'));
app.use('/api/brand/', require('./routes/brand.route'));
app.use('/api/product/', require('./routes/product.route'));
app.use('/api/order/', require('./routes/order.route'));
app.use('/api/review/', require('./routes/review.route'));
app.use('/api/coupon/', require('./routes/coupon.route'));
app.use('/api/admin/', require('./routes/admin.route'));
app.use('/api/notification/', require('./routes/notification.route'));
app.use('/api/stripe/', require('./routes/stripe.route'));
app.use('/api/returns/', require('./routes/return.route'));

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Errores de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expirado'
        });
    }
    
    // Error por defecto
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Ecommerce MERN API', 
        version: '1.0.0',
        status: 'running'
    });
});

// Page Not Found
app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not found'
    });
});

const PORT = process.env.PORT || 5000;

// Solo iniciar servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Exportar app para testing
module.exports = app;
