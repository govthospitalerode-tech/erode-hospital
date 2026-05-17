const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load service account
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Load your JSON data
const data = require("./waste.json");

async function importData() {
  const batch = db.batch();

  data.records.forEach((record) => {
    // Use your custom ID like w001, w002...
    const docRef = db.collection("waste_records").doc(record.id);

    batch.set(docRef, {
      date: record.date,
      ward: record.ward,
      category: record.category,
      quantity_kg: Number(record.quantity_kg),
      disposal: record.disposal,
      createdAt: record.createdAt || new Date().toISOString()
    });
  });

  await batch.commit();

  console.log(`✅ Imported ${data.records.length} records successfully!`);
}

importData().catch(console.error);