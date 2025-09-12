const Categoria = require('../models/Categoria');

// Crear categoría
exports.createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, activa, orden, subcategorias } = req.body;
    const existe = await Categoria.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(400).json({ message: 'La categoría ya existe.' });
    }
    const categoria = new Categoria({
      nombre: nombre.trim(),
      descripcion,
      activa,
      orden,
      subcategorias: Array.isArray(subcategorias) ? subcategorias.map(s => ({
        nombre: s.nombre.trim(),
        descripcion: s.descripcion,
        activa: s.activa,
        orden: s.orden
      })) : []
    });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las categorías (con subcategorías)
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar categoría
exports.updateCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, activa, orden, subcategorias } = req.body;
    const update = {
      nombre: nombre && nombre.trim(),
      descripcion,
      activa,
      orden,
      subcategorias: Array.isArray(subcategorias) ? subcategorias.map(s => ({
        nombre: s.nombre.trim(),
        descripcion: s.descripcion,
        activa: s.activa,
        orden: s.orden
      })) : undefined
    };
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar categoría
exports.deleteCategoria = async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Añadir subcategoría a una categoría
exports.addSubcategoria = async (req, res) => {
  try {
    const { nombre, descripcion, activa, orden } = req.body;
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
    if (categoria.subcategorias.some(s => s.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())) {
      return res.status(400).json({ message: 'La subcategoría ya existe en esta categoría.' });
    }
    categoria.subcategorias.push({ nombre: nombre.trim(), descripcion, activa, orden });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar subcategoría de una categoría
exports.deleteSubcategoria = async (req, res) => {
  try {
    const { subcatNombre } = req.body;
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
    categoria.subcategorias = categoria.subcategorias.filter(s => s.nombre.trim().toLowerCase() !== subcatNombre.trim().toLowerCase());
    await categoria.save();
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
