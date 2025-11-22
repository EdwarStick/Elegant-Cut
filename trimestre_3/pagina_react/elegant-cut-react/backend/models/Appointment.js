const pool = require('../config/database');

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
            COALESCE(ec.nombre_estado, 'pendiente') as estado,
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
}

module.exports = Appointment;