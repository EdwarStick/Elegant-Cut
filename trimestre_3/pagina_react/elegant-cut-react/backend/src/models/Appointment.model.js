const pool = require('../config/database');

class Appointment {
    // Obtener todas las citas
    static async getAll() {
        try {
            const [rows] = await pool.execute(
                `SELECT 
                    r.id_reservas,
                    r.fecha,
                    r.observaciones,
                    CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
                    u.telefono,
                    r.id_estado_cita as estado_id,
                    COALESCE(h.hora_inicio, 540) as hora_inicio
                 FROM reservas r
                 LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
                 LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
                 ORDER BY r.fecha DESC`
            );
            return rows;
        } catch (error) {
            console.error('Error en Appointment.getAll:', error);
            throw error;
        }
    }

    // Obtener cita por ID
    static async getById(id) {
        try {
            const [rows] = await pool.execute(
                `SELECT 
                    r.*,
                    CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
                    u.email,
                    u.telefono,
                    h.hora_inicio
                 FROM reservas r
                 LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
                 LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
                 WHERE r.id_reservas = ?`,
                [id]
            );

            if (rows.length === 0) return null;

            // Obtener servicios de la cita
            const [servicios] = await pool.execute(
                `SELECT s.* 
                 FROM detalle_cita_servicio dcs
                 JOIN servicios s ON dcs.id_servicio = s.id_servicio
                 WHERE dcs.id_reservas = ?`,
                [id]
            );

            return {
                ...rows[0],
                servicios
            };
        } catch (error) {
            throw error;
        }
    }

    // Actualizar estado de cita
    static async updateStatus(id, nuevoEstado) {
        try {
            const [result] = await pool.execute(
                'UPDATE reservas SET id_estado_cita = ? WHERE id_reservas = ?',
                [nuevoEstado, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar cita completa
    static async update(id, appointmentData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { fecha, observaciones, id_horarios, id_estado_cita, services } = appointmentData;

            // Actualizar reserva
            await connection.execute(
                'UPDATE reservas SET fecha = ?, observaciones = ?, id_horarios = ?, id_estado_cita = ? WHERE id_reservas = ?',
                [fecha, observaciones, id_horarios, id_estado_cita, id]
            );

            // Si se proporcionan servicios, actualizar
            if (services && services.length > 0) {
                // Eliminar servicios existentes
                await connection.execute(
                    'DELETE FROM detalle_cita_servicio WHERE id_reservas = ?',
                    [id]
                );

                // Insertar nuevos servicios
                for (const serviceId of services) {
                    await connection.execute(
                        'INSERT INTO detalle_cita_servicio (id_reservas, id_servicio) VALUES (?, ?)',
                        [id, serviceId]
                    );
                }
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Crear nueva cita (Transacción compleja)
    static async create(appointmentData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { name, phone, email, date, time, barber, service, notes } = appointmentData;

            // 1. Buscar o crear usuario (cliente)
            let userId;
            const [userExists] = await connection.execute(
                'SELECT id_usuario FROM usuarios WHERE telefono = ? OR email = ?',
                [phone, email || '']
            );

            if (userExists.length > 0) {
                userId = userExists[0].id_usuario;
                // Actualizar datos del cliente si es necesario
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

            await connection.commit();
            return reservaId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Cancelar/Eliminar cita (Soft Delete)
    static async delete(id) {
        try {
            // Cambiar estado a cancelado (id_estado_cita = 3)
            const [result] = await pool.execute(
                'UPDATE reservas SET id_estado_cita = 3 WHERE id_reservas = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Appointment;
