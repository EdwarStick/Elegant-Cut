const jwt = require('jsonwebtoken');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { createServer } = require('http');
const bcrypt = require('bcryptjs');
const path = require('path');

// Configuración
const JWT_SECRET = "Clave-secreta-elegant-cut-2025";
const PORT = 3001;

// ✅ Ruta CORREGIDA: en carpeta data
const USERS_PATH = path.join(__dirname, 'data', 'users.json');

// Función MEJORADA para cargar usuarios
function cargarUsuarios() {
    try {
        // ✅ Asegurar que la carpeta data existe
        const dataDir = path.dirname(USERS_PATH);
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        }
        
        if (!existsSync(USERS_PATH)) {
            // Si el archivo no existe, crearlo con estructura vacía
            writeFileSync(USERS_PATH, JSON.stringify({ users: {} }, null, 2));
            return { users: {} };
        }
        
        const data = readFileSync(USERS_PATH, 'utf8');
        const usuarios = JSON.parse(data);
        
        // Asegurar que tenga la estructura correcta
        if (!usuarios.users) {
            usuarios.users = {};
        }
        
        return usuarios;
    } catch (error) {
        console.log('Error cargando usuarios, creando nuevo archivo...');
        // Si hay error, crear archivo nuevo
        writeFileSync(USERS_PATH, JSON.stringify({ users: {} }, null, 2));
        return { users: {} };
    }
}

// Función MEJORADA para guardar
function guardarUsuarios(usuarios) {
    try {
        // ✅ Asegurar que la carpeta data existe
        const dataDir = path.dirname(USERS_PATH);
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        }
        
        writeFileSync(USERS_PATH, JSON.stringify(usuarios, null, 2));
        console.log('✅ Archivo guardado correctamente en:', USERS_PATH);
        return true;
    } catch (error) {
        console.log('❌ Error guardando:', error.message);
        return false;
    }
}

// Crear servidor
const server = createServer(async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar OPTIONS (CORS)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Ruta de REGISTRO
    if (req.url === '/auth/register' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { username, password, name, role = 'client' } = JSON.parse(body);
                
                console.log('🔨 Intentando registrar:', username);
                
                // Validaciones básicas
                if (!username || !password || !name) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Faltan campos obligatorios'
                    }));
                }

                // Cargar usuarios existentes
                const usuarios = cargarUsuarios();
                console.log('👥 Usuarios actuales:', Object.keys(usuarios.users));

                // Verificar si ya existe
                if (usuarios.users[username]) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario ya existe'
                    }));
                }

                // Hashear contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                // Crear usuario
                usuarios.users[username] = {
                    password: hashedPassword,
                    name: name,
                    role: role,
                    createdAt: new Date().toISOString()
                };

                // GUARDAR - esta es la parte importante
                const guardado = guardarUsuarios(usuarios);
                
                if (!guardado) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Error al guardar'
                    }));
                }

                // Verificar que realmente se guardó
                const usuariosVerificados = cargarUsuarios();
                console.log('🔍 Después de guardar:', Object.keys(usuariosVerificados.users));

                // Crear token
                const token = jwt.sign(
                    { username, name, role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Usuario registrado',
                    token: token,
                    user: { username, name, role }
                }));

            } catch (error) {
                console.log('💥 Error en registro:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // Ruta de LOGIN
    if (req.url === '/auth/login' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { username, password } = JSON.parse(body);
                const usuarios = cargarUsuarios();

                if (usuarios.users[username]) {
                    const usuario = usuarios.users[username];
                    const match = await bcrypt.compare(password, usuario.password);
                    
                    if (match) {
                        const token = jwt.sign(
                            { username, name: usuario.name, role: usuario.role },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            token: token,
                            user: { username, name: usuario.name, role: usuario.role }
                        }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            error: 'Credenciales incorrectas'
                        }));
                    }
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario no existe'
                    }));
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error del servidor'
                }));
            }
        });
        return;
    }

    // Ruta para ver usuarios
    if (req.url === '/auth/users' && req.method === 'GET') {
        try {
            const usuarios = cargarUsuarios();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                users: usuarios.users
            }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Error cargando usuarios'
            }));
        }
        return;
    }

    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
    console.log('📁 Archivo: ' + USERS_PATH);
    
    // Verificar archivo al iniciar
    const usuarios = cargarUsuarios();
    console.log('👥 Usuarios registrados:', Object.keys(usuarios.users).length);
});