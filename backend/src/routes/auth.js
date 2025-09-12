const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { body } = require('express-validator');

// Registro de usuario
router.post('/register', [
    body('nombre').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], register);

// Login de usuario
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], login);

module.exports = router;
