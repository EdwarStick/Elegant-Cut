const jwt = require('jsonwebtoken');
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

            // Generar JWT token
            const token = jwt.sign(
                {
                    id: user.id_usuario,
                    username: user.username,
                    name: `${user.prim_nombre} ${user.apellido1}`,
                    role: role,
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
    // Solicitar código de recuperación/verificación
    static async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, error: 'Email requerido' });
            }

            // Verificar usuario
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
            }

            // SEGURIDAD: Verificar si es admin
            if (user.id_rol === 1 || user.role === 'admin') {
                // Verificar si viene autenticado con token (es decir, desde el panel)
                const authHeader = req.headers.authorization;
                let isAuthenticatedAdmin = false;

                if (authHeader) {
                    try {
                        const token = authHeader.split(' ')[1];
                        const decoded = jwt.verify(token, jwtConfig.secret);
                        if (decoded.role === 'admin' || decoded.id_rol === 1) {
                            isAuthenticatedAdmin = true;
                        }
                    } catch (e) {
                        // Token inválido o expirado
                    }
                }

                // SI NO es autenticado (formulario público), bloquear
                if (!isAuthenticatedAdmin) {
                    return res.status(403).json({
                        success: false,
                        error: 'Por seguridad, las cuentas administrativas deben gestionar su contraseña desde el Panel de Administración (Perfil -> Seguridad).'
                    });
                }
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Guardar código en memoria temporalmente (simple store)
            // En producción usar Redis o DB
            if (!global.verificationCodes) global.verificationCodes = {};
            global.verificationCodes[email] = {
                code,
                expires: Date.now() + 15 * 60 * 1000 // 15 mins
            };

            const sent = await emailService.sendVerificationCode(email, code);

            if (sent) {
                res.json({ success: true, message: 'Código enviado' });
            } else {
                res.status(500).json({ success: false, error: 'Error enviando email' });
            }
        } catch (error) {
            next(error);
        }
    }

    // Verificar código
    static async verifyCode(req, res, next) {
        try {
            const { email, codigo } = req.body;

            if (!global.verificationCodes || !global.verificationCodes[email]) {
                return res.status(400).json({ success: false, error: 'Código no solicitado o expirado' });
            }

            const data = global.verificationCodes[email];
            if (Date.now() > data.expires) {
                delete global.verificationCodes[email];
                return res.status(400).json({ success: false, error: 'Código expirado' });
            }

            if (data.code !== codigo) {
                return res.status(400).json({ success: false, error: 'Código incorrecto' });
            }

            // Código válido
            delete global.verificationCodes[email];
            res.json({ success: true, message: 'Código verificado' });
        } catch (error) {
            next(error);
        }
    }
    // Verificar código y cambiar contraseña (flujo público)
    static async verifyCodeAndResetPassword(req, res, next) {
        try {
            const { email, codigo, nuevaContrasena } = req.body;

            // 1. Validar Código
            if (!global.verificationCodes || !global.verificationCodes[email]) {
                return res.status(400).json({ success: false, error: 'Código no solicitado o expirado' });
            }

            const data = global.verificationCodes[email];
            if (Date.now() > data.expires) {
                delete global.verificationCodes[email];
                return res.status(400).json({ success: false, error: 'Código expirado' });
            }

            if (data.code !== codigo) {
                return res.status(400).json({ success: false, error: 'Código incorrecto' });
            }

            // 2. Verificar usuario (doble check de seguridad para admin)
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
            }

            if (user.id_rol === 1 || user.role === 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Por seguridad, las cuentas de administrador no pueden usar este formulario.'
                });
            }

            // 3. Cambiar Contraseña
            const updated = await User.updatePassword(user.username, nuevaContrasena, false);

            if (updated) {
                delete global.verificationCodes[email]; // Limpiar código usado
                res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
            } else {
                res.status(500).json({ success: false, error: 'Error al actualizar la contraseña' });
            }

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
