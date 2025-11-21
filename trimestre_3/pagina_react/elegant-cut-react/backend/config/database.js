const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root', // tu usuario de MySQL
  password: '', // tu password de MySQL
  database: 'elegantcut',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Verificar conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a MySQL - ElegantCut');
    connection.release();
  })
  .catch(error => {
    console.log('❌ Error conectando a MySQL:', error.message);
  });

module.exports = pool;