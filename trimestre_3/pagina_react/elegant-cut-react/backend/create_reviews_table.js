const pool = require('./src/config/database');

async function createTable() {
    try {
        const connection = await pool.getConnection();
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS resenas (
                id_resena INT AUTO_INCREMENT PRIMARY KEY,
                nombre_cliente VARCHAR(100) NOT NULL,
                email_cliente VARCHAR(100) NOT NULL,
                calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
                comentario TEXT NOT NULL,
                fecha_resena DATETIME DEFAULT CURRENT_TIMESTAMP,
                estado TINYINT DEFAULT 1
            );
        `);
        console.log('Table "resenas" created successfully');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createTable();
