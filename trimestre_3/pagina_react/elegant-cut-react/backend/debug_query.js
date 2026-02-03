const pool = require('./Configuracion/database');
const fs = require('fs');

async function testQuery() {
    let output = '';
    const log = (msg) => {
        if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);
        output += msg + '\n';
        console.log(msg);
    };

    try {
        log('--- TESTING APPOINTMENT QUERY ---');

        const query = `SELECT 
            r.id_reservas,
            r.fecha,
            r.observaciones,
            CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
            u.telefono,
            COALESCE(ec.confirmada, 'pendiente') as estado,
            COALESCE(h.hora_inicio, 540) as hora_inicio
         FROM reservas r
         LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
         LEFT JOIN estado_cita ec ON r.id_estado_cita = ec.id_estado_cita
         LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
         ORDER BY r.fecha DESC`;

        log('Executing query...');
        try {
            const [rows] = await pool.execute(query);
            log(`Success! Retrieved ${rows.length} rows.`);
            if (rows.length > 0) log({ firstRow: rows[0] });
        } catch (err) {
            log('QUERY FAILED!');
            log(`Code: ${err.code}`);
            log(`Message: ${err.message}`);
        }

        log('\n--- CHECKING TABLES FOR SERVICE JOIN ---');
        const tables = ['detalle_cita_servicio', 'servicios'];
        for (const t of tables) {
            try {
                const [cols] = await pool.execute(`DESCRIBE ${t}`);
                log(`Table ${t}: ${cols.map(c => c.Field).join(', ')}`);
            } catch (e) {
                log(`Table ${t} check failed: ${e.message}`);
            }
        }

        fs.writeFileSync('debug_log.txt', output);
        console.log('Log written to debug_log.txt');

    } catch (e) {
        console.error('Fatal:', e);
    } finally {
        process.exit();
    }
}

testQuery();
