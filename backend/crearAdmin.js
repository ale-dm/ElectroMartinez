// Script para crear un usuario admin directamente en la base de datos
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Usuario = require('./src/models/Usuario');

async function crearAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'admin@email.com';
  const existe = await Usuario.findOne({ email });
  if (existe) {
    console.log('El usuario admin ya existe');
    process.exit();
  }
  const password = await bcrypt.hash('admin123', 10);
  const admin = new Usuario({
    nombre: 'Administrador',
    email,
    password,
    rol: 'admin'
  });
  await admin.save();
  console.log('Usuario admin creado:', email, 'contraseña: admin123');
  process.exit();
}

crearAdmin();
