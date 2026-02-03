const pool = require('../config/database');

class Dashboard {
    // Obtener estadísticas generales
    static async getStats() {
        try {
            const [stats] = await pool.execute(`
                SELECT 
                    (SELECT COUNT(*) FROM reservas WHERE id_estado_cita = 1) as citas_pendientes,
                    (SELECT COUNT(*) FROM reservas WHERE id_estado_cita = 2) as citas_completadas,
                    (SELECT COUNT(*) FROM usuarios WHERE id_rol = 3 AND estado = 1) as total_clientes,
                    (SELECT COUNT(*) FROM usuarios WHERE id_rol = 2 AND estado = 1) as barberos_activos,
                    (SELECT COALESCE(SUM(s.precio), 0) 
                     FROM reservas r 
                     JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
                     JOIN servicios s ON dcs.id_servicio = s.id_servicio
                     WHERE r.id_estado_cita = 2 
                     AND MONTH(r.fecha) = MONTH(CURRENT_DATE())
                    ) as ingresos_mes
            `);

            return stats[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener datos para gráficos
    static async getChartData(period = 'week') {
        try {
            let dateFilter = '';

            if (period === 'week') {
                dateFilter = 'AND r.fecha >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)';
            } else if (period === 'month') {
                dateFilter = 'AND MONTH(r.fecha) = MONTH(CURRENT_DATE())';
            } else if (period === 'year') {
                dateFilter = 'AND YEAR(r.fecha) = YEAR(CURRENT_DATE())';
            }

            const [rows] = await pool.execute(`
                SELECT 
                    DATE(r.fecha) as fecha,
                    COUNT(*) as cantidad,
                    COUNT(CASE WHEN r.id_estado_cita = 2 THEN 1 END) as completadas,
                    COUNT(CASE WHEN r.id_estado_cita = 3 THEN 1 END) as canceladas,
                    COALESCE(SUM(s.precio), 0) as ingresos
                FROM reservas r
                LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
                LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
                WHERE 1=1 ${dateFilter}
                GROUP BY DATE(r.fecha)
                ORDER BY fecha DESC
            `);

            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener actividad reciente
    static async getRecentActivity() {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    r.id_reservas,
                    r.fecha,
                    r.created_at,
                    CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
                    r.id_estado_cita,
                    'cita' as tipo
                FROM reservas r
                JOIN usuarios u ON r.id_usuario = u.id_usuario
                ORDER BY r.created_at DESC
                LIMIT 10
            `);

            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener próximas citas
    static async getUpcomingAppointments() {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    r.id_reservas,
                    r.fecha,
                    CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
                    u.telefono,
                    h.hora_inicio,
                    GROUP_CONCAT(s.nombre_servicio SEPARATOR ', ') as servicios
                FROM reservas r
                JOIN usuarios u ON r.id_usuario = u.id_usuario
                LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
                LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
                LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
                WHERE r.fecha >= CURRENT_DATE() AND r.id_estado_cita = 1
                GROUP BY r.id_reservas
                ORDER BY r.fecha ASC, h.hora_inicio ASC
                LIMIT 10
            `);

            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Dashboard;
