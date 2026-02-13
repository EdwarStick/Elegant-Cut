const Pqrs = require('../models/Pqrs.model');
const emailService = require('../services/email.service');

exports.createPqrs = async (req, res) => {
    try {
        const data = req.body;
        console.log('Recibida nueva PQRS:', data.subject);

        const insertId = await Pqrs.create(data);
        const radicado = `PQRS-${new Date().getFullYear()}-${String(insertId).padStart(6, '0')}`;

        // Enviar correo de confirmación
        await emailService.sendPqrsConfirmation(data.userEmail, data.userName, radicado, data.requestType);

        res.status(201).json({
            success: true,
            message: 'PQRS radicada exitosamente',
            radicado: radicado
        });

    } catch (error) {
        console.error('Error creando PQRS:', error);
        res.status(500).json({
            success: false,
            error: 'Error al guardar la PQRS: ' + error.message
        });
    }
};

exports.getPqrsStatus = async (req, res) => {
    try {
        const radicado = req.params.radicado;
        const idParts = radicado.split('-');
        const id = parseInt(idParts[idParts.length - 1]);

        if (isNaN(id)) {
            return res.status(400).json({ success: false, error: 'Formato de radicado inválido' });
        }

        const pqrs = await Pqrs.getById(id);

        if (pqrs) {
            res.status(200).json({ success: true, data: pqrs });
        } else {
            res.status(404).json({ success: false, error: 'PQRS no encontrada' });
        }
    } catch (error) {
        console.error('Error consultando PQRS:', error);
        res.status(500).json({ success: false, error: 'Error consultando estado' });
    }
};

exports.getPqrsByUser = async (req, res) => {
    try {
        const { email, telefono } = req.query;

        if (!email && !telefono) {
            return res.status(400).json({ success: false, error: 'Se requiere email o teléfono para buscar' });
        }

        // Limpiar parámetros para evitar problemas con espacios
        const cleanEmail = email ? email.trim() : null;
        const cleanPhone = telefono ? telefono.trim() : null;

        console.log(`[CONTROLLER] getPqrsByUser - Raw: ${email}/${telefono} - Clean: ${cleanEmail}/${cleanPhone}`);

        const history = await Pqrs.getByUserId(cleanEmail, cleanPhone);
        res.status(200).json({ success: true, data: history });

    } catch (error) {
        console.error('Error consultando historial PQRS:', error);
        res.status(500).json({ success: false, error: 'Error consultando historial' });
    }
};
