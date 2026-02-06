const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/solicitar-recuperacion', AuthController.solicitarRecuperacion);
router.post('/verificar-codigo', AuthController.verificarCodigo);
router.post('/restablecer-contrasena', AuthController.restablecerContrasena);

// Protected routes
router.get('/me', authenticate, AuthController.me);
router.put('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
