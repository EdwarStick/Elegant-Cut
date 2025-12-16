const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./Configuracion/database');
const EmailService = require('./emailService');
const Dashboard = require('./Modelos/Dashboard');
const Service = require('./Modelos/Service');
const Appointment = require('./Modelos/Appointment');
const User = require('./Modelos/User');
const Barber = require('./Modelos/Barber');
const Client = require('./Modelos/Client');
const handleAdminRoutes = require('./Rutas/adminRoutes');

const JWT_SECRET = "Clave-secreta-elegant-cut-2025";
const PORT = 3001;

// Servidor HTTP
const http = require('http');
const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
                console.log(' Login attempt for:', username);

                // Buscar usuario usando el Modelo
                const user = await User.findByUsernameWithRole(username);

                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario no encontrado'
                    }));
                }

                console.log('User found:', user.prim_nombre, 'Role:', user.role);

                // Verificar contraseÃ±a
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                if (!isValidPassword) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'ContraseÃ±a incorrecta'
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
                console.log('Error en login:', error);
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
                const userData = JSON.parse(body);
                const { username, email, prim_nombre, apellido1, role = 'cliente' } = userData;
                console.log('Registro para:', username);

                // Verificar si usuario ya existe
                const exists = await User.exists(username, email);

                if (exists) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario o email ya existe'
                    }));
                }

                // Crear usuario usando el Modelo
                const userId = await User.create({ ...userData, roleName: role });

                // Generar token
                const token = jwt.sign(
                    {
                        username,
                        name: `${prim_nombre} ${apellido1}`,
                        role,
                        userId: userId
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
                        userId: userId
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

    // OLVIDAR CONTRASEÃ‘A - MANTENER POR COMPATIBILIDAD
    if (req.url === '/auth/forgot-password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const { username, newPassword } = JSON.parse(body);
                console.log('Recuperar contraseÃ±a para:', username);

                // Verificar que el usuario existe
                const user = await User.findByUsernameWithRole(username);

                if (!user) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario no encontrado'
                    }));
                }

                // Validar nueva contraseÃ±a
                if (!newPassword || newPassword.length < 6) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'La contraseÃ±a debe tener al menos 6 caracteres'
                    }));
                }

                // Actualizar contraseÃ±a usando el Modelo
                const updated = await User.updatePassword(username, newPassword);

                if (updated) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'ContraseÃ±a actualizada exitosamente'
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Error al actualizar la contraseÃ±a'
                    }));
                }

            } catch (error) {
                console.log(' Error en recuperar contraseÃ±a:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // 1. SOLICITAR CÃ“DIGO DE RECUPERACIÃ“N (NUEVO)
    if (req.url === '/auth/solicitar-recuperacion' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const { email } = JSON.parse(body);
                console.log('Solicitando recuperaciÃ³n para:', email);

                // Verificar que el email existe usando el Modelo
                const user = await User.findByEmail(email);

                if (!user) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'No existe una cuenta con este email'
                    }));
                }

                const username = user.username;

                // Generar y enviar cÃ³digo
                const codigo = EmailService.generarCodigo();
                const guardado = await EmailService.guardarCodigo(email, codigo, 'recuperacion');

                if (!guardado) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Error generando cÃ³digo'
                    }));
                }

                // Enviar email
                const emailEnviado = await EmailService.enviarCodigoRecuperacion(email, codigo);

                if (emailEnviado) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        mensaje: 'CÃ³digo enviado a tu email',
                        username: username
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Error enviando el cÃ³digo. Intenta nuevamente.'
                    }));
                }

            } catch (error) {
                console.log(' Error solicitando recuperaciÃ³n:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // 2. VERIFICAR CÃ“DIGO Y CAMBIAR CONTRASEÃ‘A (NUEVO)
    if (req.url === '/auth/verificar-codigo-recuperacion' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const { email, codigo, nuevaContrasena } = JSON.parse(body);
                console.log('Verificando cÃ³digo de recuperaciÃ³n para:', email);

                // Verificar cÃ³digo
                const verificacion = await EmailService.verificarCodigo(email, codigo, 'recuperacion');

                if (!verificacion.valido) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: verificacion.mensaje || 'CÃ³digo invÃ¡lido'
                    }));
                }

                // CÃ³digo vÃ¡lido â†’ CAMBIAR CONTRASEÃ‘A usando el Modelo
                const updated = await User.updatePassword(email, nuevaContrasena, true);

                if (updated) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Â¡ContraseÃ±a actualizada exitosamente!'
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Error actualizando contraseÃ±a'
                    }));
                }

            } catch (error) {
                console.log(' Error verificando cÃ³digo:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor: ' + error.message
                }));
            }
        });
        return;
    }

    // =============================================
    // NUEVAS RUTAS PARA EL FORMULARIO DE CITAS
    // =============================================

    // OBTENER SERVICIOS (para el formulario)
    if (req.url === '/api/services' && req.method === 'GET') {
        try {
            const services = await Service.getAll();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(services));
        } catch (error) {
            console.error('Error obteniendo servicios:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error obteniendo servicios' }));
        }
        return;
    }

    // OBTENER BARBEROS (para el formulario)
    if (req.url === '/api/barbers' && req.method === 'GET') {
        try {
            const barbers = await Barber.getActive();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(barbers));
        } catch (error) {
            console.error('Error obteniendo barberos:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error obteniendo barberos' }));
        }
        return;
    }

    // AGENDAR CITA (para el formulario) - CORREGIDO
    if (req.url === '/api/appointments' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const appointmentData = JSON.parse(body);
                console.log('Intentando agendar cita para:', appointmentData.name);

                // Crear cita usando el Modelo
                const appointmentId = await Appointment.create(appointmentData);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Cita agendada exitosamente',
                    appointmentId: appointmentId
                }));

            } catch (error) {
                console.error('Error al agendar cita:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Error al agendar la cita: ' + error.message
                }));
            }
        });
        return;
    }


    // INTENTAR MANEJAR RUTAS DE ADMIN
    // =============================================
    const adminHandled = await handleAdminRoutes(req, res);
    if (adminHandled) return; // Si se manejÃ³ la ruta, salir

    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
    console.log(' Servidor con MySQL corriendo en http://localhost:' + PORT);
    console.log(' Rutas disponibles:');
    console.log('   - /auth/login');
    console.log('   - /auth/register');
    console.log('   - /api/services');
    console.log('   - /api/barbers');
    console.log('   - /api/appointments');
    console.log('   - /admin/dashboard/*');
});
