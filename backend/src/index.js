const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const posRoutes = require('./routes/pos');

const app = express();
app.use(express.json());

app.use('/api/pos', posRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'ERP Backend (Node)'}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
