const Horario = require('../models/Horario.model');

class HorarioController {
    static async getAll(req, res, next) {
        try {
            const horarios = await Horario.getAll();
            res.json(horarios);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = HorarioController;
