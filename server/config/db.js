const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',      
  user: 'sena_user',
  password: 'sena123',
  database: 'ACEF',       
  port: 3306              
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

module.exports = connection;
