const sqlForm = document.getElementById('sqlForm');
const sqlInput = document.getElementById('sqlInput');
const resultDiv = document.getElementById('result');

const editor = CodeMirror(document.getElementById('sqlEditor'), {
  mode: 'text/x-sql',
  theme: 'default',
  lineNumbers: true,
  autofocus: true,
  extraKeys: { 'Ctrl-Space': 'autocomplete' },
});

sqlForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sqlQuery = editor.getValue();

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
      resultDiv.innerHTML = `<p>${data.operation}: ${data.rowCount} rows affected.</p>`;
    } else if (data.type === 'error') {
      resultDiv.innerHTML = `<p class="error">Error: ${data.message}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p class="error">Unexpected error: ${err.message}</p>`;
  }
});

function renderTable(fields, rows) {
  let table = '<table class="table table-striped"><thead><tr>';
  fields.forEach(field => { table += `<th scope="col">${field}</th>`; });
  table += '</tr></thead><tbody>';
  rows.forEach(row => {
    table += '<tr>';
    fields.forEach(field => { table += `<td>${row[field]}</td>`; });
    table += '</tr>';
  });
  table += '</tbody></table>';
  resultDiv.innerHTML = table;
}