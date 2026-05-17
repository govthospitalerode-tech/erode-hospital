try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional in this environment — continue without it
}
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ── API routes ───────────────────────────────────────────────
const wasteHandler    = require('./waste');
const hospitalHandler = require('./hospital');

app.all('/waste',    wasteHandler);
app.all('/hospital', hospitalHandler);

// ── SPA fallback ─────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🏥  Erode Govt Hospital site running`);
  console.log(`    → http://localhost:${PORT}\n`);
});