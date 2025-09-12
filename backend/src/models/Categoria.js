const mongoose = require('mongoose');


const subcategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 100 },
  descripcion: { type: String, trim: true, maxlength: 500 },
  activa: { type: Boolean, default: true },
  orden: { type: Number, default: 0 }
}, { _id: false });


const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  descripcion: { type: String, trim: true, maxlength: 500 },
  activa: { type: Boolean, default: true },
  subcategorias: [subcategoriaSchema],
  orden: { type: Number, default: 0 },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
