// Script para convertir un usuario en administrador
// Ejecutar con: node make-admin.js

require('dotenv').config({ path: './config/index.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Conectado a MongoDB');

        // Buscar el usuario por email
        const email = 'admin@electromartinez.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ No se encontró usuario con email: ${email}`);
            console.log('Primero regístrate con este email en: http://localhost:5174/register');
            process.exit(1);
        }

        // Actualizar el role a 1 (admin)
        user.role = 1;
        await user.save();

        console.log('✅ Usuario convertido a administrador:');
        console.log(`   Nombre: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role} (1 = Admin)`);
        console.log('\n🎉 Ahora puedes iniciar sesión y acceder al panel admin!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

makeAdmin();
