import jwt from 'jsonwebtoken'; //sirve para crear los tokens
import { readFileSync } from 'fs'; //sirve para leer mi users.json que seria mi base de datos por ahora
import { createServer } from 'http'; //sirve para crear el servidor web

// configuración

const JWT_SECRET = "Clave-secreta-elegant-cut-2025"; // esta es la firma para los tokens 
const PORT = 3000; // este es el puesto donde correra el servidor

// cargar los usuarios desde el json

// lee el archivo users.json
function cargarUsuarios() {

    try{
        const data = readFileSync('users.json' , 'utf8'); // CORREGIDO: 'utf8'
        return JSON.parse(data);
    } catch (error) {
        console.error('Error cargando users.json:' , error);
        return{};
    }
}

// 👇👇👇 AÑADE ESTA FUNCIÓN NUEVA AQUÍ 👇👇👇
// Función para servir archivos HTML
function servirArchivo(res, filePath) {
    try {
        const data = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Archivo no encontrado' }));
    }
}
// 👆👆👆 HASTA AQUÍ EL PRIMER CAMBIO 👆👆👆

// creamos el servidor 

const server =createServer(async (req, res) => {
    //configuramos el CORS (Permite las peticiones desde los htmls)
    res.setHeader('Access-Control-Allow-Origin', '*'); // CORREGIDO: 'Access-Control-Allow-Origin'
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // CORREGIDO: 'Access-Control-Allow-Methods'
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // CORREGIDO: 'Access-Control-Allow-Headers'

    //Manejar solicitudes  OPTIONS(CORS)

    if (req.method === 'OPTIONS') { // CORREGIDO: 'if'
        res.writeHead(200);
        res.end();
        return;
    }

    // 👇👇👇 AÑADE ESTA RUTA NUEVA AQUÍ 👇👇👇
    // Servir archivo test.html
    if (req.url === '/test.html' && req.method === 'GET') {
        servirArchivo(res, 'test.html');
        return;
    }
    // 👆👆👆 HASTA AQUÍ EL SEGUNDO CAMBIO 👆👆👆

    //manejas ruta del LOGIN

    if(req.url === '/auth/login' && req.method === 'POST') { // CORREGIDO: '/auth/login'
        try {
            //leer los datos del formularios html
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); //ajusta los datos que llegan
            });

            // 2. Cuando terminan de llegar los datos 

            req.on('end', () => {
                //convertir el texto json a objeto javascript

                const {username, password} = JSON.parse (body);
                const usuarios = cargarUsuarios(); // lee el usars.json

                // 👇👇👇 AÑADE ESTAS LÍNEAS DE DEPURACIÓN 👇👇👇
                console.log('=== DEPURACIÓN LOGIN ===');
                console.log('Usuario buscado:', username);
                console.log('Contraseña enviada:', password);
                console.log('Usuarios cargados:', Object.keys(usuarios));
                console.log('Usuario existe?:', usuarios[username] ? 'SÍ' : 'NO');
                if (usuarios[username]) {
                    console.log('Contraseña esperada:', usuarios[username].password);
                    console.log('Coinciden?:', usuarios[username].password === password ? 'SÍ' : 'NO');
                }
                console.log('=======================');
                // 👆👆👆 HASTA AQUÍ 👆👆👆

                // verifica las credenciales

                if(usuarios[username] && usuarios[username].password === password) {
                    // si son correctos crea el token

                    const token = jwt.sign(
                        {
                            username : username,
                            name: usuarios[username].name,
                            role: usuarios[username].role
                        },
                        JWT_SECRET, //la clave secreta
                        {expiresIn: '24h'} //expira en 24 horas
                    );

                    //Envia una respuesta exitosa al HTML

                    res.writeHead(200, {'Content-Type': 'application/json'}); // CORREGIDO: 'application/json'
                    res.end(JSON.stringify({
                       success: true,
                       token: token,
                       user : {
                        username: username,
                        name:usuarios[username].name,
                        role: usuarios[username].role

                       } 
                    }));
                } else {
                    // si son incorrectos enviar error

                    res.writeHead(401, {'Content-Type': 'application/json'}); // CORREGIDO: 'application/json'
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Usuario o contraseña incorrectos'
                    }));
                }
            });
        } catch (error) { // CORREGIDO: 'error'
            //si hay cualquier erorr enviar error al servidor 

            res.writeHead(500, {'Content-Type': 'application/json'}); // CORREGIDO: 'application/json'
            res.end(JSON.stringify({
                success: false,
                error: 'Error en el servidor' // CORREGIDO: 'error'
            }));
        }
        return;
    }

    // Ruta no encontrada
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: 'Ruta no encontrada'}));

});

// Iniciar el servidor (SOLO ESTA LINEA NECESITAS AGREGAR)
server.listen(PORT, () => {
    console.log('Servidor corriendo en puerto ' + PORT);
});