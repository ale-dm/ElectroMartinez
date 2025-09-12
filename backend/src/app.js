const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const logger = require('./utils/logger');
const { apiLimiter } = require('./middlewares/rateLimit');
const app = express();

// Middlewares
app.use(compression());
app.use(helmet());
// app.use(mongoSanitize()); // Desactivado por incompatibilidad con req.query
app.use(cors({
	origin: [
		process.env.FRONTEND_URL || 'http://localhost:4200',
		'http://localhost:5173', // React Vite
		'http://localhost:3000'  // React Create React App
	],
	credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/repairs', require('./routes/repairs'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/invoices', require('./routes/invoices'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('MongoDB conectado'))
	.catch(err => console.error('Error de conexión a MongoDB:', err));


// Middleware global de manejo de errores
app.use((err, req, res, next) => {
	logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
	require('./middlewares/errorHandler')(err, req, res, next);
});

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
