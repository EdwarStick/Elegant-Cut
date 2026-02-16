const pool = require('../config/database');

class Review {
    static async getAll() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM resenas WHERE estado = 1 ORDER BY fecha_resena DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Admin: Get all reviews including inactive ones
    static async getAllForAdmin(statusFilter = null) {
        try {
            let query = 'SELECT * FROM resenas';
            let params = [];

            if (statusFilter !== null) {
                query += ' WHERE estado = ?';
                params.push(statusFilter);
            }

            query += ' ORDER BY fecha_resena DESC';

            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Admin: Update review status (0 = spam/hidden, 1 = approved)
    static async updateStatus(id, estado) {
        try {
            const [result] = await pool.execute(
                'UPDATE resenas SET estado = ? WHERE id_resena = ?',
                [estado, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Admin: Delete review (only for confirmed spam)
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM resenas WHERE id_resena = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async create(data) {
        try {
            const { nombre_cliente, email_cliente, calificacion, comentario } = data;
            const [result] = await pool.execute(
                'INSERT INTO resenas (nombre_cliente, email_cliente, calificacion, comentario) VALUES (?, ?, ?, ?)',
                [nombre_cliente, email_cliente, calificacion, comentario]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Review;

