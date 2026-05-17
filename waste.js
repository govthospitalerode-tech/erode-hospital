// api/waste.js
// Uses your local firebase.config.js if present; otherwise falls back to local waste.json storage

const fs = require('fs');
const path = require('path');

// Try to load firebase config from project root. If missing, we'll use local JSON fallback.
let db = null;
try {
  const cfg = require('./firebase.config');
  db = cfg.db;
} catch (e) {
  db = null;
}

const DATA_FILE = path.join(__dirname, 'waste.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { meta: {}, records: [] };
  }
}

function writeData(json) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2), 'utf8');
}

function aggregate(records) {
  const byCategory = {};
  const byMonth = {};
  const byWard = {};

  records.forEach((r) => {
    byCategory[r.category] =
      (byCategory[r.category] || 0) + Number(r.quantity_kg);

    const month = r.date.substring(0, 7);
    byMonth[month] =
      (byMonth[month] || 0) + Number(r.quantity_kg);

    byWard[r.ward] =
      (byWard[r.ward] || 0) + Number(r.quantity_kg);
  });

  const totalKg = records.reduce(
    (sum, r) => sum + Number(r.quantity_kg),
    0
  );

  const currentMonth = new Date()
    .toISOString()
    .substring(0, 7);

  const thisMonthKg = byMonth[currentMonth] || 0;

  const topCategory =
    Object.entries(byCategory).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || 'N/A';

  return {
    byCategory,
    byMonth,
    byWard,
    summary: {
      totalKg,
      thisMonthKg,
      topCategory,
      count: records.length
    }
  };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ── GET ALL RECORDS ─────────────────────────────
    if (req.method === 'GET') {
      if (db) {
        const snapshot = await db.collection('waste_records').orderBy('date').get();
        const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ records, ...aggregate(records) });
      }

      // Fallback: read local JSON
      const data = readData();
      const records = data.records || [];
      return res.status(200).json({ records, ...aggregate(records) });
    }

    // ── ADD NEW RECORD ─────────────────────────────
    if (req.method === 'POST') {
      const { date, ward, category, disposal, quantity_kg } = req.body;

      if (!date || !ward || !category || !disposal || !quantity_kg) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newRecord = {
        date,
        ward,
        category,
        disposal,
        quantity_kg: Number(quantity_kg),
        createdAt: new Date().toISOString()
      };

      if (db) {
        const docRef = await db.collection('waste_records').add(newRecord);
        return res.status(201).json({ success: true, record: { id: docRef.id, ...newRecord } });
      }

      // Fallback: append to local JSON
      const data = readData();
      const records = data.records || [];
      const id = 'w' + String(Date.now());
      const recordWithId = { id, ...newRecord };
      records.push(recordWithId);
      data.records = records;
      data.meta = data.meta || {};
      data.meta.last_updated = new Date().toISOString().substring(0, 10);
      writeData(data);

      return res.status(201).json({ success: true, record: recordWithId });
    }

    // ── INVALID METHOD ─────────────────────────────
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in waste handler:', err);
    return res.status(500).json({ error: err.message });
  }
};