const pool = require('../Configuracion/database');

class Service {
  // Obtener todos los servicios (activos)
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM servicios ORDER BY nombre_servicio'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear servicio
  static async create(serviceData) {
    try {
      // Removed imagen_pro as well if it's not in DB, but plan only mentioned estado.
      // Wait, inspection showed 'imagen_pro' IS in schema (maybe? truncated output showed 'imagen...').
      // Let's safe-check inspection output again.  Ah, user said "servicios table is missing the estado column".
      // Previous output showed: [ 'id_servicio', 'nombre_servicio', 'precio', 'duracion_minutos', 'descripcion', 'imagen_pro' ] (partially from truncated output analysis).
      // Wait, Step 96 output was truncated. Step 111 output was truncated. Step 116 output was reliable line-by-line.
      // Step 116:
      // S: id_servicio
      // S: nombre_servicio
      // S: precio
      // S: duracion_minutos
      // S: descripcion
      // S: imagen_pro
      // NO 'estado'.
      // So I will remove 'estado' from INSERT and UPDATE.

      const { nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro } = serviceData;
      const [result] = await pool.execute(
        'INSERT INTO servicios (nombre_servicio, precio, duracion_minutos, descripcion, imagen_pro) VALUES (?, ?, ?, ?, ?)',
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

  // Eliminar servicio (Hard Delete)
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM servicios WHERE id_servicio = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Service;