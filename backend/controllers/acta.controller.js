const db = require('../config/db');

exports.subir = (req, res) => {
  const {
    numeroActa,
    nombre, 
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
    anexos,
    actividad,
    fechaActividad,
    responsableActividad,
    firmaActividad,
    asistentes,
    ficha_id
  } = req.body;

  if (!ficha_id) {
    return res.status(400).json({ mensaje: 'El campo ficha_id es requerido' });
  }

  const sql = `
    INSERT INTO acta (
      numero_acta, nombre_comite, ciudad_fecha, fecha, hora_inicio, hora_fin,
      direccion, agenda, objetivos, total_aprendices,
      plan_mejoramiento, novedades, conclusiones, anexos,
      actividad, fecha_actividad, responsable_actividad, firma_actividad,
      nombre_asistente, dependencia, aprueba, observacion, firma_asistente,
      ficha_id
    ) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    numeroActa,
    nombre, // nombre se guarda en columna nombre_comite
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
    anexos,
    actividad,
    fechaActividad,
    responsableActividad,
    firmaActividad,
    asistentes?.nombre || '',
    asistentes?.dependencia || '',
    asistentes?.aprueba || '',
    asistentes?.observacion || '',
    asistentes?.firma || '',
    ficha_id
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar el acta:', err);
      return res.status(500).json({ mensaje: 'Error al registrar el acta' });
    }

    console.log('✅ Acta insertada con ID:', result.insertId);
    res.status(201).json({ mensaje: 'Acta registrada correctamente', acta_id: result.insertId });
  });
};
