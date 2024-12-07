const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3005;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qwe_123',
  database: 'learning_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/query', async (req, res) => {
  const { sql } = req.body;

  try {
    const [rows, fields] = await pool.query(sql);

    // SELECT
    if (Array.isArray(rows)) {
      res.json({
        type: 'select',
        data: rows,
        fields: fields.map(field => field.name),
      });
    } else {
      // INSERT, UPDATE, DELETE
      res.json({
        type: 'update',
        rowCount: rows.affectedRows,
        operation: sql.trim().split(' ')[0].toUpperCase(),
      });
    }
  } catch (error) {
    res.status(400).json({ type: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});