const express = require('express');
const router = express.Router();
const connection = require('../config/db'); 


router.get('/buscar', (req, res) => {
  const { ficha, programa, trimestre, competencia, resultado_aprendizaje } = req.query;

  
  let query = 'SELECT * FROM programas WHERE 1=1';
  const params = [];

  if (ficha) {
    query += ' AND ficha = ?';
    params.push(ficha);
  }
  if (programa) {
    query += ' AND programa LIKE ?';
    params.push(`%${programa}%`);
  }
  if (trimestre) {
    query += ' AND trimestre = ?';
    params.push(trimestre);
  }
  if (competencia) {
    query += ' AND competencia LIKE ?';
    params.push(`%${competencia}%`);
  }
  if (resultado_aprendizaje) {
    query += ' AND resultado_aprendizaje LIKE ?';
    params.push(`%${resultado_aprendizaje}%`);
  }

 
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error en la consulta' });
      return;
    }
    res.json(results);
  });
});

module.exports = router;