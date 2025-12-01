const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./config/database'); // Importar MySQL
const EmailService = require('./emailService');
const Dashboard = require('./models/Dashboard');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

// SQL para crear la tabla PQRS si no existe (Ejecutar manualmente en Workbench es mejor, pero esto ayuda)
const CREATE_PQRS_TABLE = `
CREATE TABLE IF NOT EXISTS pqrs (
    id_pqrs INT AUTO_INCREMENT PRIMARY KEY,
    tipo_solicitud ENUM('peticion', 'queja', 'reclamo', 'sugerencia') NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    asunto VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    medio_respuesta ENUM('email', 'telefono', 'mail') DEFAULT 'email',
    estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    respuesta TEXT
)`;

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

                // Crear usuario
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

                if (!newPassword || newPassword.length < 6) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'La contraseña debe tener al menos 6 caracteres'
                    }));
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);

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

                const codigo = EmailService.generarCodigo();
                const guardado = await EmailService.guardarCodigo(email, codigo, 'recuperacion');

                if (!guardado) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Error generando código'
                    }));
                }

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

                const verificacion = await EmailService.verificarCodigo(email, codigo, 'recuperacion');

                if (!verificacion.valido) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: verificacion.mensaje || 'Código inválido'
                    }));
                }

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
    // 📬 RUTAS PARA PQRS
    // =============================================

    // CREAR PQRS
    if (req.url === '/api/pqrs' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log('📬 Recibida nueva PQRS:', data.subject);

                const [result] = await pool.execute(
                    `INSERT INTO pqrs 
                    (tipo_solicitud, nombre_completo, identificacion, email, telefono, asunto, descripcion, medio_respuesta) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.requestType,
                        data.userName,
                        data.userId,
                        data.userEmail,
                        data.userPhone,
                        data.subject,
                        data.description,
                        data.responseMedium
                    ]
                );

                const radicado = `PQRS-${new Date().getFullYear()}-${String(result.insertId).padStart(6, '0')}`;

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'PQRS radicada exitosamente',
                    radicado: radicado
                }));

            } catch (error) {
                console.error('Error creando PQRS:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error al guardar la PQRS: ' + error.message
                }));
            }
        });
        return;
    }

    // CONSULTAR ESTADO PQRS
    if (req.url.startsWith('/api/pqrs/status/') && req.method === 'GET') {
        try {
            const radicado = req.url.split('/').pop();
            const idParts = radicado.split('-');
            const id = parseInt(idParts[idParts.length - 1]);

            if (isNaN(id)) {
                throw new Error('Formato de radicado inválido');
            }

            const [rows] = await pool.execute(
                'SELECT estado, fecha_creacion, fecha_respuesta, respuesta FROM pqrs WHERE id_pqrs = ?',
                [id]
            );

            if (rows.length > 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    data: rows[0]
                }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'PQRS no encontrada'
                }));
            }
        } catch (error) {
            console.error('Error consultando PQRS:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Error consultando estado'
            }));
        }
        return;
    }

    // =============================================
    // 🎯 NUEVAS RUTAS PARA EL FORMULARIO DE CITAS
    // =============================================

    // OBTENER SERVICIOS (para el formulario)
    if (req.url === '/api/services' && req.method === 'GET') {
        try {
            const [services] = await pool.execute(
                'SELECT id_servicio, nombre, precio, duracion FROM servicios WHERE estado = 1'
            );

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
            const [barbers] = await pool.execute(
                `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2 
                 FROM usuarios WHERE id_rol = 2 AND estado = 1`
            );

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
            const connection = await pool.getConnection();

            try {
                await connection.beginTransaction();

                const { name, phone, email, date, time, barber, service, notes, paymentMethod } = JSON.parse(body);
                console.log('📅 Intentando agendar cita para:', name);

                // 1. Buscar o crear usuario (cliente)
                let userId;
                const [userExists] = await connection.execute(
                    'SELECT id_usuario FROM usuarios WHERE telefono = ? OR email = ?',
                    [phone, email || '']
                );

                if (userExists.length > 0) {
                    userId = userExists[0].id_usuario;
                    await connection.execute(
                        'UPDATE usuarios SET prim_nombre = ?, email = ? WHERE id_usuario = ?',
                        [name, email || '', userId]
                    );
                } else {
                    const [userResult] = await connection.execute(
                        `INSERT INTO usuarios 
                         (prim_nombre, telefono, email, id_rol, estado, created_at) 
                         VALUES (?, ?, ?, 3, 1, NOW())`,
                        [name, phone, email || null]
                    );
                    userId = userResult.insertId;
                }

                // 2. Buscar id_horarios
                const horaNumerica = parseInt(time.replace(':', ''));
                const [horarioResult] = await connection.execute(
                    'SELECT id_horarios FROM horarios WHERE hora_inicio = ?',
                    [horaNumerica]
                );

                if (horarioResult.length === 0) {
                    throw new Error('Horario no disponible');
                }
                const idHorarios = horarioResult[0].id_horarios;

                // 3. Insertar en reservas
                const [reservaResult] = await connection.execute(
                    `INSERT INTO reservas 
                     (fecha, observaciones, id_usuario, id_estado_cita, id_horarios) 
                     VALUES (?, ?, ?, 1, ?)`,
                    [date, notes || '', userId, idHorarios]
                );

                const reservaId = reservaResult.insertId;

                // 4. Insertar en detalle_cita_servicio
                await connection.execute(
                    'INSERT INTO detalle_cita_servicio (id_reservas, id_servicio) VALUES (?, ?)',
                    [reservaId, service]
                );

                // 5. Registrar PAGO (Pendiente)
                const idTipoPago = paymentMethod === 'transferencia' ? 2 : 1;

                const [serviceInfo] = await connection.execute('SELECT precio FROM servicios WHERE id_servicio = ?', [service]);
                const valor = serviceInfo.length > 0 ? serviceInfo[0].precio : 0;

                await connection.execute(
                    `INSERT INTO pagos (fecha, valor, id_tipo_pago, id_reservas) 
                     VALUES (NOW(), ?, ?, ?)`,
                    [valor, idTipoPago, reservaId]
                );

                await connection.commit();

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Cita agendada exitosamente',
                    appointmentId: reservaId
                }));

            } catch (error) {
                await connection.rollback();
                console.error('Error al agendar cita:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Error al agendar la cita: ' + error.message
                }));
            } finally {
                connection.release();
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
    }

    // BARBEROS - GET ALL
    if (req.url === '/admin/barbers' && req.method === 'GET') {
        try {
            const barbers = await User.getBarbers();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: barbers }));
        } catch (error) {
            console.log('💥 Error obteniendo barberos:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo barberos' }));
        }
        return;
    }

    // BARBEROS - CREATE
    if (req.url === '/admin/barbers' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const barberData = JSON.parse(body);
                const id = await User.createBarber(barberData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Barbero creado exitosamente',
                    id: id
                }));
            } catch (error) {
                console.log('💥 Error creando barbero:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error creando barbero: ' + error.message
                }));
            }
        });
        return;
    }

    // BARBEROS - UPDATE
    if (req.url.startsWith('/admin/barbers/') && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const id = req.url.split('/')[3];
                const barberData = JSON.parse(body);
                const updated = await User.update(id, barberData);

                if (updated) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Barbero actualizado exitosamente'
                    }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Barbero no encontrado'
                    }));
                }
            } catch (error) {
                console.log('💥 Error actualizando barbero:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error actualizando barbero'
                }));
            }
        });
        return;
    }

    // BARBEROS - DELETE
    if (req.url.startsWith('/admin/barbers/') && req.method === 'DELETE') {
        try {
            const id = req.url.split('/')[3];
            const deleted = await User.delete(id);

            if (deleted) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Barbero eliminado exitosamente'
                }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Barbero no encontrado'
                }));
            }
        } catch (error) {
            console.log('💥 Error eliminando barbero:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Error eliminando barbero'
            }));
        }
        return;
    }

    // CLIENTES - GET ALL
    if (req.url === '/admin/clients' && req.method === 'GET') {
        try {
            const clients = await User.getClients();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: clients }));
        } catch (error) {
            console.log('💥 Error obteniendo clientes:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Error obteniendo clientes' }));
        }
        return;
    }

    // MI NUEVA CONSULTA
    if (req.url === '/api/mis-consultas/ejemplo' && req.method === 'GET') {
        try {
            // Ejecutamos la consulta usando 'pool' que ya está importado arriba
            const [resultados] = await pool.execute('SELECT * FROM servicios');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(resultados));
        } catch (error) {
            console.log('Error en mi consulta:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

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
    console.log('   - /admin/barbers');
    console.log('   - /admin/clients');
});