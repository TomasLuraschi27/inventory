// db.js - MySQL (mysql2/promise) + bootstrap
const mysql = require('mysql2/promise');

function cfg() {
  if (process.env.DATABASE_URL) return { uri: process.env.DATABASE_URL };
  return {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'inventory',
    password: process.env.DB_PASSWORD || 'inventorypass',
    database: process.env.DB_NAME || 'inventorydb',
    port: Number(process.env.DB_PORT || 3306),
  };
}

const conf = cfg();
const pool = conf.uri ? mysql.createPool(conf.uri) : mysql.createPool(conf);

async function init() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category_id INT,
        CONSTRAINT fk_cat FOREIGN KEY (category_id)
          REFERENCES categories(id) ON DELETE SET NULL
      );
    `);
    await conn.query(`
      INSERT IGNORE INTO categories(name)
      VALUES ('Electronics'),('Furniture'),('Food'),('Office Supplies');
    `);
  } finally {
    conn.release();
  }
}

module.exports = { pool, init };
