const pool = require('./Configuracion/database');
const fs = require('fs');

async function debugSchema() {
    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    try {
        log('--- DB SCHEMA DEBUG ---');

        const tables = ['reservas', 'estado_cita', 'usuarios', 'horarios'];

        for (const table of tables) {
            log(`\nTABLE: ${table}`);
            try {
                const [columns] = await pool.execute(`DESCRIBE ${table}`);
                // Print only Field names to keep it clean
                log(columns.map(c => c.Field).join(', '));
            } catch (e) {
                log(`Error describing ${table}: ${e.message}`);
            }
        }

        log('\n--- DATA CHECK ---');
        try {
            const [count] = await pool.execute('SELECT COUNT(*) as total FROM reservas');
            log(`Total rows in 'reservas': ${count[0].total}`);
        } catch (e) {
            log(`Error counting reservas: ${e.message}`);
        }

        fs.writeFileSync('schema_dump.txt', output);
        console.log('Schema dumped to schema_dump.txt');

    } catch (error) {
        console.error('FATAL:', error);
    } finally {
        process.exit();
    }
}

debugSchema();
