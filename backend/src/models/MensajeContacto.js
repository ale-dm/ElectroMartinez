const mongoose = require('mongoose');

const mensajeContactoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    mensaje: { type: String, required: true },
    fechaEnvio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MensajeContacto', mensajeContactoSchema);
