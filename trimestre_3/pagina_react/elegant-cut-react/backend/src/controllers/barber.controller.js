const Barber = require('../models/Barber.model');

class BarberController {
    // Obtener todos los barberos (admin - con stats)
    static async getAll(req, res, next) {
        try {
            const barbers = await Barber.getAll();
            res.json({
                success: true,
                data: barbers
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener barberos activos (público)
    static async getActive(req, res, next) {
        try {
            const barbers = await Barber.getActive();
            res.json({
                success: true,
                data: barbers
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener barbero por ID
    static async getById(req, res, next) {
        try {
            const barber = await Barber.getById(req.params.id);
            if (!barber) {
                return res.status(404).json({
                    success: false,
                    message: 'Barbero no encontrado'
                });
            }
            res.json({
                success: true,
                data: barber
            });
        } catch (error) {
            next(error);
        }
    }

    // Crear barbero (admin)
    static async create(req, res, next) {
        try {
            const id = await Barber.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Barbero creado exitosamente',
                id
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar barbero (admin)
    static async update(req, res, next) {
        try {
            const updated = await Barber.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Barbero no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Barbero actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Eliminar/Desactivar barbero (admin)
    static async delete(req, res, next) {
        try {
            const deleted = await Barber.deactivate(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Barbero no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Barbero desactivado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Toggle status (admin)
    static async toggleStatus(req, res, next) {
        try {
            const result = await Barber.toggleStatus(req.params.id);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Barbero no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Estado actualizado exitosamente',
                newStatus: result.newStatus
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener estadísticas de barbero (admin)
    static async getStats(req, res, next) {
        try {
            const stats = await Barber.getStats(req.params.id);
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BarberController;
