const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const requireBarber = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Verificar que el usuario sea barbero (rol 2)
        if (decoded.id_rol !== 2 && decoded.role !== 'barber') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo barberos pueden acceder a este recurso.'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = { requireBarber };
