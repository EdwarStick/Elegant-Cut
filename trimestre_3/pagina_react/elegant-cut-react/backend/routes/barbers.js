const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los barberos
router.get('/', async (req, res) => {
  try {
    const [barbers] = await db.execute(
      `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2 
       FROM usuarios WHERE id_rol = 2 AND estado = 1`
    );
    res.json(barbers);
  } catch (error) {
    console.error('Error obteniendo barberos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;