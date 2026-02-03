const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Public route for creating appointments
router.post('/', AppointmentController.create);

// Admin routes
router.get('/', authenticate, requireAdmin, AppointmentController.getAll);
router.get('/:id', authenticate, requireAdmin, AppointmentController.getById);
router.put('/:id', authenticate, requireAdmin, AppointmentController.update);
router.put('/:id/status', authenticate, requireAdmin, AppointmentController.updateStatus);
router.delete('/:id', authenticate, requireAdmin, AppointmentController.delete);

module.exports = router;
