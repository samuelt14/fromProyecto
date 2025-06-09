const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const actaRoutes = require('./routes/acta.routes');
const busquedaRoutes = require('./routes/busqueda.routes');
const mysql = require('mysql2');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: true,      // en producción, cámbialo por tu dominio
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api', actaRoutes); 
app.use('/api', busquedaRoutes);


const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./uploadRouter"); 

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_SECRET,
      appId: process.env.UPLOADTHING_APP_ID,
    },
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "client")));

// Fallback SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("UPLOADTHING_SECRET cargado?", !!process.env.UPLOADTHING_SECRET);
  console.log("UPLOADTHING_APP_ID cargado?", !!process.env.UPLOADTHING_APP_ID);
});
