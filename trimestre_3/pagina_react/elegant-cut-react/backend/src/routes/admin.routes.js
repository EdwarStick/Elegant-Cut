const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// All routes require admin
router.get('/administrators', authenticate, requireAdmin, AdminController.getAll);
router.post('/administrators', authenticate, requireAdmin, AdminController.create);
router.put('/administrators/:id', authenticate, requireAdmin, AdminController.update);
router.delete('/administrators/:id', authenticate, requireAdmin, AdminController.delete);

module.exports = router;
