const Client = require('../models/Client.model');

class ClientController {
    // Obtener todos los clientes (admin)
    static async getAll(req, res, next) {
        try {
            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const clients = await Client.getAll(search, page);
            res.json({
                success: true,
                data: clients
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener cliente por ID (admin)
    static async getById(req, res, next) {
        try {
            const client = await Client.getById(req.params.id);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    // Crear cliente (admin)
    static async create(req, res, next) {
        try {
            const id = await Client.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Cliente creado exitosamente',
                id
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar cliente (admin)
    static async update(req, res, next) {
        try {
            const updated = await Client.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Cliente actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Desactivar cliente (admin)
    static async delete(req, res, next) {
        try {
            const deleted = await Client.deactivate(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Cliente desactivado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener historial de citas del cliente (admin)
    static async getAppointments(req, res, next) {
        try {
            const appointments = await Client.getAppointmentHistory(req.params.id);
            res.json({
                success: true,
                data: appointments
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ClientController;
