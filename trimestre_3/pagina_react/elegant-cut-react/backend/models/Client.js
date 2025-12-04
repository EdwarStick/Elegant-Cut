const pool = require('../config/database');

class Client {
    // Obtener todos los clientes con paginación y búsqueda
    static async getAll(search = '', page = 1, limit = 50) {
        try {
            const offset = (page - 1) * limit;
            let query = `
        SELECT 
          u.id_usuario,
          u.prim_nombre,
          u.seg_nombre,
          u.apellido1,
          u.apellido2,
          u.email,
          u.telefono,
          u.estado,
          u.created_at,
          COUNT(r.id_reservas) as total_citas,
          MAX(r.fecha) as ultima_visita
        FROM usuarios u
        LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
        WHERE u.id_rol = 3
      `;

            const params = [];

            if (search) {
                query += ` AND (
          u.prim_nombre LIKE ? OR 
          u.apellido1 LIKE ? OR 
          u.telefono LIKE ? OR 
          u.email LIKE ?
        )`;
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }

            query += ` GROUP BY u.id_usuario ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener cliente por ID con historial de citas
    static async getById(id) {
        try {
            // Información del cliente
            const [clients] = await pool.execute(
                `SELECT 
          u.*,
          r.nombre_rol as rol
        FROM usuarios u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ? AND u.id_rol = 3`,
                [id]
            );

            if (clients.length === 0) {
                return null;
            }

            const client = clients[0];

            // Historial de citas
            const [appointments] = await pool.execute(
                `SELECT 
          r.id_reservas,
          r.fecha,
          r.observaciones,
          s.nombre as servicio,
          s.precio,
          ec.nombre_estado as estado,
          h.hora_inicio
        FROM reservas r
        LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
        LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
        LEFT JOIN estado_cita ec ON r.id_estado_cita = ec.id_estado_cita
        LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
        WHERE r.id_usuario = ?
        ORDER BY r.fecha DESC
        LIMIT 10`,
                [id]
            );

            client.historial_citas = appointments;
            return client;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar información del cliente
    static async update(id, clientData) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono } = clientData;

            const [result] = await pool.execute(
                `UPDATE usuarios 
         SET prim_nombre = ?, seg_nombre = ?, apellido1 = ?, apellido2 = ?, 
             email = ?, telefono = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id_usuario = ? AND id_rol = 3`,
                [prim_nombre, seg_nombre || null, apellido1, apellido2 || null, email, telefono, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Desactivar cliente (soft delete)
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

    // Activar cliente
    static async activate(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 1, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_rol = 3',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas del cliente
    static async getStats(id) {
        try {
            const [stats] = await pool.execute(
                `SELECT 
          COUNT(r.id_reservas) as total_citas,
          COUNT(CASE WHEN r.id_estado_cita = 2 THEN 1 END) as citas_completadas,
          COALESCE(SUM(s.precio), 0) as total_gastado,
          MAX(r.fecha) as ultima_visita,
          MIN(r.fecha) as primera_visita
        FROM reservas r
        LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
        LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
        WHERE r.id_usuario = ?`,
                [id]
            );

            return stats[0] || {
                total_citas: 0,
                citas_completadas: 0,
                total_gastado: 0,
                ultima_visita: null,
                primera_visita: null
            };
        } catch (error) {
            throw error;
        }
    }

    // NUEVO: Obtener clientes VIP (Gasto superior al promedio)
    // Demostración de SUBCONSULTA y AGREGACIÓN compleja
    static async getVIPClients() {
        try {
            const [rows] = await pool.execute(
                `SELECT 
                    u.id_usuario,
                    CONCAT(u.prim_nombre, ' ', u.apellido1) as nombre_completo,
                    u.email,
                    SUM(s.precio) as total_gastado
                 FROM usuarios u
                 JOIN reservas r ON u.id_usuario = r.id_usuario
                 JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
                 JOIN servicios s ON dcs.id_servicio = s.id_servicio
                 GROUP BY u.id_usuario
                 HAVING total_gastado > (
                     SELECT AVG(total_por_cliente) FROM (
                         SELECT SUM(s2.precio) as total_por_cliente
                         FROM reservas r2
                         JOIN detalle_cita_servicio dcs2 ON r2.id_reservas = dcs2.id_reservas
                         JOIN servicios s2 ON dcs2.id_servicio = s2.id_servicio
                         GROUP BY r2.id_usuario
                     ) as promedios
                 )
                 ORDER BY total_gastado DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Client;
