const Marca = require('../models/Marca');
const Producto = require('../models/Producto');

// Crear una nueva marca
exports.crearMarca = async (req, res) => {
  try {
    const { nombre, descripcion, activo, orden } = req.body;
    const existe = await Marca.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(400).json({ message: 'La marca ya existe.' });
    }
    const marca = new Marca({ nombre: nombre.trim(), descripcion, activo, orden });
    await marca.save();
    res.status(201).json(marca);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la marca', error });
  }
};

// Obtener todas las marcas
exports.obtenerMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find().sort({ orden: 1, nombre: 1 });
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener marcas', error });
  }
};

// Obtener una marca por ID
exports.obtenerMarcaPorId = async (req, res) => {
  try {
    const marca = await Marca.findById(req.params.id);
    if (!marca) return res.status(404).json({ message: 'Marca no encontrada' });
    res.json(marca);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la marca', error });
  }
};

// Actualizar una marca
exports.actualizarMarca = async (req, res) => {
  try {
    const { nombre, descripcion, activo, orden } = req.body;
    const marca = await Marca.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, activo, orden },
      { new: true, runValidators: true }
    );
    if (!marca) return res.status(404).json({ message: 'Marca no encontrada' });
    res.json(marca);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la marca', error });
  }
};

// Eliminar una marca (solo si no está en uso)
exports.eliminarMarca = async (req, res) => {
  try {
    const productos = await Producto.find({ marca: req.params.id });
    if (productos.length > 0) {
      return res.status(400).json({ message: 'No se puede eliminar la marca porque está asociada a productos.' });
    }
    const marca = await Marca.findByIdAndDelete(req.params.id);
    if (!marca) return res.status(404).json({ message: 'Marca no encontrada' });
    res.json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la marca', error });
  }
};
