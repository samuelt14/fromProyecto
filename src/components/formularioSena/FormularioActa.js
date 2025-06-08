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


async function subirActa() {
  const BASE_URL = "http://localhost:3000";

  try {
    const acta = document.getElementById("acta");

    // 1. Capturar la vista como imagen
    const canvas = await html2canvas(acta, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // 2. Convertir la imagen en PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * width) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, pdfHeight);

    // 3. Convertir PDF a Blob y preparar FormData
    const pdfBlob = pdf.output("blob");
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "acta.pdf");


    // 4. Subir PDF a UploadThing
    const uploadResponse = await fetch(
      `${BASE_URL}/api/uploadthing/pdfUploader`,
      {
        method: "POST",
        mode: "cors",             
        credentials: "include",   
        body: formData,
      }
    );
    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("❌ Error al subir a UploadThing:", uploadResult);
      alert("No se pudo subir el acta a UploadThing.");
      return;
    }

    const pdfUrl = Array.isArray(uploadResult)
      ? uploadResult[0].url
      : uploadResult.url;
    alert("✅ Acta subida correctamente.\nURL: " + pdfUrl);

    // 5. Guardar la URL en la base de datos
    const saveResponse = await fetch(
      `${BASE_URL}/api/acta/subir`,
      {
        method: "POST",
        mode: "cors",             // <-- y aquí también
        credentials: "include",   // <-- y aquí
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anexos: pdfUrl }),
      }
    );
    const saveResult = await saveResponse.json();

    if (!saveResponse.ok) {
      console.error("❌ Error al guardar en la BBDD:", saveResult);
      alert("El acta se subió, pero no se pudo guardar en la base de datos.");
    } else {
      console.log("✅ URL guardada en la BBDD:", saveResult);
      alert("El acta se ha registrado correctamente en la base de datos.");
    }
  } catch (error) {
    console.error("Error inesperado:", error);
    alert("Hubo un error al procesar y subir el acta.");
  }
}




window.crearFilaAprendices = crearFilaAprendices;
window.crearFilaEvaluacion = crearFilaEvaluacion;
window.verificarUltimaFila = verificarUltimaFila;
window.descargarActa = descargarActa;
window.subirActa = subirActa;

 
