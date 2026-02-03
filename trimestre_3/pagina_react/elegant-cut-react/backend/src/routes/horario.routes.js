const express = require('express');
const router = express.Router();
const HorarioController = require('../controllers/horario.controller');

router.get('/', HorarioController.getAll);

module.exports = router;
