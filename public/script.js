const sqlForm = document.getElementById('sqlForm');
const sqlInput = document.getElementById('sqlInput');
const resultDiv = document.getElementById('result');

sqlForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sqlQuery = sqlInput.value;

  try {
    const response = await fetch('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: sqlQuery }),
    });

    const data = await response.json();

    if (data.type === 'select') {
      renderTable(data.fields, data.data);
    } else if (data.type === 'update') {
      resultDiv.innerHTML = `<p>${data.rowCount} rows affected.</p>`;
    } else if (data.type === 'error') {
      resultDiv.innerHTML = `<p class="error">Error: ${data.message}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p class="error">Unexpected error: ${err.message}</p>`;
  }
});

function renderTable(fields, rows) {
  let table = '<table><thead><tr>';
  fields.forEach(field => { table += `<th>${field}</th>`; });
  table += '</tr></thead><tbody>';
  rows.forEach(row => {
    table += '<tr>';
    fields.forEach(field => { table += `<td>${row[field]}</td>`; });
    table += '</tr>';
  });
  table += '</tbody></table>';
  resultDiv.innerHTML = table;
}