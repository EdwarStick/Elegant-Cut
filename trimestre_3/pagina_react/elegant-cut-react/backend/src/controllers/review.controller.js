const Review = require('../models/Review.model');

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.getAll();
        res.json(reviews);
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
};

const createReview = async (req, res) => {
    try {
        const { nombre_cliente, email_cliente, calificacion, comentario } = req.body;

        if (!nombre_cliente || !email_cliente || !calificacion || !comentario) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        await Review.create({ nombre_cliente, email_cliente, calificacion, comentario });
        res.status(201).json({ message: 'Reseña creada exitosamente' });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error al crear la reseña' });
    }
};

// ADMIN METHODS
const getAllReviewsAdmin = async (req, res) => {
    try {
        const { status } = req.query; // 'all', 'approved', 'spam'
        let statusFilter = null;

        if (status === 'approved') statusFilter = 1;
        else if (status === 'spam') statusFilter = 0;

        const reviews = await Review.getAllForAdmin(statusFilter);
        res.json(reviews);
    } catch (error) {
        console.error('Error getting reviews for admin:', error);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
};

const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // 0 or 1

        if (estado !== 0 && estado !== 1) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        const updated = await Review.updateStatus(id, estado);

        if (updated) {
            res.json({ message: 'Estado actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Reseña no encontrada' });
        }
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ message: 'Error al actualizar el estado' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Review.delete(id);

        if (deleted) {
            res.json({ message: 'Reseña eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Reseña no encontrada' });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Error al eliminar la reseña' });
    }
};

module.exports = {
    getReviews,
    createReview,
    getAllReviewsAdmin,
    updateReviewStatus,
    deleteReview
};

