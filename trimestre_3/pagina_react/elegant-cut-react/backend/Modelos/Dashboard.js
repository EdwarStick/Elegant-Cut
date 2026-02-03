const pool = require('../Configuracion/database');

class Dashboard {
  // Obtener estadísticas completas
  static async getStats() {
    try {
      // Citas de hoy por estado
      const [citasHoy] = await pool.execute(
        `SELECT 
          COUNT(*) as totalCitas,
          COUNT(CASE WHEN id_estado_cita = 1 THEN 1 END) as citasPendientes,
          COUNT(CASE WHEN id_estado_cita = 2 THEN 1 END) as citasCompletadas,
          COUNT(CASE WHEN id_estado_cita = 3 THEN 1 END) as citasCanceladas
         FROM reservas 
         WHERE DATE(fecha) = CURDATE()`
      );

      // Ingresos de hoy (solo citas completadas)
      const [ingresosHoy] = await pool.execute(
        `SELECT COALESCE(SUM(s.precio), 0) as total
         FROM reservas r
         JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
         JOIN servicios s ON dcs.id_servicio = s.id_servicio
         WHERE DATE(r.fecha) = CURDATE() AND r.id_estado_cita = 2`
      );

      // Clientes nuevos (registrados hoy)
      const [clientesNuevos] = await pool.execute(
        `SELECT COUNT(*) as total 
         FROM usuarios 
         WHERE DATE(created_at) = CURDATE() AND id_rol = 3`
      );

      return {
        totalCitas: citasHoy[0].totalCitas || 0,
        citasPendientes: citasHoy[0].citasPendientes || 0,
        citasCompletadas: citasHoy[0].citasCompletadas || 0,
        citasCanceladas: citasHoy[0].citasCanceladas || 0,
        ingresosHoy: parseFloat(ingresosHoy[0].total) || 0,
        clientesNuevos: clientesNuevos[0].total || 0
      };
    } catch (error) {
      console.error(' Error en Dashboard.getStats:', error);
      return {
        totalCitas: 0,
        citasPendientes: 0,
        citasCompletadas: 0,
        citasCanceladas: 0,
        ingresosHoy: 0,
        clientesNuevos: 0
      };
    }
  }

  // Obtener actividad reciente
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
      console.error(' Error en Dashboard.getRecentActivity:', error);
      return [];
    }
  }

  // Obtener próximas citas
  static async getUpcomingAppointments() {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            r.fecha,
            COALESCE(h.hora_inicio, 540) as hora_inicio,
            CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
            COALESCE(s.nombre, 'Servicio') as servicio,
            COALESCE(s.precio, 0) as precio
         FROM reservas r
         LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
         LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
         LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
         LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
         WHERE r.fecha >= CURDATE()
         ORDER BY r.fecha ASC, hora_inicio ASC
         LIMIT 5`
      );
      return rows;
    } catch (error) {
      console.error(' Error en Dashboard.getUpcomingAppointments:', error);
      return [];
    }
  }
  // Estadísticas Mensuales
  static async getMonthlyStats() {
    try {
      const [currentMonth] = await pool.execute(
        `SELECT COUNT(*) as total FROM usuarios WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) AND id_rol = 3`
      );
      const [lastMonth] = await pool.execute(
        `SELECT COUNT(*) as total FROM usuarios WHERE MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) AND id_rol = 3`
      );
      const [totalClients] = await pool.execute(
        `SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 3 AND estado = 1`
      );

      return {
        newClientsCurrentMonth: currentMonth[0].total,
        newClientsLastMonth: lastMonth[0].total,
        totalActiveClients: totalClients[0].total
      };
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      return { newClientsCurrentMonth: 0, newClientsLastMonth: 0, totalActiveClients: 0 };
    }
  }
}

module.exports = Dashboard;