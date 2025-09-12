const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true, maxlength: 100 },
    descripcion: { type: String, required: true, trim: true, maxlength: 1000 },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    subcategoria: { type: String, trim: true, maxlength: 100 }, // nombre de subcategoria, opcional para compatibilidad
    marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca', required: false },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    imagenes: [{ type: String, trim: true }],
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = mongoose.model('Producto', productoSchema);
