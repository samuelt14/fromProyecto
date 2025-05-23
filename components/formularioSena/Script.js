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
  const filas = tbody.getElementsByTagName('tr');
  const ultimaFila = filas[filas.length - 1];
  if (ultimaFila.contains(input)) {
    if (tablaId === 'evaluacion') {
      crearFilaEvaluacion(tbody);
    } else {
      crearFilaAprendices(tbody, filas.length + 1);
    }
  }
}

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


// Función simulada para subir el acta
function subirActa() {
  alert('Simulación de subida de acta. Conéctese a un backend real para almacenar el archivo.');
}
