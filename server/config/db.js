const mongoose = require('mongoose');

const connectDB = async () => {
    let mongoUrl = process.env.MONGO_URL;

    // En desarrollo sin MONGO_URL, usar base de datos en memoria
    if (!mongoUrl && process.env.NODE_ENV !== 'production') {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUrl = mongod.getUri();
        console.log('⚙️  Sin MONGO_URL — usando MongoDB en memoria (solo desarrollo)');
    }

    try {
        const connection = await mongoose.connect(mongoUrl);
        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        console.log(`📊 Database: ${connection.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('Verifica tu connection string y que tu IP esté en la whitelist de MongoDB Atlas');
        process.exit(1);
    }

    mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconectado');
    });
};

module.exports = connectDB;
