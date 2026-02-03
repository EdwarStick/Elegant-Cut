const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

const isAdmin = checkRole('ADMIN_DUEÑO');
const isBarbero = checkRole('BARBERO');
const isAdminOrBarbero = checkRole('ADMIN_DUEÑO', 'BARBERO');

module.exports = {
    checkRole,
    isAdmin,
    isBarbero,
    isAdminOrBarbero
};
