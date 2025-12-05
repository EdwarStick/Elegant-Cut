const pool = require('../Configuracion/database');

class Service {
  // Obtener todos los servicios (activos)
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM servicios WHERE estado = 1 ORDER BY nombre_servicio'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear servicio
  static async create(serviceData) {
    try {
      const { nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro } = serviceData;
      const [result] = await pool.execute(
        'INSERT INTO servicios (nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro, estado) VALUES (?, ?, ?, ?, ?, 1)',
        [nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro || null]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar servicio
  static async update(id, serviceData) {
    try {
      const { nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro } = serviceData;
      const [result] = await pool.execute(
        'UPDATE servicios SET nombre_servicio = ?, precio = ?, duracion_minutos = ?, descripcion = ?, imagen_pro = ? WHERE id_servicio = ?',
        [nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro || null, id]
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