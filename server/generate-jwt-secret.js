// Script para generar un JWT Secret seguro
// Ejecutar con: node generate-jwt-secret.js

const crypto = require('crypto');

console.log('\n🔐 Generador de JWT Secret\n');
console.log('Copia y pega este valor en tu archivo .env:\n');
console.log('JWT_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('\n✅ Secret generado con éxito!\n');
