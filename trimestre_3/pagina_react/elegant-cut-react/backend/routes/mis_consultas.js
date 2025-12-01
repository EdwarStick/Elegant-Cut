const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Tu conexión a MySQL

// Ruta: http://localhost:3000/api/mis-consultas/ejemplo
router.get('/ejemplo', async (req, res) => {
    try {
        // AQUÍ VA TU CONSULTA SQL
        const [resultados] = await db.execute('SELECT * FROM servicios');
        res.json(resultados); // Envías los datos al frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;