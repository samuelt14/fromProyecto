const express = require('express');
const cors = require('cors');
const app = express();
const connection = require('./config/db');

app.post('/api/acta', (req, res) => {
  const {
    numeroActa,
    nombreComite,
    ciudadFecha,
    horaInicio,
    horaFin,
    direccion,
    agenda,
    objetivos,
    totalAprendices,
    planMejoramiento,
    novedades,
    conclusiones,
    actividad,
    fechaActividad,
    responsableActividad,
    firmaActividad,
    nombreAsistente,
    dependencia,
    aprueba,
    observacion,
    firmaAsistente,
    anexos
  } = req.body;

  // Primero insertamos en 'Acta'
  const sqlActa = `
    INSERT INTO Acta (numeroActa, nombreComite, ciudadFecha, horaInicio, horaFin, direccion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const actaValues = [numeroActa, nombreComite, ciudadFecha, horaInicio, horaFin, direccion];

  connection.query(sqlActa, actaValues, (err, result) => {
    if (err) {
      console.error("Error al insertar en Acta:", err);
      return res.status(500).json({ mensaje: "Error al registrar el acta base" });
    }

    const idActa = result.insertId;

    // Luego insertamos en ActaCompleta con la referencia
    const sqlCompleta = `
      INSERT INTO ActaCompleta (
        Acta_idActa,
        agenda, objetivos, totalAprendices, planMejoramiento, novedades, conclusiones,
        actividad, fechaActividad, responsableActividad, firmaActividad,
        nombreAsistente, dependencia, aprueba, observacion, firmaAsistente, anexos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const completaValues = [
      idActa,
      agenda, objetivos, totalAprendices, planMejoramiento, novedades, conclusiones,
      actividad, fechaActividad, responsableActividad, firmaActividad,
      nombreAsistente, dependencia, aprueba, observacion, firmaAsistente, anexos
    ];

    connection.query(sqlCompleta, completaValues, (err2, result2) => {
      if (err2) {
        console.error("Error al insertar en ActaCompleta:", err2);
        return res.status(500).json({ mensaje: "Error al registrar el acta completa" });
      }

      res.json({ mensaje: "Acta completa registrada correctamente", id: result2.insertId });
    });
  });
});
