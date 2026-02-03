const express = require('express');
const router = express.Router();

// Controladores
const DashboardController = require('../controllers/dashboard.controller');
const BarberController = require('../controllers/barber.controller');
const ServiceController = require('../controllers/service.controller');
const ClientController = require('../controllers/client.controller');
const AppointmentController = require('../controllers/appointment.controller');
const AdminController = require('../controllers/admin.controller');

// NOTA IMPORTANTE: Estas rutas existen para compatibilidad con el frontend actual
// que no envía headers de autorización y usa rutas /admin directas.
// IDEALMENTE: El frontend debería actualizarse para usar /api/... y enviar tokens JWT.

// Dashboard
router.get('/dashboard/stats', DashboardController.getStats);
router.get('/dashboard/chart-data', DashboardController.getChartData);

// Barberos
router.get('/barbers', BarberController.getAll);
router.post('/barbers', BarberController.create);
router.put('/barbers/:id', BarberController.update);
router.put('/barbers/:id/toggle', BarberController.toggleStatus); // Usado en BarbersTab
router.get('/barbers/:id/stats', BarberController.getStats);

// Servicios
router.get('/services', ServiceController.getAll);
router.post('/services', ServiceController.create);
router.put('/services/:id', ServiceController.update);
router.delete('/services/:id', ServiceController.delete);

// Clientes
router.get('/clients', ClientController.getAll);
router.post('/clients', ClientController.create);
router.put('/clients/:id', ClientController.update);
router.get('/clients/:id/appointments', ClientController.getAppointments);

// Citas
router.get('/appointments', AppointmentController.getAll);
router.put('/appointments/:id/status', AppointmentController.updateStatus);
router.delete('/appointments/:id', AppointmentController.delete);

// Administradores
router.get('/administrators', AdminController.getAll);
router.get('/administrators/:id', AdminController.getById);
router.post('/administrators', AdminController.create);
router.put('/administrators/:id', AdminController.update);
router.delete('/administrators/:id', AdminController.delete);

module.exports = router;
