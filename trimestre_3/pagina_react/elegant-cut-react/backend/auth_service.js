const jwt = require('jsonwebtoken');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { createServer } = require('http');
const bcrypt = require('bcryptjs');
const path = require('path');

// Configuración
const JWT_SECRET = "Clave-secreta-elegant-cut-2025";
const PORT = 3001;

// Ruta correcta
const USERS_PATH = path.join(__dirname, 'data', 'users.json');

// Función para cargar usuarios
function cargarUsuarios() {
    try {
        // Asegurar que la carpeta data existe
        const dataDir = path.dirname(USERS_PATH);
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        }
        
        // Si el archivo no existe, crearlo
        if (!existsSync(USERS_PATH)) {
            const estructuraInicial = { users: {} };
            writeFileSync(USERS_PATH, JSON.stringify(estructuraInicial, null, 2));
            return estructuraInicial;
        }
        
        const data = readFileSync(USERS_PATH, 'utf8');
        return JSON.parse(data);
        
    } catch (error) {
        console.log('Error cargando usuarios:', error.message);
        // Retornar estructura vacía
        return { users: {} };
    }
}

// Función para guardar usuarios
function guardarUsuarios(usuarios) {
    try {
        writeFileSync(USERS_PATH, JSON.stringify(usuarios, null, 2));
        console.log('✅ Usuarios guardados en:', USERS_PATH);
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
                
                console.log('🔨 Registrando usuario:', username);
                
                // Validaciones
                if (!username || !password || !name) {
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Faltan campos obligatorios'
                    }));
                }

                // Cargar usuarios
                const usuarios = cargarUsuarios();
                console.log('📊 Usuarios existentes:', usuarios);

                // Verificar si ya existe
                if (usuarios.users[username]) {
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

                // Guardar
                const guardado = guardarUsuarios(usuarios);
                
                if (!guardado) {
                    return res.end(JSON.stringify({
                        success: false,
                        error: 'Error al guardar'
                    }));
                }

                // Verificar guardado
                const verificacion = cargarUsuarios();
                console.log('🔍 Verificación - usuarios:', verificacion.users);
                console.log('🔍 Verificación - keys:', Object.keys(verificacion.users));

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
                console.log('💥 Error:', error);
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

                        res.end(JSON.stringify({
                            success: true,
                            token: token,
                            user: { username, name: usuario.name, role: usuario.role }
                        }));
                    } else {
                        res.end(JSON.stringify({
                            success: false,
                            error: 'Credenciales incorrectas'
                        }));
                    }
                } else {
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario no existe'
                    }));
                }
            } catch (error) {
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
            res.end(JSON.stringify({
                success: true,
                users: usuarios.users
            }));
        } catch (error) {
            res.end(JSON.stringify({
                success: false,
                error: 'Error cargando usuarios'
            }));
        }
        return;
    }

    // Ruta no encontrada
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
    
    // Verificar archivo al iniciar
    const usuarios = cargarUsuarios();
    console.log('📁 Archivo:', USERS_PATH);
    console.log('👥 Usuarios registrados:', Object.keys(usuarios.users).length);
});