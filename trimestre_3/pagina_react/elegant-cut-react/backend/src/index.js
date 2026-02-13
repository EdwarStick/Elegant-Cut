require('dotenv').config();
const app = require('./app');
const Pqrs = require('./models/Pqrs.model');

const PORT = process.env.PORT || 3001;

// Inicializar tablas
Pqrs.initTable();

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor Elegant Cut - Backend Consolidado`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log('Rutas disponibles:');
    console.log('  - /auth/login, /auth/register');
    console.log('  - /api/services, /api/barbers, /api/appointments');
    console.log('  - /api/dashboard, /api/clients, /api/admin');
    console.log('='.repeat(50));
});
