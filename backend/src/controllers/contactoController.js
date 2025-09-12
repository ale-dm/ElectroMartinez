const MensajeContacto = require('../models/MensajeContacto');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

exports.enviarMensaje = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const { nombre, email, mensaje } = req.body;
    const nuevoMensaje = new MensajeContacto({ nombre, email, mensaje });
    await nuevoMensaje.save();

    // Enviar email si está configurado
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Nuevo mensaje de contacto',
        text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`
      });
    }
    res.status(201).json({ msg: 'Mensaje enviado correctamente' });
  } catch (err) {
    next(err);
  }
};
