// api/waste.js
// FULL FIREBASE VERSION — NO LOCAL JSON, NO FILESYSTEM

const path = require("path");

// Load Firebase Admin config from project root
const { db } = require("./firebase.config");

// ── AGGREGATION ─────────────────────────────────────
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
    )[0]?.[0] || "N/A";

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

// ── MAIN HANDLER ───────────────────────────────────
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
    // ── GET ALL RECORDS FROM FIREBASE ──────────────
    if (req.method === "GET") {
      const snapshot = await db
        .collection("waste_records")
        .orderBy("date")
        .get();

      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      return res.status(200).json({
        success: true,
        records,
        ...aggregate(records)
      });
    }

    // ── ADD NEW RECORD TO FIREBASE ─────────────────
    if (req.method === "POST") {
      const { date, ward, category, disposal, quantity_kg } = req.body;

      if (
        !date ||
        !ward ||
        !category ||
        !disposal ||
        !quantity_kg
      ) {
        return res.status(400).json({
          success: false,
          error: "All fields are required"
        });
      }

      const newRecord = {
        date,
        ward,
        category,
        disposal,
        quantity_kg: Number(quantity_kg),
        createdAt: new Date().toISOString()
      };

      const docRef = await db
        .collection("waste_records")
        .add(newRecord);

      return res.status(201).json({
        success: true,
        record: {
          id: docRef.id,
          ...newRecord
        }
      });
    }

    // ── INVALID METHOD ─────────────────────────────
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });

  } catch (err) {
    console.error("Waste API Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
