const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
require('dotenv').config();

// Registro
const registrar = async (req, res) => {
  const { Nombre, Apellido, Correo, Contraseña } = req.body;

  if (!Nombre || !Apellido || !Correo || !Contraseña) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  Usuario.buscarPorCorreo(Correo, async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el correo' });

    if (resultados.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    try {
      const hashedPassword = await bcrypt.hash(Contraseña, 10);

      Usuario.crear({ Nombre, Apellido, Correo, Password: hashedPassword }, (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al registrar usuario' });
        res.status(201).json({ mensaje: 'Registro exitoso' });
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al encriptar la contraseña' });
    }
  });
};

// Login
const login = (req, res) => {
  const { Correo, Contraseña } = req.body;

  if (!Correo || !Contraseña) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  Usuario.buscarPorCorreo(Correo, async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el usuario' });

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const usuario = resultados[0];
    const passwordValida = await bcrypt.compare(Contraseña, usuario.Password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({
      id: usuario.id_usuario,
      nombre: usuario.nombre
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      }
    });
  });
};

const cambiarContrasena = (req, res) => {
  const { actualPassword, nuevaPassword } = req.body;
  const usuarioId = req.usuario.id; // viene del token verificado

  if (!actualPassword || !nuevaPassword) {
    return res.status(400).json({ mensaje: 'Debes proporcionar ambas contraseñas' });
  }

  Usuario.buscarPorId(usuarioId, async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el usuario' });

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = resultados[0];
    const passwordValida = await bcrypt.compare(actualPassword, usuario.Password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    try {
      const nuevaPasswordHasheada = await bcrypt.hash(nuevaPassword, 10);
      Usuario.actualizarPassword(usuarioId, nuevaPasswordHasheada, (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al actualizar contraseña' });
        res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al encriptar la nueva contraseña' });
    }
  });
};


module.exports = {
  registrar,
  login,
  cambiarContrasena
};