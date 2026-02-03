const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate, requireAdmin);

// Obtener todos los usuarios
router.get('/', async (req, res, next) => {
    try {
        const roleId = req.query.role; // Filtrar por rol si se proporciona
        let users;

        if (roleId) {
            users = await User.findAllByRole(parseInt(roleId));
        } else {
            // Si no se especifica rol, obtener todos los usuarios activos
            const [rows] = await require('../config/database').execute(
                'SELECT id_usuario, username, email, prim_nombre, apellido1, created_at FROM usuarios WHERE estado = 1'
            );
            users = rows;
        }

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
});

// Obtener usuario por ID
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
});

// Actualizar usuario
router.put('/:id', async (req, res, next) => {
    try {
        const updated = await User.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        next(error);
    }
});

// Desactivar usuario
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await User.deactivate(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Usuario desactivado exitosamente'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
