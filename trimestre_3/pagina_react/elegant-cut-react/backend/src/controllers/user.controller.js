const User = require('../models/User.model');

class UserController {
    static async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const user = await User.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const user = await User.update(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await User.delete(req.params.id);

            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
