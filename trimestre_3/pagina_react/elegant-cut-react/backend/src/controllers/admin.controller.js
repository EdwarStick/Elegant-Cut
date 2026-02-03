const User = require('../models/User.model');

class AdminController {
    // Obtener todos los administradores
    static async getAll(req, res, next) {
        try {
            // Rol 1 = Administrador
            const admins = await User.findAllByRole(1);
            res.json({
                success: true,
                data: admins
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener administrador por ID
    static async getById(req, res, next) {
        try {
            const admin = await User.findById(req.params.id);
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Administrador no encontrado' });
            }
            res.json({ success: true, data: admin });
        } catch (error) {
            next(error);
        }
    }

    // Crear administrador
    static async create(req, res, next) {
        try {
            const userData = req.body;
            // Asegurar que se crea como admin
            const id = await User.create({ ...userData, roleName: 'administrador' });
            res.status(201).json({
                success: true,
                message: 'Administrador creado exitosamente',
                id
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar administrador
    static async update(req, res, next) {
        try {
            // Si viene password, actualizarla primero
            if (req.body.password) {
                await User.updatePasswordById(req.params.id, req.body.password);
            }

            const updated = await User.update(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Administrador actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Eliminar administrador
    static async delete(req, res, next) {
        try {
            const deleted = await User.deactivate(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Administrador no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Administrador eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;
