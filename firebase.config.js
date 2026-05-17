try {
  const admin = require('firebase-admin');
  const path  = require('path');
  const fs    = require('fs');

  if (!admin.apps.length) {
    // Option 1: FIREBASE_SERVICE_ACCOUNT env var — used on Vercel
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

    // Option 2: Individual env vars
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      });

    // Option 3: Local serviceAccountKey.json — local dev only
    } else {
      const keyPath = path.join(__dirname, 'serviceAccountKey.json');
      if (fs.existsSync(keyPath)) {
        admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
      } else {
        throw new Error('No Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT on Vercel.');
      }
    }
  }

  const db = admin.firestore();
  module.exports = { db };
} catch (e) {
  console.warn('[firebase.config] Not initialised:', e.message);
  module.exports = { db: null };
}
