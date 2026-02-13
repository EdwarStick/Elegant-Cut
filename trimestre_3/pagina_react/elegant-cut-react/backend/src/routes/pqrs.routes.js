const express = require('express');
const router = express.Router();
const pqrsController = require('../controllers/pqrs.controller');

router.post('/', pqrsController.createPqrs);
router.get('/status/:radicado', pqrsController.getPqrsStatus);
router.get('/history', pqrsController.getPqrsByUser);

module.exports = router;
