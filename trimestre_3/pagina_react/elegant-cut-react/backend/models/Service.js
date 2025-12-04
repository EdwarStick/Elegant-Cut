const pool = require('../config/database');

class Service {
  // Obtener todos los servicios
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM servicios ORDER BY nombre'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear servicio
  static async create(serviceData) {
    try {
      const { nombre, precio, duracion } = serviceData;
      const [result] = await pool.execute(
        'INSERT INTO servicios (nombre, precio, duracion) VALUES (?, ?, ?)',
        [nombre, precio, duracion]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar servicio
  static async update(id, serviceData) {
    try {
      const { nombre, precio, duracion } = serviceData;
      const [result] = await pool.execute(
        'UPDATE servicios SET nombre = ?, precio = ?, duracion = ? WHERE id_servicio = ?',
        [nombre, precio, duracion, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar servicio (soft delete - eliminación lógica)
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE servicios SET estado = 0 WHERE id_servicio = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Service;