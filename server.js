try { require('dotenv').config(); } catch (e) {}

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ── API routes ────────────────────────────────────────────
app.all('/waste',    (req, res) => require('./waste')(req, res));
app.all('/hospital', (req, res) => require('./hospital')(req, res));

// ── Static HTML pages ─────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── SPA fallback ──────────────────────────────────────────
app.get('*', (req, res) => {
  const file = path.join(__dirname, req.path);
  const fs = require('fs');
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.sendFile(file);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🏥  Erode Govt Hospital running → http://localhost:${PORT}\n`);
});
