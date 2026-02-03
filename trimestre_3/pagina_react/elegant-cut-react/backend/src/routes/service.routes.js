const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/service.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Public routes
router.get('/', ServiceController.getAll);

// Admin routes
router.get('/:id', authenticate, requireAdmin, ServiceController.getById);
router.post('/', authenticate, requireAdmin, ServiceController.create);
router.put('/:id', authenticate, requireAdmin, ServiceController.update);
router.delete('/:id', authenticate, requireAdmin, ServiceController.delete);

module.exports = router;
