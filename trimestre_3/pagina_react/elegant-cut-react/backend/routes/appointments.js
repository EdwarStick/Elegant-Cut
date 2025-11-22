const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Agendar nueva cita
router.post('/appointments', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { name, phone, email, date, time, barber, service, notes } = req.body;

    // 1. Buscar o crear usuario (cliente)
    let userId;
    const [userExists] = await connection.execute(
      'SELECT id_usuario FROM usuarios WHERE telefono = ? OR email = ?',
      [phone, email || '']
    );

    if (userExists.length > 0) {
      userId = userExists[0].id_usuario;
      
      // Actualizar datos del usuario si es necesario
      await connection.execute(
        'UPDATE usuarios SET prim_nombre = ?, email = ? WHERE id_usuario = ?',
        [name, email || '', userId]
      );
    } else {
      // CORREGIDO: Nuevos usuarios son clientes (id_rol = 3)
      const [userResult] = await connection.execute(
        `INSERT INTO usuarios 
         (prim_nombre, telefono, email, id_rol, estado, created_at) 
         VALUES (?, ?, ?, 3, 1, NOW())`,  // ← CAMBIADO: 1 → 3
        [name, phone, email || null]
      );
      userId = userResult.insertId;
    }

    // 2. Buscar id_horarios (convertir "08:00" a 800)
    const horaNumerica = parseInt(time.replace(':', ''));
    const [horarioResult] = await connection.execute(
      'SELECT id_horarios FROM horarios WHERE hora_inicio = ?',
      [horaNumerica]
    );

    if (horarioResult.length === 0) {
      throw new Error('Horario no disponible');
    }
    const idHorarios = horarioResult[0].id_horarios;

    // 3. Insertar en reservas (id_estado_clin = 1 para pendiente)
    const [reservaResult] = await connection.execute(
      `INSERT INTO reserves 
       (fecha, observaciones, id_usuario, id_estado_clin, id_horarios) 
       VALUES (?, ?, ?, 1, ?)`,
      [date, notes || '', userId, idHorarios]
    );

    const reservaId = reservaResult.insertId;

    // 4. Insertar en detalle_cita_servicio
    await connection.execute(
      'INSERT INTO detalle_cita_servicio (id_reservas, id_servicio) VALUES (?, ?)',
      [reservaId, service]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Cita agendada exitosamente',
      appointmentId: reservaId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al agendar cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agendar la cita: ' + error.message
    });
  } finally {
    connection.release();
  }
});

// Obtener servicios disponibles
router.get('/services', async (req, res) => {
  try {
    const [services] = await db.execute(
      'SELECT id_servicio, nombre, precio, duracion FROM servicios WHERE estado = 1'
    );
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener barberos (usuarios con rol de barbero) - CORREGIDO: id_rol = 2
router.get('/barbers', async (req, res) => {
  try {
    const [barbers] = await db.execute(
      `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2 
       FROM usuarios WHERE id_rol = 2 AND estado = 1`  // Barberos = rol 2
    );
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;