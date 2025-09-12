const mongoose = require('mongoose');

const reparacionSchema = new mongoose.Schema({
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    descripcion: { type: String, required: true },
    estado: { type: String, enum: ['pendiente', 'en curso', 'finalizada'], default: 'pendiente' },
    fechaSolicitud: { type: Date, default: Date.now },
    notas: { type: String }
});

module.exports = mongoose.model('Reparacion', reparacionSchema);
