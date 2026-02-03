const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/solicitar-recuperacion', AuthController.requestPasswordReset); // Nuevo para SettingsTab
router.post('/verificar-codigo-recuperacion', AuthController.verifyCodeAndResetPassword); // Público atomic
router.post('/verify-code', AuthController.verifyCode); // Nuevo para SettingsTab

// Protected routes
router.get('/me', authenticate, AuthController.me);
router.put('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
