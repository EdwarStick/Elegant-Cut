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
            u.email,
            u.telefono,
            s.nombre as servicio,
            s.precio,
            ec.confirmada as estado,
            h.hora_inicio,
            h.hora_fin
         FROM reservas r
         JOIN usuarios u ON r.id_usuario = u.id_usuario
         JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
         JOIN servicios s ON dcs.id_servicio = s.id_servicio
         JOIN estado_cita ec ON r.id_estado_cla = ec.id_estado_cla
         JOIN horarios h ON r.id_horaries = h.id_horarios
         ORDER BY r.fecha DESC, h.hora_inicio DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado de cita
  static async updateStatus(id, nuevoEstado) {
    try {
      const [result] = await pool.execute(
        'UPDATE reservas SET id_estado_cla = ? WHERE id_reservas = ?',
        [nuevoEstado, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Appointment;