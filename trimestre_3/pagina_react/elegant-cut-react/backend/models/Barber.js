const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Barber {
    // Obtener todos los barberos con estadísticas
    static async getAll() {
        try {
            const [rows] = await pool.execute(
                `SELECT 
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
          COUNT(CASE WHEN r.id_estado_cita = 2 THEN 1 END) as citas_completadas,
          COALESCE(SUM(s.precio), 0) as ingresos_generados
        FROM usuarios u
        LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
        LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
        LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
        WHERE u.id_rol = 2
        GROUP BY u.id_usuario
        ORDER BY u.created_at DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener barbero por ID
    static async getById(id) {
        try {
            const [barbers] = await pool.execute(
                `SELECT 
          u.*,
          r.nombre_rol as rol
        FROM usuarios u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ? AND u.id_rol = 2`,
                [id]
            );

            return barbers.length > 0 ? barbers[0] : null;
        } catch (error) {
            throw error;
        }
    }

    // Crear nuevo barbero (con usuario)
    static async create(barberData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { username, password, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono } = barberData;

            // Verificar si el username ya existe
            const [existing] = await connection.execute(
                'SELECT id_usuario FROM usuarios WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existing.length > 0) {
                throw new Error('El username o email ya existe');
            }

            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario barbero (id_rol = 2)
            const [result] = await connection.execute(
                `INSERT INTO usuarios 
         (username, password_hash, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol, estado, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2, 1, NOW())`,
                [username, hashedPassword, email, prim_nombre, seg_nombre || null, apellido1, apellido2 || null, telefono]
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

    // Actualizar barbero
    static async update(id, barberData) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono } = barberData;

            const [result] = await pool.execute(
                `UPDATE usuarios 
         SET prim_nombre = ?, seg_nombre = ?, apellido1 = ?, apellido2 = ?,
             email = ?, telefono = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id_usuario = ? AND id_rol = 2`,
                [prim_nombre, seg_nombre || null, apellido1, apellido2 || null, email, telefono, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Desactivar barbero (soft delete)
    static async deactivate(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 0, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_rol = 2',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Activar barbero
    static async activate(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 1, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_rol = 2',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas detalladas del barbero
    static async getStats(id) {
        try {
            const [stats] = await pool.execute(
                `SELECT 
          COUNT(r.id_reservas) as total_citas,
          COUNT(CASE WHEN r.id_estado_cita = 1 THEN 1 END) as citas_pendientes,
          COUNT(CASE WHEN r.id_estado_cita = 2 THEN 1 END) as citas_completadas,
          COUNT(CASE WHEN r.id_estado_cita = 3 THEN 1 END) as citas_canceladas,
          COALESCE(SUM(CASE WHEN r.id_estado_cita = 2 THEN s.precio ELSE 0 END), 0) as ingresos_totales,
          COALESCE(AVG(s.precio), 0) as ingreso_promedio
        FROM reservas r
        LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
        LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
        WHERE r.id_usuario = ?`,
                [id]
            );

            // Servicios más solicitados
            const [topServices] = await pool.execute(
                `SELECT 
          s.nombre,
          COUNT(*) as veces_solicitado
        FROM reservas r
        JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
        JOIN servicios s ON dcs.id_servicio = s.id_servicio
        WHERE r.id_usuario = ?
        GROUP BY s.id_servicio
        ORDER BY veces_solicitado DESC
        LIMIT 5`,
                [id]
            );

            return {
                ...stats[0],
                servicios_populares: topServices
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Barber;
