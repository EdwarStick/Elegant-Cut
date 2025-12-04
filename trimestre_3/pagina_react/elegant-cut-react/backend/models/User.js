const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Buscar usuario por username con su rol (JOIN)
    static async findByUsernameWithRole(username) {
        try {
            const [users] = await pool.execute(
                `SELECT u.*, r.nombre_rol as role 
                 FROM usuarios u 
                 LEFT JOIN rol r ON u.id_rol = r.id_rol 
                 WHERE u.username = ? AND u.estado = 1`,
                [username]
            );
            return users[0];
        } catch (error) {
            throw error;
        }
    }

    // Buscar por email
    static async findByEmail(email) {
        try {
            const [users] = await pool.execute(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            return users[0];
        } catch (error) {
            throw error;
        }
    }

    // Verificar si existe usuario o email
    static async exists(username, email) {
        try {
            const [users] = await pool.execute(
                'SELECT id_usuario FROM usuarios WHERE username = ? OR email = ?',
                [username, email]
            );
            return users.length > 0;
        } catch (error) {
            throw error;
        }
    }

    // Crear nuevo usuario
    static async create(userData) {
        const { username, password, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, roleName } = userData;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Obtener ID del rol
            const [roles] = await connection.execute(
                'SELECT id_rol FROM rol WHERE nombre_rol = ?',
                [roleName]
            );

            if (roles.length === 0) {
                throw new Error('Rol no válido');
            }
            const id_rol = roles[0].id_rol;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar usuario
            const [result] = await connection.execute(
                `INSERT INTO usuarios (username, password_hash, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol, estado) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                [username, hashedPassword, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol]
            );

            await connection.commit();
            return result.insertId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Actualizar contraseña
    static async updatePassword(identifier, newPassword, isEmail = false) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const field = isEmail ? 'email' : 'username';

            const [result] = await pool.execute(
                `UPDATE usuarios SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE ${field} = ?`,
                [hashedPassword, identifier]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtener usuarios por rol
    static async findAllByRole(roleId) {
        try {
            const [users] = await pool.execute(
                `SELECT id_usuario, username, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, estado, created_at 
                 FROM usuarios 
                 WHERE id_rol = ? 
                 ORDER BY created_at DESC`,
                [roleId]
            );
            return users;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
