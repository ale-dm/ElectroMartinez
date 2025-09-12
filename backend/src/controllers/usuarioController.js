const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.listarUsuarios = async (req, res) => {
  try {
    const { page, limit, nombre, email, rol } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const query = {};
    if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (rol) query.rol = rol;
    const usuarios = await Usuario.find(query)
      .select('-password')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const total = await Usuario.countDocuments(query);
    res.json({ total, page: pageNum, limit: limitNum, usuarios });
  } catch (err) {
    next(err);
  }
};

exports.crearUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const { nombre, email, password, rol } = req.body;
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      const error = new Error('El usuario ya existe');
      error.status = 400;
      return next(error);
    }
    usuario = new Usuario({ nombre, email, password, rol });
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    await usuario.save();
    res.status(201).json({ msg: 'Usuario creado correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.editarUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const { nombre, email, password, rol } = req.body;
    const update = {};
    if (nombre) update.nombre = nombre;
    if (email) update.email = email;
    if (rol) update.rol = rol;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json({ msg: 'Usuario actualizado correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
