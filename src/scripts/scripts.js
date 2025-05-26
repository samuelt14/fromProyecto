// Generar filas dinámicamente para la tabla de aprendices (32 filas)
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

// Generar filas dinámicamente para la segunda tabla de aprendices 
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

// Función para descargar el acta en PDF
function descargarActa() {
  const element = document.getElementById('acta');
  const nombre = document.getElementById('nombre')?.value || 'acta_sena';
  const opt = {
    margin: 0.3,
    filename: `${nombre}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1, useCORS: true },
    jsPDF: { unit: 'mm', format: 'ledger', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

// Función simulada para subir el acta
function subirActa() {
  alert('Simulación de subida de acta. Conéctese a un backend real para almacenar el archivo.');
}

