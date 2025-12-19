const pool = require('../db/legacy');
const table = process.argv[2] || 'mod_po_2';

async function run() {
  try {
    console.log('Querying table:', table);
    const [rows] = await pool.query(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
    console.log('Result:', rows);
  } catch (err) {
    console.error('Query error:', err && err.message ? err.message : err);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

run();
