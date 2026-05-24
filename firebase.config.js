/**
 * firebase.config.js
 * Supports 4 credential strategies (tried in order):
 *  1. FIREBASE_SERVICE_ACCOUNT_B64  — base64-encoded JSON  (best for Vercel)
 *  2. FIREBASE_SERVICE_ACCOUNT      — raw JSON string
 *  3. Individual env vars           — FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 *  4. serviceAccountKey.json        — local dev only
 */

const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

try {
  if (!admin.apps.length) {

    // ── Option 1: Base64-encoded JSON (recommended for Vercel — no \n mangling) ──
    if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
      const json           = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(json);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('[firebase.config] Initialised via FIREBASE_SERVICE_ACCOUNT_B64');

    // ── Option 2: Raw JSON string ──
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      // Fix double-escaped newlines that Vercel sometimes introduces
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key
          .replace(/\\n/g, '\n')
          .trim();
      }
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('[firebase.config] Initialised via FIREBASE_SERVICE_ACCOUNT');

    // ── Option 3: Individual env vars ──
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim(),
        })
      });
      console.log('[firebase.config] Initialised via individual env vars');

    // ── Option 4: Local serviceAccountKey.json ──
    } else {
      const keyPath = path.join(__dirname, 'serviceAccountKey.json');
      if (fs.existsSync(keyPath)) {
        admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
        console.log('[firebase.config] Initialised via serviceAccountKey.json');
      } else {
        throw new Error(
          'No Firebase credentials found. ' +
          'Set FIREBASE_SERVICE_ACCOUNT_B64 (or FIREBASE_SERVICE_ACCOUNT) in your environment, ' +
          'or place serviceAccountKey.json next to this file for local dev.'
        );
      }
    }
  }

  const db = admin.firestore();
  module.exports = { db };

} catch (e) {
  console.error('[firebase.config] Initialisation failed:', e.message);
  module.exports = { db: null };
}
