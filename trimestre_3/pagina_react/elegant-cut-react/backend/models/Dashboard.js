const pool = require('../config/database');

class Dashboard {
  // Obtener estadísticas - VERSIÓN CORREGIDA
  static async getStats() {
    try {
      // Total clientes (todos los usuarios activos que no son admin)
      const [clientes] = await pool.execute(
        `SELECT COUNT(*) as total 
         FROM usuarios 
         WHERE estado = 1 AND id_rol != 1`
      );
      
      // Citas de hoy
      const [citasHoy] = await pool.execute(
        'SELECT COUNT(*) as total FROM reservas WHERE DATE(fecha) = CURDATE()'
      );
      
      // Ingresos de hoy (sin filtrar por estado)
      const [ingresosHoy] = await pool.execute(
        `SELECT COALESCE(SUM(s.precio), 0) as total
         FROM reservas r
         JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
         JOIN servicios s ON dcs.id_servicio = s.id_servicio
         WHERE DATE(r.fecha) = CURDATE()`
      );

      return {
        totalClientes: clientes[0].total,
        citasHoy: citasHoy[0].total,
        ingresosHoy: ingresosHoy[0].total,
        ratingPromedio: 4.8
      };
    } catch (error) {
      console.log('Error en Dashboard.getStats:', error);
      // Devolver valores por defecto en caso de error
      return {
        totalClientes: 0,
        citasHoy: 0,
        ingresosHoy: 0,
        ratingPromedio: 4.8
      };
    }
  }

  // Obtener actividad reciente - VERSIÓN SIMPLIFICADA
  static async getRecentActivity() {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            'usuario' as tipo,
            u.created_at as fecha,
            CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
            'Nuevo registro' as servicio,
            TIMESTAMPDIFF(MINUTE, u.created_at, NOW()) as minutos_hace
         FROM usuarios u
         WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
         ORDER BY u.created_at DESC
         LIMIT 5`
      );
      return rows;
    } catch (error) {
      console.log('Error en Dashboard.getRecentActivity:', error);
      return [];
    }
  }

  // Obtener próximas citas - VERSIÓN SIMPLIFICADA
  static async getUpcomingAppointments() {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            r.fecha,
            COALESCE(h.hora_inicio, 540) as hora_inicio, -- 9:00 AM por defecto
            CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
            COALESCE(s.nombre, 'Servicio') as servicio,
            COALESCE(s.precio, 0) as precio
         FROM reservas r
         LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
         LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
         LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
         LEFT JOIN horarios h ON r.id_horaries = h.id_horarios
         WHERE r.fecha >= CURDATE()
         ORDER BY r.fecha ASC, hora_inicio ASC
         LIMIT 5`
      );
      return rows;
    } catch (error) {
      console.log('Error en Dashboard.getUpcomingAppointments:', error);
      return [];
    }
  }
}

module.exports = Dashboard;