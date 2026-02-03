const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/client.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// All routes require admin
router.get('/', authenticate, requireAdmin, ClientController.getAll);
router.get('/:id', authenticate, requireAdmin, ClientController.getById);
router.post('/', authenticate, requireAdmin, ClientController.create);
router.put('/:id', authenticate, requireAdmin, ClientController.update);
router.delete('/:id', authenticate, requireAdmin, ClientController.delete);
router.get('/:id/appointments', authenticate, requireAdmin, ClientController.getAppointments);

module.exports = router;
