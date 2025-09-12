const Reparacion = require('../models/Reparacion');
const { validationResult } = require('express-validator');

exports.crearReparacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const { productoId, descripcion } = req.body;
    const reparacion = new Reparacion({
      productoId,
      usuarioId: req.usuario.id,
      descripcion
    });
    await reparacion.save();
    res.status(201).json(reparacion);
  } catch (err) {
    next(err);
  }
};

exports.listarReparaciones = async (req, res) => {
  try {
    const { page, limit, estado, productoId, usuarioId } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const query = {};
    if (req.usuario.rol === 'admin') {
      if (estado) query.estado = estado;
      if (productoId) query.productoId = productoId;
      if (usuarioId) query.usuarioId = usuarioId;
    } else {
      query.usuarioId = req.usuario.id;
      if (estado) query.estado = estado;
      if (productoId) query.productoId = productoId;
    }
    const reparaciones = await Reparacion.find(query)
      .populate('productoId usuarioId')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const total = await Reparacion.countDocuments(query);
    res.json({ total, page: pageNum, limit: limitNum, reparaciones });
  } catch (err) {
    next(err);
  }
};

exports.detalleReparacion = async (req, res) => {
  try {
    const reparacion = await Reparacion.findById(req.params.id).populate('productoId usuarioId');
    if (!reparacion) {
      const error = new Error('Reparación no encontrada');
      error.status = 404;
      return next(error);
    }
    // Solo admin o dueño puede ver
    if (req.usuario.rol !== 'admin' && reparacion.usuarioId._id.toString() !== req.usuario.id) {
      const error = new Error('Acceso denegado');
      error.status = 403;
      return next(error);
    }
    res.json(reparacion);
  } catch (err) {
    next(err);
  }
};

exports.actualizarReparacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const update = req.body;
    const reparacion = await Reparacion.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!reparacion) {
      const error = new Error('Reparación no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json(reparacion);
  } catch (err) {
    next(err);
  }
};

exports.eliminarReparacion = async (req, res) => {
  try {
    const reparacion = await Reparacion.findByIdAndDelete(req.params.id);
    if (!reparacion) {
      const error = new Error('Reparación no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json({ msg: 'Reparación eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};
