const express = require('express')
const pool = require('../db/legacy')
const router = express.Router()

const allowed = (process.env.POS_ALLOWED_TABLES || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

router.get('/table/:name', async (req, res) => {
  const table = req.params.name;
  if (!allowed.includes(table)) {
    return res.status(403).json({ error: 'Table not allowed' })
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` LIMIT 999999999`)
    res.json({ rows })
  } catch (err) {
    console.error('POS query error:', err)
    res.status(500).json({ error: 'Query failed' })
  }
})

module.exports = router
