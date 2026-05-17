// api/hospital.js  — serves hospital.json as REST API
const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'hospital.json');

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const section = req.query?.section;
    return res.status(200).json(section ? { [section]: data[section] } : data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
module.exports.getHospital = handler;