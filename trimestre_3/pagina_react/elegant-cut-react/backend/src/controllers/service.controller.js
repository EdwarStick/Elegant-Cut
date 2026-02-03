const Service = require('../models/Service.model');

class ServiceController {
    // Obtener todos los servicios (público)
    static async getAll(req, res, next) {
        try {
            const services = await Service.getAll();
            res.json({
                success: true,
                data: services
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener servicio por ID (admin)
    static async getById(req, res, next) {
        try {
            const service = await Service.getById(req.params.id);
            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Servicio no encontrado'
                });
            }
            res.json({
                success: true,
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    // Crear servicio (admin)
    static async create(req, res, next) {
        try {
            const id = await Service.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Servicio creado exitosamente',
                id
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar servicio (admin)
    static async update(req, res, next) {
        try {
            const updated = await Service.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Servicio no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Servicio actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Eliminar servicio (admin)
    static async delete(req, res, next) {
        try {
            const deleted = await Service.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Servicio no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Servicio eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ServiceController;
