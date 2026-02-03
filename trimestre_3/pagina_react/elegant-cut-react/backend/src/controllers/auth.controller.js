const jwt = require('jsonwebtoken');
const EmailService = require('../../emailService');

const User = require('../models/User.model');
const jwtConfig = require('../config/jwt');

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

            // Generar JWT token
            const token = jwt.sign(
                {
                    id: user.id_usuario,
                    username: user.username,
                    name: `${user.prim_nombre} ${user.apellido1}`,
                    role: user.role,
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
                    role: user.role,
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
    // Solicitar código de recuperación (NUEVO)
    static async solicitarRecuperacion(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'El email es requerido'
                });
            }

            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'No existe una cuenta con este email'
                });
            }

            // Generar y enviar código
            const codigo = EmailService.generarCodigo();
            const guardado = await EmailService.guardarCodigo(email, codigo, 'recuperacion');

            if (!guardado) {
                return res.status(500).json({
                    success: false,
                    error: 'Error generando código'
                });
            }

            const emailEnviado = await EmailService.enviarCodigoRecuperacion(email, codigo);

            if (emailEnviado) {
                res.json({
                    success: true,
                    mensaje: 'Código enviado a tu email',
                    username: user.username
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error enviando el código. Verifica tu conexión o intenta nuevamente.'
                });
            }
        } catch (error) {
            console.error('Error en solicitar recuperación:', error);
            next(error);
        }
    }

    // Verificar código y actualizar contraseña (NUEVO)
    static async verificarCodigo(req, res, next) {
        try {
            const { email, codigo, nuevaContrasena } = req.body;

            if (!email || !codigo || !nuevaContrasena) {
                return res.status(400).json({
                    success: false,
                    error: 'Faltan datos requeridos (email, código, contraseña)'
                });
            }

            const verificacion = await EmailService.verificarCodigo(email, codigo, 'recuperacion');

            if (!verificacion.valido) {
                return res.status(400).json({
                    success: false,
                    error: verificacion.mensaje || 'Código inválido'
                });
            }

            const updated = await User.updatePassword(email, nuevaContrasena, true);

            if (updated) {
                res.json({
                    success: true,
                    message: '¡Contraseña actualizada exitosamente!'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al actualizar la contraseña en la base de datos'
                });
            }
        } catch (error) {
            console.error('Error en verificar código:', error);
            next(error);
        }
    }
}

module.exports = AuthController;
