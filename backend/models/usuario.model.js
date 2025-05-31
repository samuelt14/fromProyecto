const db = require('../config/db');

const Usuario = {
  buscarPorCorreo: (correo, callback) => {
    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], callback);
  },

  crear: (usuario, callback) => {
    db.query(
      'INSERT INTO usuario (nombre, apellido, correo, Password) VALUES (?, ?, ?, ?)',
      [usuario.Nombre, usuario.Apellido, usuario.Correo, usuario.Password],
      callback
    );
  },

  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id], callback);
  },

  actualizarPassword: (id, nuevaPassword, callback) => {
    db.query('UPDATE usuario SET Password = ? WHERE id_usuario = ?', [nuevaPassword, id], callback);
  }
};

module.exports = Usuario;
