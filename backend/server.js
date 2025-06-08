// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

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

// Rutas
const authRoutes = require("./routes/auth.routes");
const actaRoutes = require("./routes/acta.routes");
app.use("/api/auth", authRoutes);
app.use("/api/acta", actaRoutes);

// UploadThing (IMPORTANTE: aquí van las importaciones y montaje)
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./uploadRouter"); // Asegúrate que el archivo exista

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
