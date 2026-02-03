const express = require('express');
const router = express.Router();
const BarberPanelController = require('../controllers/barberPanel.controller');
const { requireBarber } = require('../middleware/requireBarber.middleware');

// Todas las rutas requieren autenticación como barbero
router.get('/my-appointments', requireBarber, BarberPanelController.getMyAppointments);
router.put('/appointments/:id/status', requireBarber, BarberPanelController.updateAppointmentStatus);
router.put('/appointments/:id/reschedule', requireBarber, BarberPanelController.rescheduleAppointment);

module.exports = router;
