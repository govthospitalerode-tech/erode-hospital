# 🏥 Thanthai Periyar Govt Hospital Erode — Website

## Project Structure
```
erode-gh/
├── about.html
├── achievements.html
├── departments.html
├── events.html
├── index.html
├── patients.html
├── waste.html
├── shared.js              ← Shared navbar + footer
├── style.css              ← Design system
├── hospital.js            ← GET hospital data
├── hospital.json          ← All hospital data
├── waste.js               ← GET/POST waste records (Firestore or local JSON)
├── firebase.config.js     ← Firebase Admin SDK init
├── server.js              ← Express dev server
├── vercel.json            ← Vercel routing config
├── .gitignore
└── package.json
```

---

## Local Dev
```bash
npm install
npm run dev
# → http://localhost:3001
```
Place `serviceAccountKey.json` in root for local dev (never commit — it's gitignored).

---

## Deploy to Vercel

### 1. Set Firebase credentials as Vercel environment variables

**Option A — Paste full JSON (easiest)**
- Vercel → Project → Settings → Environment Variables
- Name: `FIREBASE_SERVICE_ACCOUNT`  Value: *(entire contents of serviceAccountKey.json)*

**Option B — Individual vars**
- `FIREBASE_PROJECT_ID` = `govthospitalerode-ebb83`
- `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@govthospitalerode-ebb83.iam.gserviceaccount.com`
- `FIREBASE_PRIVATE_KEY` = *(private key string including BEGIN/END headers)*

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "init: erode hospital site"
git remote add origin https://github.com/YOUR_USER/erode-hospital.git
git push -u origin main
```

### 3. Import on Vercel
1. vercel.com → New Project → Import repo
2. Deploy (no build command needed — it's a Node/Express app)
3. Add env variables from Step 1 → Redeploy
4. Settings → Domains → add your custom domain

---

## ⚠️ Security
- `serviceAccountKey.json` is gitignored — never push it
- Always use env vars for credentials on Vercel/any cloud host