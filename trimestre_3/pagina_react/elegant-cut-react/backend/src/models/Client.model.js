const pool = require('../config/database');

class Client {
    // Obtener todos los clientes con paginación y búsqueda
    static async getAll(search = '', page = 1) {
        try {
            const limit = 50;
            const offset = (page - 1) * limit;

            let query = `
                SELECT 
                    u.id_usuario,
                    u.username,
                    u.prim_nombre,
                    u.seg_nombre,
                    u.apellido1,
                    u.apellido2,
                    u.email,
                    u.telefono,
                    u.estado,
                    u.created_at,
                    COUNT(r.id_reservas) as total_citas,
                    COUNT(CASE WHEN r.id_estado_cita = 2 THEN 1 END) as citas_completadas
                FROM usuarios u
                LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
                WHERE u.id_rol = 3
            `;

            const params = [];

            if (search) {
                query += ` AND (u.prim_nombre LIKE ? OR u.apellido1 LIKE ? OR u.email LIKE ? OR u.telefono LIKE ?)`;
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam, searchParam);
            }

            query += ` GROUP BY u.id_usuario ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener cliente por ID
    static async getById(id) {
        try {
            const [rows] = await pool.execute(
                `SELECT 
                    u.*,
                    COUNT(r.id_reservas) as total_citas
                FROM usuarios u
                LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
                WHERE u.id_usuario = ? AND u.id_rol = 3
                GROUP BY u.id_usuario`,
                [id]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    // Crear cliente manualmente
    static async create(clientData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { username, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono } = clientData;

            // Verificar si ya existe
            const [existing] = await connection.execute(
                'SELECT id_usuario FROM usuarios WHERE username = ? OR email = ? OR telefono = ?',
                [username, email, telefono]
            );

            if (existing.length > 0) {
                throw new Error('El username, email o teléfono ya existe');
            }

            // Crear cliente (id_rol = 3, sin password - puede registrarse después)
            const [result] = await connection.execute(
                `INSERT INTO usuarios 
                 (username, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol, estado, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 3, 1, NOW())`,
                [username, email, prim_nombre, seg_nombre || null, apellido1, apellido2 || null, telefono]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Actualizar cliente
    static async update(id, clientData) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono } = clientData;

            const [result] = await pool.execute(
                `UPDATE usuarios 
                 SET prim_nombre = ?, seg_nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, telefono = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id_usuario = ? AND id_rol = 3`,
                [prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Desactivar cliente (Soft Delete)
    static async deactivate(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 0, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_rol = 3',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtener historial de citas del cliente
    static async getAppointmentHistory(clientId) {
        try {
            const [rows] = await pool.execute(
                `SELECT 
                    r.id_reservas,
                    r.fecha,
                    r.observaciones,
                    r.id_estado_cita,
                    h.hora_inicio,
                    GROUP_CONCAT(s.nombre_servicio SEPARATOR ', ') as servicios
                FROM reservas r
                LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
                LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
                LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
                WHERE r.id_usuario = ?
                GROUP BY r.id_reservas
                ORDER BY r.fecha DESC`,
                [clientId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Client;
