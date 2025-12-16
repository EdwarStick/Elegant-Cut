<<<<<<< HEAD:trimestre_3/pagina_react/elegant-cut-react/backend/models/User.js

const pool = require('../config/database');
=======
const pool = require('../Configuracion/database');
>>>>>>> 7037219b3134a283b98268ebcafa67af7e92038f:trimestre_3/pagina_react/elegant-cut-react/backend/Modelos/User.js
const bcrypt = require('bcryptjs');

class User {
    // --- Métodos de Gestión de Barberos (HEAD) ---
    static async getBarbers() {
        try {
            const [rows] = await pool.execute(
                `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, estado 
                 FROM usuarios 
                 WHERE id_rol = 2 AND estado = 1`
            );
            return rows;
        } catch (error) { throw error; }
    }

    static async createBarber(data) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, username, password } = data;
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await pool.execute(
                `INSERT INTO usuarios(prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, username, password_hash, id_rol, estado)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, 2, 1)`,
                [prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, username, hashedPassword]
            );
            return result.insertId;
        } catch (error) { throw error; }
    }

    // --- Métodos de Gestión de Clientes (HEAD) ---
    static async getClients() {
        try {
            const [rows] = await pool.execute(
                `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, created_at, estado 
                 FROM usuarios 
                 WHERE id_rol = 3`
            );
            return rows;
        } catch (error) { throw error; }
    }

    // --- Métodos Generales de Usuario (HEAD/Common) ---
    static async update(id, data) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono } = data;
            const [result] = await pool.execute(
                `UPDATE usuarios 
                 SET prim_nombre = ?, seg_nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, telefono = ?
    WHERE id_usuario = ? `,
                [prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, id]
            );
            return result.affectedRows > 0;
        } catch (error) { throw error; }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 0 WHERE id_usuario = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) { throw error; }
    }

    // --- Métodos de Autenticación y Búsqueda (Incoming) ---
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
        } catch (error) { throw error; }
    }

    static async findByEmail(email) {
        try {
            const [users] = await pool.execute(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            return users[0];
        } catch (error) { throw error; }
    }

    static async exists(username, email) {
        try {
            const [users] = await pool.execute(
                'SELECT id_usuario FROM usuarios WHERE username = ? OR email = ?',
                [username, email]
            );
            return users.length > 0;
        } catch (error) { throw error; }
    }

    static async create(userData) {
        const { username, password, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, roleName } = userData;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

<<<<<<< HEAD
            // Obtener ID del rol (Case insensitive)
=======
>>>>>>> e9d8bbe9531668bc8e446c167d6d6edde4a02368
            const [roles] = await connection.execute(
                'SELECT id_rol FROM rol WHERE LOWER(nombre_rol) = LOWER(?)',
                [roleName]
            );

<<<<<<< HEAD
            if (roles.length === 0) {
                // Fallback: Try searching for 'Admin' if 'administrador' failed
                if (roleName.toLowerCase() === 'administrador') {
                    const [rolesFallback] = await connection.execute(
                        "SELECT id_rol FROM rol WHERE nombre_rol LIKE '%Admin%' OR nombre_rol LIKE '%admin%'"
                    );
                    if (rolesFallback.length > 0) {
                        var id_rol = rolesFallback[0].id_rol;
                    } else {
                        throw new Error('Rol no válido');
                    }
                } else {
                    throw new Error('Rol no válido: ' + roleName);
                }
            } else {
                var id_rol = roles[0].id_rol;
            }
=======
            if (roles.length === 0) throw new Error('Rol no válido');
            const id_rol = roles[0].id_rol;
>>>>>>> e9d8bbe9531668bc8e446c167d6d6edde4a02368

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.execute(
                `INSERT INTO usuarios(username, password_hash, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol, estado)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
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

    static async updatePassword(identifier, newPassword, isEmail = false) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const field = isEmail ? 'email' : 'username';

            const [result] = await pool.execute(
                `UPDATE usuarios SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE ${field} = ?`,
                [hashedPassword, identifier]
            );
            return result.affectedRows > 0;
        } catch (error) { throw error; }
    }

<<<<<<< HEAD:trimestre_3/pagina_react/elegant-cut-react/backend/models/User.js
=======
    // Actualizar usuario
    static async update(id, userData) {
        try {
            const { prim_nombre, seg_nombre, apellido1, apellido2, email, telefono } = userData;
            const [result] = await pool.execute(
                `UPDATE usuarios 
                 SET prim_nombre = ?, seg_nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, telefono = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id_usuario = ?`,
                [prim_nombre, seg_nombre, apellido1, apellido2, email, telefono, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Desactivar usuario (Soft Delete)
    static async deactivate(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET estado = 0, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtener usuarios por rol
>>>>>>> 7037219b3134a283b98268ebcafa67af7e92038f:trimestre_3/pagina_react/elegant-cut-react/backend/Modelos/User.js
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
        } catch (error) { throw error; }
    }
}

module.exports = User;

