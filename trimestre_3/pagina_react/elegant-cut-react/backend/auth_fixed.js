const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./config/database'); // Importar MySQL
const EmailService = require('./emailService');
const Dashboard = require('./models/Dashboard');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
const Barber = require('./models/Barber');
const Client = require('./models/Client');
const handleAdminRoutes = require('./routes/adminRoutes');

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
                const userData = JSON.parse(body);
                const { username, email, prim_nombre, apellido1, role = 'cliente' } = userData;
                console.log('📝 Registro para:', username);

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

    // OLVIDAR CONTRASEÑA - MANTENER POR COMPATIBILIDAD
    if (req.url === '/auth/forgot-password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const { username, newPassword } = JSON.parse(body);
                console.log('🔑 Recuperar contraseña para:', username);

                // Verificar que el usuario existe
                const user = await User.findByUsernameWithRole(username);

                if (!user) {
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

                // Actualizar contraseña usando el Modelo
                const updated = await User.updatePassword(username, newPassword);

                if (updated) {
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
                console.log(' Error solicitando recuperación:', error);
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

                // Código válido → CAMBIAR CONTRASEÑA usando el Modelo
                const updated = await User.updatePassword(email, nuevaContrasena, true);

                if (updated) {
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
                console.log(' Error verificando código:', error);
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
    // 🎯 NUEVAS RUTAS PARA EL FORMULARIO DE CITAS
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
            const barbers = await Barber.getAll();
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
                console.log('📅 Intentando agendar cita para:', appointmentData.name);

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

    // =============================================
    // ENDPOINTS DEL PANEL DE ADMINISTRACIÓN
    // =============================================

    // DASHBOARD STATS
    if (req.url === '/admin/dashboard/stats' && req.method === 'GET') {
        try {
            const stats = await Dashboard.getStats();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: stats }));
        } catch (error) {
            console.log('💥 Error obteniendo stats:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo estadísticas' }));
        }
        return;
    }

    // ACTIVIDAD RECIENTE
    if (req.url === '/admin/dashboard/activity' && req.method === 'GET') {
        try {
            const activity = await Dashboard.getRecentActivity();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: activity }));
        } catch (error) {
            console.log('💥 Error obteniendo actividad:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo actividad' }));
        }
        return;
    }

    // PRÓXIMAS CITAS
    if (req.url === '/admin/dashboard/appointments' && req.method === 'GET') {
        try {
            const appointments = await Dashboard.getUpcomingAppointments();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: appointments }));
        } catch (error) {
            console.log('💥 Error obteniendo citas:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo citas' }));
        }
        return;
    }

    // SERVICIOS - GET ALL
    if (req.url === '/admin/services' && req.method === 'GET') {
        try {
            const services = await Service.getAll();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: services }));
        } catch (error) {
            console.log('💥 Error obteniendo servicios:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo servicios' }));
        }
        return;
    }

    // SERVICIOS - CREATE
    if (req.url === '/admin/services' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const serviceData = JSON.parse(body);
                const id = await Service.create(serviceData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Servicio creado exitosamente',
                    id: id
                }));
            } catch (error) {
                console.log('💥 Error creando servicio:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error creando servicio: ' + error.message
                }));
            }
        });
        return;
    }

    // SERVICIOS - UPDATE
    if (req.url.startsWith('/admin/services/') && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const id = req.url.split('/')[3];
                const serviceData = JSON.parse(body);
                const updated = await Service.update(id, serviceData);

                if (updated) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Servicio actualizado exitosamente'
                    }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Servicio no encontrado'
                    }));
                }
            } catch (error) {
                console.log('💥 Error actualizando servicio:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error actualizando servicio'
                }));
            }
        });
        return;
    }

    // SERVICIOS - DELETE
    if (req.url.startsWith('/admin/services/') && req.method === 'DELETE') {
        try {
            const id = req.url.split('/')[3];
            const deleted = await Service.delete(id);

            if (deleted) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Servicio eliminado exitosamente'
                }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Servicio no encontrado'
                }));
            }
        } catch (error) {
            console.log('💥 Error eliminando servicio:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Error eliminando servicio'
            }));
        }
        return;
    }

    // CITAS - GET ALL
    if (req.url === '/admin/appointments' && req.method === 'GET') {
        try {
            const appointments = await Appointment.getAll();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: appointments }));
        } catch (error) {
            console.log('💥 Error obteniendo citas:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo citas' }));
        }
        return;
    }

    // CITAS - UPDATE STATUS
    if (req.url.startsWith('/admin/appointments/') && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const id = req.url.split('/')[3];
                const { nuevoEstado } = JSON.parse(body);
                const updated = await Appointment.updateStatus(id, nuevoEstado);

                if (updated) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Estado de cita actualizado'
                    }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Cita no encontrada'
                    }));
                }
            } catch (error) {
                console.log(' Error actualizando cita:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error actualizando cita'
                }));
            }
        });
        return;
    } // =============================================\r\n    // INTENTAR MANEJAR RUTAS DE ADMIN\r\n    // =============================================\r\n    const adminHandled = await handleAdminRoutes(req, res);\r\n    if (adminHandled) return; // Si se manej� la ruta, salir\r\n\r\n    // =============================================
    // INTENTAR MANEJAR RUTAS DE ADMIN
    // =============================================
    const adminHandled = await handleAdminRoutes(req, res);
    if (adminHandled) return; // Si se manejó la ruta, salir

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
