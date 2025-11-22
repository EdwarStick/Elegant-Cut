const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const [services] = await db.execute(
      'SELECT id_servicio, nombre, precio, duracion FROM servicios WHERE estado = 1'
    );
    res.json(services);
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;