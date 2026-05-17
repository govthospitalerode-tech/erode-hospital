// Example firebase.config.js
// Place a valid Firebase Admin SDK service account JSON in `serviceAccountKey.json` in the project root
// and update this file if you prefer to load credentials from environment variables.

// NOTE: Do NOT commit your service account JSON to source control.

try {
  const admin = require('firebase-admin');
  const path  = require('path');
  const fs    = require('fs');

  let app;

  if (!admin.apps.length) {
    // Option 1: FIREBASE_SERVICE_ACCOUNT env var (JSON string) — recommended for Vercel
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

    // Option 2: Individual env vars — alternative for Vercel
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      });

    // Option 3: Local serviceAccountKey.json — for local dev only (never commit this file)
    } else {
      const keyPath = path.join(__dirname, 'serviceAccountKey.json');
      if (fs.existsSync(keyPath)) {
        const serviceAccount = require(keyPath);
        app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      } else {
        throw new Error('No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT env var on Vercel.');
      }
    }
  } else {
    app = admin.app();
  }

  const db = admin.firestore();
  module.exports = { db };
} catch (e) {
  console.warn('[firebase.config] Firebase not initialised:', e.message);
  module.exports = { db: null };
}