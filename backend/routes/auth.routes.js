const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../config/jwt');

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.put('/cambiar-password', verificarToken, authController.cambiarContrasena);

module.exports = router;