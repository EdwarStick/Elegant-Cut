const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./config/database'); // Importar MySQL
const EmailService = require('./emailService'); // Añadir este import

const JWT_SECRET = "Clave-secreta-elegant-cut-2025";
const PORT = 3001;

// Servidor HTTP
const http = require('http');
const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // LOGIN CON MYSQL
    if (req.url === '/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, password } = JSON.parse(body);
                console.log('🔐 Login attempt for:', username);

                // Buscar usuario en MySQL
                const [users] = await pool.execute(
                    `SELECT u.*, r.nombre_rol as role 
                     FROM usuarios u 
                     LEFT JOIN rol r ON u.id_rol = r.id_rol 
                     WHERE u.username = ? AND u.estado = 1`,
                    [username]
                );

                if (users.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario no encontrado'
                    }));
                }

                const user = users[0];
                console.log('👤 User found:', user.prim_nombre, 'Role:', user.role);

                // Verificar contraseña
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                if (!isValidPassword) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Contraseña incorrecta'
                    }));
                }

                // Generar JWT token
                const token = jwt.sign(
                    { 
                        username: user.username, 
                        name: `${user.prim_nombre} ${user.apellido1}`,
                        role: user.role,
                        userId: user.id_usuario
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    token: token,
                    user: { 
                        username: user.username, 
                        name: `${user.prim_nombre} ${user.apellido1}`,
                        role: user.role,
                        userId: user.id_usuario
                    }
                }));

            } catch (error) {
                console.log('💥 Error en login:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // REGISTRO CON MYSQL - CORREGIDO
    if (req.url === '/auth/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, password, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, role = 'cliente' } = JSON.parse(body);
                console.log('📝 Registro para:', username);

                // Verificar si usuario ya existe
                const [existingUsers] = await pool.execute(
                    'SELECT id_usuario FROM usuarios WHERE username = ? OR email = ?',
                    [username, email]
                );

                if (existingUsers.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario o email ya existe'
                    }));
                }

                // Hashear contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                // Obtener id_rol
                const [roles] = await pool.execute(
                    'SELECT id_rol FROM rol WHERE nombre_rol = ?',
                    [role]
                );

                if (roles.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Rol no válido'
                    }));
                }

                const id_rol = roles[0].id_rol;

                // Crear usuario - CORREGIDO: usar todos los campos
                const [result] = await pool.execute(
                    `INSERT INTO usuarios (username, password_hash, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol, estado) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                    [username, hashedPassword, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol]
                );

                // Generar token
                const token = jwt.sign(
                    { 
                        username, 
                        name: `${prim_nombre} ${apellido1}`,
                        role, 
                        userId: result.insertId 
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    token: token,
                    user: { 
                        username, 
                        name: `${prim_nombre} ${apellido1}`,
                        role, 
                        userId: result.insertId 
                    }
                }));

            } catch (error) {
                console.log(' Error en registro:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor: ' + error.message
                }));
            }
        });
        return;
    }

    // OLVIDAR CONTRASEÑA - MANTENER POR COMPATIBILIDAD
    if (req.url === '/auth/forgot-password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, newPassword } = JSON.parse(body);
                console.log('🔑 Recuperar contraseña para:', username);

                // Verificar que el usuario existe
                const [users] = await pool.execute(
                    'SELECT id_usuario FROM usuarios WHERE username = ?',
                    [username]
                );

                if (users.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario no encontrado'
                    }));
                }

                // Validar nueva contraseña
                if (!newPassword || newPassword.length < 6) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'La contraseña debe tener al menos 6 caracteres'
                    }));
                }

                // Hashear nueva contraseña
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Actualizar contraseña
                const [result] = await pool.execute(
                    'UPDATE usuarios SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?',
                    [hashedPassword, username]
                );

                if (result.affectedRows > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Contraseña actualizada exitosamente'
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Error al actualizar la contraseña'
                    }));
                }

            } catch (error) {
                console.log(' Error en recuperar contraseña:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // 1. SOLICITAR CÓDIGO DE RECUPERACIÓN (NUEVO)
    if (req.url === '/auth/solicitar-recuperacion' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { email } = JSON.parse(body);
                console.log('🔑 Solicitando recuperación para:', email);

                // Verificar que el email existe
                const [users] = await pool.execute(
                    'SELECT id_usuario, username FROM usuarios WHERE email = ?',
                    [email]
                );

                if (users.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'No existe una cuenta con este email'
                    }));
                }

                const username = users[0].username;

                // Generar y enviar código
                const codigo = EmailService.generarCodigo();
                const guardado = await EmailService.guardarCodigo(email, codigo, 'recuperacion');
                
                if (!guardado) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Error generando código'
                    }));
                }

                // Enviar email
                const emailEnviado = await EmailService.enviarCodigoRecuperacion(email, codigo);

                if (emailEnviado) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        mensaje: 'Código enviado a tu email',
                        username: username
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Error enviando el código. Intenta nuevamente.'
                    }));
                }

            } catch (error) {
                console.log('💥 Error solicitando recuperación:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // 2. VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA (NUEVO)
    if (req.url === '/auth/verificar-codigo-recuperacion' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { email, codigo, nuevaContrasena } = JSON.parse(body);
                console.log('✅ Verificando código de recuperación para:', email);
                
                // Verificar código
                const verificacion = await EmailService.verificarCodigo(email, codigo, 'recuperacion');
                
                if (!verificacion.valido) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: verificacion.mensaje || 'Código inválido'
                    }));
                }

                // Código válido → CAMBIAR CONTRASEÑA
                const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

                const [result] = await pool.execute(
                    'UPDATE usuarios SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
                    [hashedPassword, email]
                );

                if (result.affectedRows > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: '¡Contraseña actualizada exitosamente!'
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Error actualizando contraseña'
                    }));
                }

            } catch (error) {
                console.log('💥 Error verificando código:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor: ' + error.message
                }));
            }
        });
        return;
    }

    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
    console.log(' Servidor con MySQL corriendo en http://localhost:' + PORT);
});