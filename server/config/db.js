const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',      // IP local según la imagen
  user: 'sena_user',
  password: 'sena123',
  database: 'ACEF',       // Cambia esto por el nombre real de tu base si es otro
  port: 3306              // Puerto por defecto
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

module.exports = connection;
