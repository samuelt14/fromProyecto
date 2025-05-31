const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const actaRoutes = require('./routes/acta.routes'); // 👈 NUEVO
const mysql = require('mysql2');

// Cargar variables de entorno
require('dotenv').config();

// Conexión a la base de datos
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', actaRoutes); // 👈 NUEVO

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
