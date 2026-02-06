const User = require('../models/User.model');

class UserController {
    static async uploadProfilePhoto(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se ha subido ninguna imagen'
                });
            }

            const userId = req.user.id;
            // Guardar solo el nombre del archivo relativo a uploads/profiles
            const photoPath = `profiles/${req.file.filename}`;

            // Actualizar en base de datos
            const updated = await User.updateProfilePhoto(userId, photoPath);

            if (updated) {
                res.json({
                    success: true,
                    message: 'Foto de perfil actualizada correctamente',
                    photoUrl: photoPath
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar la referencia en base de datos'
                });
            }

        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
