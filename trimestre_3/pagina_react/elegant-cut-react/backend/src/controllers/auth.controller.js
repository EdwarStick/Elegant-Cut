const jwt = require('jsonwebtoken');
const EmailService = require('../../emailService');

const User = require('../models/User.model');
const jwtConfig = require('../config/jwt');
const emailService = require('../services/email.service');

class AuthController {
    // Login con username (compatible con frontend actual)
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username y contraseña son requeridos'
                });
            }

            // Buscar usuario por username con rol
            const user = await User.findByUsernameWithRole(username);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await User.verifyPassword(password, user.password_hash);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    error: 'Contraseña incorrecta'
                });
            }

            // Normalizar rol para frontend
            let role = user.role ? user.role.toLowerCase() : 'cliente';
            if (role === 'administrador') role = 'admin';
            if (role === 'barbero') role = 'barber';

            // También normalizar por id_rol
            if (user.id_rol === 1) role = 'admin';
            if (user.id_rol === 2) role = 'barber';
            if (user.id_rol === 3) role = 'cliente';

            // Generar JWT token
            const token = jwt.sign(
                {
                    id: user.id_usuario,
                    username: user.username,
                    name: `${user.prim_nombre} ${user.apellido1}`,
                    role: role,
                    id_rol: user.id_rol,
                    userId: user.id_usuario
                },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );

            res.json({
                success: true,
                message: 'Login exitoso',
                token,
                user: {
                    username: user.username,
                    name: `${user.prim_nombre} ${user.apellido1}`,
                    role: role,
                    userId: user.id_usuario
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            next(error);
        }
    }

    // Registro de nuevo usuario
    static async register(req, res, next) {
        try {
            const { username, password, email, prim_nombre, apellido1, seg_nombre, apellido2, telefono, role = 'cliente' } = req.body;

            if (!username || !password || !email || !prim_nombre || !apellido1) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos requeridos deben ser completados'
                });
            }

            // Verificar si ya existe
            const exists = await User.exists(username, email);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    error: 'El username o email ya existe'
                });
            }

            // Crear usuario
            const userId = await User.create({
                username,
                password,
                email,
                prim_nombre,
                seg_nombre,
                apellido1,
                apellido2,
                telefono,
                roleName: role
            });

            // Generar token
            const token = jwt.sign(
                {
                    id: userId,
                    username,
                    name: `${prim_nombre} ${apellido1}`,
                    role,
                    userId: userId
                },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    username,
                    name: `${prim_nombre} ${apellido1}`,
                    role,
                    userId
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            next(error);
        }
    }

    // Recuperar contraseña
    static async forgotPassword(req, res, next) {
        try {
            const { username, newPassword } = req.body;

            if (!username || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Username y nueva contraseña son requeridos'
                });
            }

            // Verificar que el usuario existe
            const user = await User.findByUsernameWithRole(username);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }

            // SEGURIDAD: Impedir que administradores (rol 1) cambien contraseña por formulario público
            if (user.id_rol === 1 || user.role === 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Por seguridad, las cuentas administrativas deben gestionar su contraseña desde el Panel de Administración.'
                });
            }

            // Actualizar contraseña
            const updated = await User.updatePassword(username, newPassword, false);

            if (updated) {
                res.json({
                    success: true,
                    message: 'Contraseña actualizada exitosamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al actualizar la contraseña'
                });
            }
        } catch (error) {
            console.error('Error en forgot password:', error);
            next(error);
        }
    }

    // Obtener usuario autenticado
    static async me(req, res, next) {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // Cambiar contraseña (usuario autenticado)
    static async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Contraseña actual y nueva contraseña son requeridas'
                });
            }

            const user = await User.findById(req.user.id);
            const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña actual incorrecta'
                });
            }

            await User.updatePassword(user.username, newPassword, false);

            res.json({
                success: true,
                message: 'Contraseña actualizada exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
