// routes/actaRoutes.js
const express = require('express');
const router = express.Router();
const actaController = require("../controllers/acta.controller");

router.post('/subir', actaController.subir);

module.exports = router;
