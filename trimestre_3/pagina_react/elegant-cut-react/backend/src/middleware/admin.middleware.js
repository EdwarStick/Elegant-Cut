function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'No autenticado'
        });
    }

    // Check if user has admin role
    if (req.user.role === 'administrador' || req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
}

module.exports = { requireAdmin };
