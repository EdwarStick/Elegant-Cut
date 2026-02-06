const jwt = require('jsonwebtoken');
const EmailService = require('../../emailService'); // Importar el servicio correcto desde la raíz

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

    // Recuperar contraseña (Legacy - username param)
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

    // --- NUEVO FLUJO DE RECUPERACIÓN (Email + Código) ---

    // 1. Solicitar código de recuperación
    static async solicitarRecuperacion(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, message: 'El email es requerido' });
            }

            // Verificar si el usuario existe
            const user = await User.findByEmail(email);
            if (!user) {
                // Por seguridad, no decimos si el email existe o no, pero logueamos
                console.log('Intento de recuperación para email no registrado:', email);
                return res.json({ success: true, message: 'Si el correo existe, se enviará un código.' });
            }

            // Generar código
            const codigo = EmailService.generarCodigo();

            // Guardar en memoria
            await EmailService.guardarCodigo(email, codigo, 'recuperacion');

            // Enviar email
            const enviado = await EmailService.enviarCodigoRecuperacion(email, codigo);

            if (enviado) {
                res.json({ success: true, message: 'Código enviado correctamente' });
            } else {
                res.status(500).json({ success: false, error: 'Error al enviar el email' });
            }
        } catch (error) {
            console.error('Error en solicitarRecuperacion:', error);
            next(error);
        }
    }

    // 2. Verificar código
    static async verificarCodigo(req, res, next) {
        try {
            const { email, codigo } = req.body;

            if (!email || !codigo) {
                return res.status(400).json({ success: false, message: 'Email y código son requeridos' });
            }

            // Verificar código (Nota: verificarCodigo borra el código si es exitoso,
            // pero para este flujo necesitamos que persista hasta el cambio de contraseña
            // O podemos confiar en que el frontend enviará el cambio inmediatamente.
            // MODIFICACIÓN: En EmailService.verificarCodigo, si es válido, SE BORRA.
            // Para cambiar contraseña, necesitaremos volver a verificar o confiar en la sesión client-side.
            // Mejor opción: Permitir verificar sin borrar, o borrar solo al cambiar pass.
            // Por simplicidad, usaremos verificarCodigo y si es OK, retornamos success.
            // EL frontend deberá pedir cambiar la contraseña inmediatamente.
            // *NOTA IMPORTANTE*: Idealmente generaríamos un token temporal de cambio de pass aqui.

            const resultado = await EmailService.verificarCodigo(email, codigo, 'recuperacion');

            if (resultado.valido) {
                // Volvemos a guardar el código temporalmente (hack para permitir el siguiente paso) 
                // O mejor aun, simplemente retornamos éxito y en el paso de cambiar contraseña 
                // pedimos el código nuevamente pero esta vez "quemándolo".

                // Re-guardamos para que esté disponible para el paso final
                await EmailService.guardarCodigo(email, codigo, 'recuperacion');

                res.json({ success: true, message: 'Código verificado correctamente' });
            } else {
                res.status(400).json({ success: false, error: resultado.mensaje });
            }
        } catch (error) {
            console.error('Error en verificarCodigo:', error);
            next(error);
        }
    }

    // 3. Restablecer contraseña con código valido
    static async restablecerContrasena(req, res, next) {
        try {
            const { email, codigo, newPassword } = req.body;

            if (!email || !codigo || !newPassword) {
                return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
            }

            // Verificar código nuevamente (y esta vez dejar que se borre o borrarlo explicitamente)
            const resultado = await EmailService.verificarCodigo(email, codigo, 'recuperacion');

            if (!resultado.valido) {
                return res.status(400).json({ success: false, error: resultado.mensaje });
            }

            // Actualizar contraseña
            const updated = await User.updatePassword(email, newPassword, true); // true = buscar por email

            if (updated) {
                res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
            } else {
                res.status(500).json({ success: false, error: 'Error al actualizar la contraseña' });
            }

        } catch (error) {
            console.error('Error en restablecerContrasena:', error);
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
