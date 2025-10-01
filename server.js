const express = require('express');
const cors = require('cors');

const app = express();
const { pool, init } = require('./db');
init().catch(e => { console.error('DB init error:', e); process.exit(1); });

//endpoint para probar la conexión:
app.get('/db-health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.send('ok'); }
  catch (e) { res.status(500).send(e.message); }
});

const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET /api/products
app.get('/api/products', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/products
app.post('/api/products', async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [r] = await pool.execute(
      `INSERT INTO products (name, category, quantity, price, description)
       VALUES (?,?,?,?,?)`,
      [name, category, quantity, price, description ?? null]
    );
    res.json({ id: r.insertId, message: 'Product created successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  try {
    const [r] = await pool.execute(
      `UPDATE products
       SET name = ?, category = ?, quantity = ?, price = ?, description = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, category, quantity, price, description ?? null, req.params.id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const [r] = await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Dashboard stats
app.get('/api/stats', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_products,
        SUM(quantity) AS total_items,
        COUNT(DISTINCT category) AS categories,
        SUM(quantity * price) AS total_value
      FROM products
    `);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
