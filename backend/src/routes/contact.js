const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const { body } = require('express-validator');

router.post('/', [
  body('nombre').notEmpty(),
  body('email').isEmail(),
  body('mensaje').notEmpty()
], contactoController.enviarMensaje);

module.exports = router;
