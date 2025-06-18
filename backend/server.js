const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Cargar variables de entorno
dotenv.config();

const app = express();

// ── Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true, // Cambia por tu dominio real en producción
    credentials: true,
  })
);

// ── Asegurar que el directorio de firmas exista
const firmaDir = path.join(__dirname, "uploads/firmas");
if (!fs.existsSync(firmaDir)) {
  fs.mkdirSync(firmaDir, { recursive: true });
}

// ── Importar rutas
const authRoutes       = require("./routes/auth.routes");
const actaRoutes       = require("./routes/acta.routes");
const busquedaRoutes   = require("./routes/busqueda.routes");
const evaluacionRoutes = require("./routes/evaluacion.routes");
const firmaRoutes      = require("./routes/firma.routes");
const usuarioRoutes    = require("./routes/usuario.routes"); // ✅ nueva para firma por sesión

// ── Montar rutas de API
app.use("/api/auth",   authRoutes);
app.use("/api/acta",   actaRoutes);
app.use("/api",        busquedaRoutes);
app.use("/api",        evaluacionRoutes);
app.use("/api/firma",  firmaRoutes);
app.use("/api/usuario", usuarioRoutes); // ✅ nueva

// ── Ruta para formulario de reseteo
app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// ── Servir archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "..", "client")));

// ── Servir archivos subidos (firmas, PDFs, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Página de inicio por defecto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "ActasSena.html"));
});

// ── Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
