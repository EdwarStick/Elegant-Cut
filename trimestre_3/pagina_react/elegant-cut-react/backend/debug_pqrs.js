const pool = require('./src/config/database');

async function debugPqrs() {
    try {
        console.log('--- Debugging PQRS Table ---');
        const [rows] = await pool.execute('SELECT id_pqrs, email, telefono, nombre_completo FROM pqrs ORDER BY id_pqrs DESC LIMIT 5');
        console.log('Last 5 PQRS entries:');
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugPqrs();
