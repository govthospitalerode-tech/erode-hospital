const admin = require("firebase-admin");

// Prevent re-initializing during Vercel hot reloads
if (!admin.apps.length) {
  // FIREBASE_SERVICE_ACCOUNT must be added in Vercel Environment Variables
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Firestore database instance
const db = admin.firestore();

module.exports = { db };