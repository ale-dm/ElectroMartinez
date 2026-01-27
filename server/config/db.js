const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Configuración optimizada para MongoDB Atlas (Mongoose 6+)
        const connection = await mongoose.connect(process.env.MONGO_URL);

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        console.log(`📊 Database: ${connection.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('Verifica tu connection string y que tu IP esté en la whitelist de MongoDB Atlas');
        process.exit(1);
    }

    // Manejo de eventos de conexión
    mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconectado');
    });
};

module.exports = connectDB;
