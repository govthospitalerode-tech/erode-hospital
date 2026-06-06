// waste.js — Firestore backend using firebase.config.js
// Updated: bag-color fields (yellow/red/blue/white), Firebase Auth user tracking

let db;
try { db = require('./firebase.config').db; } catch(e) {
  try { db = require('./firebase_config').db; } catch(e2) {
    console.error('[waste.js] Could not load Firebase config:', e2.message);
  }
}

function aggregate(records) {
  const byWard     = {};
  const byMonth    = {};
  const byBagColor = { yellow: 0, red: 0, blue: 0, white: 0 };

  records.forEach((r) => {
    // by ward
    byWard[r.ward] = (byWard[r.ward] || 0) + Number(r.total_weight_kg || 0);

    // by month
    const month = (r.date || '').substring(0, 7);
    if (month) byMonth[month] = (byMonth[month] || 0) + Number(r.total_weight_kg || 0);

    // by bag color
    byBagColor.yellow += Number(r.yellow_kg || 0);
    byBagColor.red    += Number(r.red_kg    || 0);
    byBagColor.blue   += Number(r.blue_kg   || 0);
    byBagColor.white  += Number(r.white_kg  || 0);
  });

  // sort byMonth chronologically
  const sortedByMonth = Object.keys(byMonth).sort().reduce((acc, k) => {
    acc[k] = byMonth[k]; return acc;
  }, {});

  // sort byWard descending by weight
  const sortedByWard = Object.entries(byWard)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});

  const totalKg      = records.reduce((s, r) => s + Number(r.total_weight_kg || 0), 0);
  const totalBags    = records.reduce((s, r) => s + Number(r.total_bags || 0), 0);
  const currentMonth = new Date().toISOString().substring(0, 7);
  const thisMonthKg  = sortedByMonth[currentMonth] || 0;

  // top ward
  const topWard = Object.entries(byWard).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    byWard: sortedByWard,
    byMonth: sortedByMonth,
    byBagColor,
    summary: { totalKg, totalBags, thisMonthKg, topWard, count: records.length }
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!db) {
    return res.status(500).json({
      success: false,
      error: 'Firebase not initialised. Check FIREBASE_SERVICE_ACCOUNT in Vercel Environment Variables.'
    });
  }

  try {
    // ── GET ──────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const snapshot = await db.collection('waste_records').orderBy('date').get();
      const records  = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, records, ...aggregate(records) });
    }

    // ── POST ─────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const {
        date, ward,
        yellow_kg, red_kg, blue_kg, white_kg,
        total_bags,
        submittedBy   // email passed from frontend after Firebase Auth login
      } = req.body;

      if (!date || !ward) {
        return res.status(400).json({ success: false, error: 'Date and ward are required.' });
      }

      const y  = Number(yellow_kg || 0);
      const r  = Number(red_kg    || 0);
      const bl = Number(blue_kg   || 0);
      const w  = Number(white_kg  || 0);
      const total_weight_kg = parseFloat((y + r + bl + w).toFixed(3));

      if (total_weight_kg <= 0) {
        return res.status(400).json({ success: false, error: 'At least one bag quantity must be greater than 0.' });
      }

      const newRecord = {
        date,
        ward,
        yellow_kg: y,
        red_kg:    r,
        blue_kg:   bl,
        white_kg:  w,
        total_bags:       Number(total_bags || 0),
        total_weight_kg,
        submittedBy:      submittedBy || 'unknown',
        createdAt:        new Date().toISOString()
      };

      const docRef = await db.collection('waste_records').add(newRecord);
      return res.status(201).json({ success: true, record: { id: docRef.id, ...newRecord } });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (err) {
    console.error('[waste.js] Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
