const pool = require('../Configuracion/database');

class Appointment {
  // Obtener todas las citas - VERSIÓN QUE FUNCIONA SIN DETALLE
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            r.id_reservas,
            r.fecha,
            r.observaciones,
            CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
            u.telefono,
            COALESCE(ec.nombre_estado_cita, 'pendiente') as estado,
            COALESCE(h.hora_inicio, 540) as hora_inicio
         FROM reservas r
         LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
         LEFT JOIN estado_cita ec ON r.id_estado_cita = ec.id_estado_cita
         LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
         ORDER BY r.fecha DESC`
      );

      console.log('Citas encontradas:', rows);
      return rows;

    } catch (error) {
      console.log('Error en Appointment.getAll:', error);
      return [];
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
      console.log('Error en Appointment.updateStatus:', error);
      return false;
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
}

module.exports = Appointment;