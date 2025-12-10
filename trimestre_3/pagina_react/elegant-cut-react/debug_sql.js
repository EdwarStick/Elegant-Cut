const pool = require('./backend/Configuracion/database');

async function testQuery() {
    try {
        const query = 'SELECT * FROM servicios WHERE estado = 1 ORDER BY nombre_servicio';
        console.log('Testing Service.getAll query...');
        await pool.execute(query);
        console.log('Query success!');
    } catch (e) {
        console.error('Query FAILED:', e.message);
    } finally {
        process.exit();
    }
}

testQuery();
