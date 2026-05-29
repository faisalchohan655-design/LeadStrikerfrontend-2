const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Railway DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ===== یہ 2 لائن سب سے اہم ہیں - Public بڑا P =====
app.use(express.static(path.join(__dirname, 'Public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});
// ==================================

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Lead submit route
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, source) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, source]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
