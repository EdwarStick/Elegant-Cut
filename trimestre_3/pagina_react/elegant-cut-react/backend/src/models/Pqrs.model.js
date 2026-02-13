const pool = require('../config/database');

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

class Pqrs {
    static async initTable() {
        try {
            await pool.execute(CREATE_PQRS_TABLE);
            console.log('Tabla PQRS verificada/creada');
        } catch (error) {
            console.error('Error creando tabla PQRS:', error);
        }
    }

    static async create(data) {
        try {
            const [result] = await pool.execute(
                `INSERT INTO pqrs 
                (tipo_solicitud, nombre_completo, identificacion, email, telefono, asunto, descripcion, medio_respuesta) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [data.requestType, data.userName, data.userId, data.userEmail, data.userPhone, data.subject, data.description, data.responseMedium]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT estado, fecha_creacion, fecha_respuesta, respuesta FROM pqrs WHERE id_pqrs = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByUserId(email, telefono) {
        try {
            console.log(`[MODEL] Buscando PQRS para Email: '${email}', Teléfono: '${telefono}'`);
            const [rows] = await pool.execute(
                `SELECT id_pqrs, tipo_solicitud, asunto, fecha_creacion, estado 
                 FROM pqrs 
                 WHERE email = ? OR telefono = ? 
                 ORDER BY fecha_creacion DESC`,
                [email, telefono]
            );
            console.log(`[MODEL] Encontrados ${rows.length} registros`);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Pqrs;
