const mysql = require('mysql2/promise');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const pool = mysql.createPool({
  host: process.env.POS_DB_HOST || 'localhost',
  port: process.env.POS_DB_PORT ? Number(process.env.POS_DB_PORT) : 3306,
  user: process.env.POS_DB_USER,
  password: process.env.POS_DB_PASSWORD,
  database: process.env.POS_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
