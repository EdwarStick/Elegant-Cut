const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const JWT_SECRET = "Clave-secreta-elegant-cut-2025";
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Función SIMPLE para cargar usuarios
function loadUsers() {
    try {
        // Crear carpeta si no existe
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Si el archivo no existe, crearlo
        if (!fs.existsSync(USERS_FILE)) {
            const initialData = { users: {} };
            fs.writeFileSync(USERS_FILE, JSON.stringify(initialData, null, 2));
            console.log('📄 Archivo creado:', USERS_FILE);
            return initialData;
        }
        
        // Leer archivo
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const parsed = JSON.parse(data);
        console.log('📖 Usuarios cargados:', Object.keys(parsed.users));
        return parsed;
    } catch (error) {
        console.log('❌ Error cargando:', error.message);
        return { users: {} };
    }
}

// Función SIMPLE para guardar
function saveUsers(users) {
    try {
        console.log('💾 Guardando usuarios:', Object.keys(users.users));
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('✅ Guardado exitoso en:', USERS_FILE);
        return true;
    } catch (error) {
        console.log('❌ Error guardando:', error.message);
        return false;
    }
}

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

    // REGISTRO
    if (req.url === '/auth/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, password, name, role = 'client' } = JSON.parse(body);
                console.log('\n=== NUEVO REGISTRO ===');
                console.log('Usuario:', username);
                console.log('Nombre:', name);
                
                if (!username || !password || !name) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ success: false, error: 'Campos faltantes' }));
                }

                const usersData = loadUsers();
                console.log('Usuarios antes:', Object.keys(usersData.users));

                if (usersData.users[username]) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ success: false, error: 'Usuario existe' }));
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                usersData.users[username] = {
                    password: hashedPassword,
                    name: name,
                    role: role,
                    createdAt: new Date().toISOString()
                };

                console.log('Usuario a guardar:', usersData.users[username]);
                
                const saved = saveUsers(usersData);
                if (!saved) {
                    res.writeHead(500);
                    return res.end(JSON.stringify({ success: false, error: 'Error guardando' }));
                }

                // VERIFICAR INMEDIATAMENTE
                const verify = loadUsers();
                console.log('🔍 VERIFICACIÓN - Usuarios después:', Object.keys(verify.users));
                console.log('🔍 VERIFICACIÓN - Archivo existe:', fs.existsSync(USERS_FILE));
                
                // Leer archivo directamente para ver contenido
                if (fs.existsSync(USERS_FILE)) {
                    const rawContent = fs.readFileSync(USERS_FILE, 'utf8');
                    console.log('🔍 VERIFICACIÓN - Contenido crudo:', rawContent);
                }

                const token = jwt.sign({ username, name, role }, JWT_SECRET, { expiresIn: '24h' });
                
                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Registro exitoso',
                    token: token,
                    user: { username, name, role }
                }));

            } catch (error) {
                console.log('💥 Error registro:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, error: 'Error servidor' }));
            }
        });
        return;
    }

    // LOGIN
    if (req.url === '/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, password } = JSON.parse(body);
                const usersData = loadUsers();

                if (usersData.users[username]) {
                    const user = usersData.users[username];
                    const match = await bcrypt.compare(password, user.password);
                    
                    if (match) {
                        const token = jwt.sign(
                            { username, name: user.name, role: user.role },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );

                        res.end(JSON.stringify({
                            success: true,
                            token: token,
                            user: { username, name: user.name, role: user.role }
                        }));
                    } else {
                        res.writeHead(401);
                        res.end(JSON.stringify({ success: false, error: 'Credenciales incorrectas' }));
                    }
                } else {
                    res.writeHead(401);
                    res.end(JSON.stringify({ success: false, error: 'Usuario no existe' }));
                }
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, error: 'Error servidor' }));
            }
        });
        return;
    }

    // ✅ Ruta para ACTUALIZAR CONTRASEÑA - INTEGRADA CORRECTAMENTE
    if (req.url === '/auth/update-password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, newPassword } = JSON.parse(body);
                const usersData = loadUsers();
                
                console.log('🔑 Actualizando contraseña para:', username);
                
                if (!username || !newPassword) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Usuario y nueva contraseña son requeridos' 
                    }));
                }
                
                if (!usersData.users[username]) {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Usuario no encontrado' 
                    }));
                }
                
                if (newPassword.length < 6) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: 'La contraseña debe tener al menos 6 caracteres' 
                    }));
                }
                
                // Hashear nueva contraseña
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                
                // Actualizar contraseña
                usersData.users[username].password = hashedPassword;
                usersData.users[username].updatedAt = new Date().toISOString();
                
                // Guardar cambios
                const saved = saveUsers(usersData);
                
                if (saved) {
                    console.log('✅ Contraseña actualizada para:', username);
                    res.writeHead(200);
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'Contraseña actualizada exitosamente' 
                    }));
                } else {
                    res.writeHead(500);
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Error al guardar la nueva contraseña' 
                    }));
                }
            } catch (error) {
                console.log('💥 Error actualizando contraseña:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error del servidor' 
                }));
            }
        });
        return;
    }

    // GET USERS
    if (req.url === '/auth/users' && req.method === 'GET') {
        const usersData = loadUsers();
        res.end(JSON.stringify({ success: true, users: usersData.users }));
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
    console.log('🚀 Servidor FIXED corriendo en http://localhost:' + PORT);
    console.log('📁 Archivo:', USERS_FILE);
    
    // Verificar estado inicial
    const users = loadUsers();
    console.log('👥 Usuarios al iniciar:', Object.keys(users.users));
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.log('💥 Error no capturado:', error);
});