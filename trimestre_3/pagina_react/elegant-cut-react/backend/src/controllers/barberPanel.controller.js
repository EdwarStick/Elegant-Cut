const Appointment = require('../models/Appointment.model');

class BarberPanelController {
    // Obtener citas asignadas al barbero autenticado
    static async getMyAppointments(req, res, next) {
        try {
            const barberId = req.user.userId; // Del JWT

            const [appointments] = await require('../config/database').execute(
                `SELECT 
                    r.id_reservas,
                    r.fecha,
                    r.observaciones,
                    r.id_estado_cita,
                    CONCAT(u.prim_nombre, ' ', COALESCE(u.apellido1, '')) as cliente_nombre,
                    u.telefono as cliente_telefono,
                    u.email as cliente_email,
                    h.hora_inicio,
                    GROUP_CONCAT(s.nombre SEPARATOR ', ') as servicios
                FROM reservas r
                LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
                LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
                LEFT JOIN detalle_cita_servicio dcs ON r.id_reservas = dcs.id_reservas
                LEFT JOIN servicios s ON dcs.id_servicio = s.id_servicio
                WHERE r.id_empleado = ?
                GROUP BY r.id_reservas
                ORDER BY r.fecha DESC, h.hora_inicio ASC`,
                [barberId]
            );

            // Formatear hora_inicio (de 900 a "09:00")
            const formattedAppointments = appointments.map(apt => ({
                ...apt,
                hora_inicio_formatted: apt.hora_inicio
                    ? String(apt.hora_inicio).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')
                    : 'N/A'
            }));

            res.json({
                success: true,
                data: formattedAppointments
            });
        } catch (error) {
            console.error('Error fetching barber appointments:', error);
            next(error);
        }
    }

    // Actualizar estado de una cita
    static async updateAppointmentStatus(req, res, next) {
        try {
            const barberId = req.user.userId;
            const appointmentId = req.params.id;
            const { newStatus } = req.body;

            // Validar que la cita pertenezca al barbero
            const [appointment] = await require('../config/database').execute(
                'SELECT id_empleado FROM reservas WHERE id_reservas = ?',
                [appointmentId]
            );

            if (appointment.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }

            if (appointment[0].id_empleado !== barberId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta cita'
                });
            }

            // Actualizar estado
            await require('../config/database').execute(
                'UPDATE reservas SET id_estado_cita = ? WHERE id_reservas = ?',
                [newStatus, appointmentId]
            );

            res.json({
                success: true,
                message: 'Estado actualizado correctamente'
            });
        } catch (error) {
            console.error('Error updating appointment status:', error);
            next(error);
        }
    }

    // Reprogramar cita
    static async rescheduleAppointment(req, res, next) {
        try {
            const barberId = req.user.userId;
            const appointmentId = req.params.id;
            const { newDate, newTime } = req.body;

            // Validar que la cita pertenezca al barbero
            const [appointment] = await require('../config/database').execute(
                'SELECT id_empleado FROM reservas WHERE id_reservas = ?',
                [appointmentId]
            );

            if (appointment.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }

            if (appointment[0].id_empleado !== barberId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta cita'
                });
            }

            // Buscar id_horarios del nuevo horario
            const horaNumerica = parseInt(newTime.replace(':', ''));
            const [horarioResult] = await require('../config/database').execute(
                'SELECT id_horarios FROM horarios WHERE hora_inicio = ?',
                [horaNumerica]
            );

            if (horarioResult.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Horario no válido'
                });
            }

            // Actualizar fecha y horario
            await require('../config/database').execute(
                'UPDATE reservas SET fecha = ?, id_horarios = ? WHERE id_reservas = ?',
                [newDate, horarioResult[0].id_horarios, appointmentId]
            );

            res.json({
                success: true,
                message: 'Cita reprogramada correctamente'
            });
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            next(error);
        }
    }
}

module.exports = BarberPanelController;
