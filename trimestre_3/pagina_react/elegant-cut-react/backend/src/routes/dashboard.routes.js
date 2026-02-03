const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// All routes require admin
router.get('/stats', authenticate, requireAdmin, DashboardController.getStats);
router.get('/chart-data', authenticate, requireAdmin, DashboardController.getChartData);
router.get('/activity', authenticate, requireAdmin, DashboardController.getActivity);
router.get('/appointments', authenticate, requireAdmin, DashboardController.getAppointments);

module.exports = router;
