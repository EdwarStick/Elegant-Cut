const pool = require('./backend/src/config/database');

async function inspect() {
    try {
        console.log('--- USUARIOS Columns ---');
        // Use SHOW COLUMNS as it's more reliable for schema
        const [userCols] = await pool.execute('SHOW COLUMNS FROM usuarios');
        userCols.forEach(c => console.log('U: ' + c.Field));

        console.log('\n--- SERVICIOS Columns ---');
        const [serviceCols] = await pool.execute('SHOW COLUMNS FROM servicios');
        serviceCols.forEach(c => console.log('S: ' + c.Field));

    } catch (e) {
        console.error('Error inspecting DB:', e);
    } finally {
        process.exit();
    }
}

inspect();
