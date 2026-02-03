const Appointment = require('../models/Appointment.model');

class AppointmentController {
    // Obtener horarios disponibles
    static async getAvailableSlots(req, res, next) {
        try {
            const { date, barberId } = req.query;
            if (!date || !barberId) {
                return res.status(400).json({
                    success: false,
                    message: 'Fecha y ID de barbero son requeridos'
                });
            }
            const slots = await Appointment.getAvailableSlots(date, barberId);
            res.json(slots);
        } catch (error) {
            next(error);
        }
    }

    // Obtener todas las citas (admin)
    static async getAll(req, res, next) {
        try {
            const appointments = await Appointment.getAll();
            res.json({
                success: true,
                data: appointments
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener cita por ID (admin)
    static async getById(req, res, next) {
        try {
            const appointment = await Appointment.getById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                data: appointment
            });
        } catch (error) {
            next(error);
        }
    }

    // Crear cita (público o admin)
    static async create(req, res, next) {
        try {
            const id = await Appointment.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Cita creada exitosamente',
                id
            });
        } catch (error) {
            console.error('Error creando cita:', error);
            next(error);
        }
    }

    // Actualizar cita completa (admin)
    static async update(req, res, next) {
        try {
            const updated = await Appointment.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Cita actualizada exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar solo estado de cita (admin)
    static async updateStatus(req, res, next) {
        try {
            const { nuevoEstado } = req.body;
            const updated = await Appointment.updateStatus(req.params.id, nuevoEstado);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Estado actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Cancelar/Eliminar cita (admin o cliente)
    static async delete(req, res, next) {
        try {
            const deleted = await Appointment.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Cita cancelada exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AppointmentController;
