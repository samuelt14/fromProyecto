function crearFilaAprendices(tbody, index) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${index}</td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"></td>
  `;
  tbody.appendChild(row);
}

function crearFilaEvaluacion(tbody) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"/></td>
    <td contenteditable="true"></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"/></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"/></td>
    <td><input type="text" oninput="verificarUltimaFila(this, '${tbody.id}')"/></td>
  `;
  tbody.appendChild(row);
}

function verificarUltimaFila(input, tablaId) {
  const tbody = document.getElementById(tablaId);
  const filas = tbody.querySelectorAll('tr');
  const ultimaFila = filas[filas.length - 1];

  const inputs = ultimaFila.querySelectorAll('input');
  const tieneDatos = Array.from(inputs).some(inp => inp.value.trim() !== '');

  if (ultimaFila.contains(input) && tieneDatos) {
    if (tablaId === 'evaluacion') {
      crearFilaEvaluacion(tbody);
    } else {
      crearFilaAprendices(tbody, filas.length + 1);
    }
  }
}

function obtenerTrimestreYAnio() {
  const fechaActual = new Date();
  const mes = fechaActual.getMonth(); // Enero = 0, Diciembre = 11
  const anio = fechaActual.getFullYear();

  const trimestres = ["I", "II", "III", "IV"];
  const trimestre = trimestres[Math.floor(mes / 3)];

  return { trimestre, anio };
}

function actualizarTextoEvaluacion() {
  const { trimestre, anio } = obtenerTrimestreYAnio();
  const texto = `Los Instructores encargados de evaluar los resultados de aprendizaje durante el ${trimestre} Trimestre de ${anio}, son:`;
  
  const span = document.getElementById("textoEvaluacion");
  if (span) {
    span.textContent = texto;
  }
}

actualizarTextoEvaluacion();

// Inicializar con una sola fila
crearFilaAprendices(document.getElementById('aprendices'), 1);
crearFilaAprendices(document.getElementById('aprendices2'), 1);
crearFilaEvaluacion(document.getElementById('evaluacion'));


async function descargarActa() {
  // Obtén el elemento y el nombre de archivo
  const element = document.getElementById('acta');
  const nombre = (document.getElementById('nombre')?.value.trim() || 'acta_sena') + '.pdf';

  // Primer paso: renderiza el contenido a un canvas de alta resolución
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true
  });

  // Dimensiones del canvas en píxeles
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Configuración PDF A4 en mm
  const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();   // 210
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

  // Calcula proporción px → mm
  const scale = pdfWidth / canvasWidth;
  // Altura en px que cabe exactamente en una página A4
  const pageHeightPx = Math.floor(pdfHeight / scale);

  let positionPx = 0;
  let pageIndex = 0;

  // Mientras queden píxeles por renderizar:
  while (positionPx < canvasHeight) {
    // Tamaño del “trozo” de canvas para esta página
    const sliceHeight = Math.min(pageHeightPx, canvasHeight - positionPx);

    // Crea un canvas temporal con ese fragmento
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = sliceHeight;
    const ctx = pageCanvas.getContext('2d');

    // Copia del canvas original sólo el área vertical [positionPx, positionPx+sliceHeight]
    ctx.drawImage(
      canvas,
      0, positionPx,              // origen (x, y)
      canvasWidth, sliceHeight,   // tamaño a copiar
      0, 0,                       // destino en el pageCanvas
      canvasWidth, sliceHeight    // dimensión en el pageCanvas
    );

    // Convierte el fragmento a imagen JPEG
    const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

    // En la primera página no añadimos nueva, en las demás sí
    if (pageIndex > 0) pdf.addPage();

    // Añade la imagen escalada a la página
    pdf.addImage(
      imgData,
      'JPEG',
      0, 0,
      pdfWidth,
      sliceHeight * scale      // altura en mm
    );

    // Avanza
    positionPx += sliceHeight;
    pageIndex++;
  }

  // Descarga el PDF
  pdf.save(nombre);
}


function subirActa() {
  const acta = {
    numeroActa: document.getElementById("numeroActa").value,
    nombre: document.getElementById("nombre").value,
    ciudadFecha: document.getElementById("ciudadFecha").value,
    horaInicio: document.getElementById("horaInicio").value,
    horaFin: document.getElementById("horaFin").value,
    direccion: document.getElementById("direccion").value,
    agenda: document.getElementById("agenda").value,
    objetivos: document.getElementById("objetivos").value,
    totalAprendices: document.getElementById("totalAprendices").value,
    planMejoramiento: document.getElementById("planMejoramiento").value,
    novedades: document.getElementById("novedades").value,
    conclusiones: document.getElementById("conclusiones").value,
    actividad: document.getElementById("actividad").value,
    fechaActividad: document.getElementById("fechaActividad").value,
    responsableActividad: document.getElementById("responsableActividad").value,
    firmaActividad: document.getElementById("firmaActividad").value,
    nombreAsistente: document.getElementById("nombreAsistente").value,
    dependencia: document.getElementById("dependencia").value,
    aprueba: document.getElementById("aprueba").value,
    observacion: document.getElementById("observacion").value,
    firmaAsistente: document.getElementById("firmaAsistente").value,
    anexos: document.getElementById("anexos").value
  };

  fetch("http://localhost:3000/api/acta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(acta)
  })
    .then(response => response.json())
    .then(data => {
      alert(data.mensaje);
    })
    .catch(error => {
      console.error("Error al registrar el acta:", error);
      alert("No se pudo registrar el acta.");
    });
}



function recopilarDatosFormulario() {
  const getInput = id => document.getElementById(id)?.value || '';

  const obtenerFilas = (tbodyId) => {
    const filas = [];
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return filas;
    tbody.querySelectorAll('tr').forEach(tr => {
      const celdas = Array.from(tr.querySelectorAll('input, textarea')).map(input => input.value.trim());
      if (celdas.some(val => val !== '')) filas.push(celdas);
    });
    return filas;
  };

  return {
    numeroActa: getInput('numeroActa'),
    nombre: getInput('nombre'),
    ciudadFecha: getInput('ciudadFecha'),
    horaInicio: getInput('horaInicio'),
    horaFin: getInput('horaFin'),
    direccion: getInput('direccion'),
    agenda: getInput('agenda'),
    objetivos: getInput('objetivos'),
    totalAprendices: getInput('totalAprendices'),
    planMejoramiento: getInput('planMejoramiento'),
    novedades: getInput('novedades'),
    conclusiones: getInput('conclusiones'),
    anexos: getInput('anexos'),

    actividad: getInput('actividad'),
    fechaActividad: getInput('fechaActividad'),
    responsableActividad: getInput('responsableActividad'),
    firmaActividad: getInput('firmaActividad'),

    asistentes: {
      nombre: getInput('nombreAsistente'),
      dependencia: getInput('dependencia'),
      aprueba: getInput('aprueba'),
      observacion: getInput('observacion'),
      firma: getInput('firmaAsistente')
    },

    aprendices1: obtenerFilas('aprendices'),
    aprendices2: obtenerFilas('aprendices2'),
    evaluacion: obtenerFilas('evaluacion')
  };
}

//npm install express cors

window.crearFilaAprendices = crearFilaAprendices;
window.crearFilaEvaluacion = crearFilaEvaluacion;
window.verificarUltimaFila = verificarUltimaFila;
window.descargarActa = descargarActa;
window.subirActa = subirActa;

 
