const express = require('express');
const router = express.Router();
const BarberController = require('../controllers/barber.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Public routes
router.get('/', BarberController.getActive);

// Admin routes
router.get('/all', authenticate, requireAdmin, BarberController.getAll);
router.get('/:id', authenticate, requireAdmin, BarberController.getById);
router.post('/', authenticate, requireAdmin, BarberController.create);
router.put('/:id', authenticate, requireAdmin, BarberController.update);
router.delete('/:id', authenticate, requireAdmin, BarberController.delete);
router.put('/:id/toggle', authenticate, requireAdmin, BarberController.toggleStatus);
router.get('/:id/stats', authenticate, requireAdmin, BarberController.getStats);

module.exports = router;
