const express = require('express');
const router = express.Router();
const actaController = require('../controllers/acta.controller');

// Ruta POST para subir acta
router.post('/acta', actaController.subir);

module.exports = router;
