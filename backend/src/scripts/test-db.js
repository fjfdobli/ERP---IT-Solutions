const pool = require('../db/legacy');

async function test() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('DB test result:', rows);
  } catch (err) {
    console.error('DB connection/test failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

test();
