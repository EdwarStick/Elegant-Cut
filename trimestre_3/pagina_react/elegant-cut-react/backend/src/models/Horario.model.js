const pool = require('../config/database');

class Horario {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM horarios ORDER BY hora_inicio ASC');
            // Formatear las horas para que sean HH:MM
            return rows.map(row => {
                // Convertir 900 -> "09:00", 1400 -> "14:00"
                let start = row.hora_inicio.toString().padStart(4, '0');
                start = `${start.substring(0, 2)}:${start.substring(2)}`;
                return start;
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Horario;
