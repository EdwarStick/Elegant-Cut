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

            // 3. Insertar en reservas (AHORA CON BARBERO)
            const [reservaResult] = await connection.execute(
                `INSERT INTO reservas 
                 (fecha, observaciones, id_usuario, id_estado_cita, id_horarios, id_empleado) 
                 VALUES (?, ?, ?, 1, ?, ?)`,
                [date, notes || '', userId, idHorarios, barber]
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

    // Obtener horarios disponibles para una fecha y barbero específicos
    static async getAvailableSlots(date, barberId) {
        try {
            // 1. Obtener todos los horarios base
            const [allSlots] = await pool.execute(
                'SELECT id_horarios, hora_inicio, hora_fin FROM horarios ORDER BY hora_inicio ASC'
            );

            // 2. Obtener horarios OCUPADOS para ese barbero en esa fecha
            // id_estado_cita: 1=Pendiente, 2=Confirmada (Ignoramos 3=Cancelada, 4=Completada si aplica)
            const [occupied] = await pool.execute(
                `SELECT h.hora_inicio 
                 FROM reservas r
                 JOIN horarios h ON r.id_horarios = h.id_horarios
                 WHERE r.fecha = ? 
                 AND r.id_empleado = ? 
                 AND r.id_estado_cita IN (1, 2)`,
                [date, barberId]
            );

            // Crear Set de horas ocupadas para búsqueda rápida
            // Convertimos la hora numérica (ej: 900) a formato string "09:00" para comparar
            const occupiedTimes = new Set(occupied.map(o => {
                let start = o.hora_inicio.toString().padStart(4, '0');
                return `${start.substring(0, 2)}:${start.substring(2)}`;
            }));

            // 3. Filtrar y formatear
            const available = allSlots.map(slot => {
                let start = slot.hora_inicio.toString().padStart(4, '0');
                const timeString = `${start.substring(0, 2)}:${start.substring(2)}`;

                return {
                    id: slot.id_horarios,
                    time: timeString,
                    isAvailable: !occupiedTimes.has(timeString)
                };
            });

            // Retornar solo los disponibles (o todos con flag, según prefiera el front)
            // Por ahora retornamos solo las horas disponibles como array de strings para compatibilidad
            return available.filter(a => a.isAvailable).map(a => a.time);

        } catch (error) {
            console.error('Error fetching available slots:', error);
            throw error;
        }
    }
}

module.exports = Appointment;
