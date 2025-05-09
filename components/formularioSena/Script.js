// Llenar la primera tabla (32 filas)
const tbody = document.getElementById('aprendices');
for (let i = 1; i <= 32; i++) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${i}</td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
  `;
  tbody.appendChild(row);
}

// Llenar la segunda tabla (15 filas)
const tbody2 = document.getElementById('aprendices2');
for (let i = 1; i <= 15; i++) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${i}</td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
  `;
  tbody2.appendChild(row);
}

function descargarActa() {
  const element = document.getElementById('acta');
  const nombre = document.getElementById('nombre')?.value.trim() || 'acta_sena';


  const opt = {
    margin:       [5, 5, 5, 5],   // mm: top, left, bottom, right
    filename:     `${nombre}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: {
      mode: ['avoid-all', 'css'],
      before: 'h2',
      avoid: ['table']
    }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save();
}


// Función simulada para subir el acta
function subirActa() {
  alert('Simulación de subida de acta. Conéctese a un backend real para almacenar el archivo.');
}
