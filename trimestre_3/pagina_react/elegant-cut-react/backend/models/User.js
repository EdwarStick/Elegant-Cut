const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Obtener todos los barberos
    static async getBarbers() {
        try {
            const [rows] = await pool.execute(
                `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, estado 
         FROM usuarios 
         WHERE id_rol = 2 AND estado = 1`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener todos los clientes
    static async getClients() {
        try {
            const [rows] = await pool.execute(
                `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, created_at, estado 
         FROM usuarios 
         WHERE id_rol = 3`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Crear barbero
    static async createBarber(data) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, username, password } = data;
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await pool.execute(
                `INSERT INTO usuarios (prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, username, password_hash, id_rol, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2, 1)`,
                [prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, username, hashedPassword]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar usuario (barbero o cliente)
    static async update(id, data) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono } = data;
            const [result] = await pool.execute(
                `UPDATE usuarios 
         SET prim_nombre = ?, seg_nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, telefono = ? 
         WHERE id_usuario = ?`,
                [prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar usuario (Soft delete)
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 0 WHERE id_usuario = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
