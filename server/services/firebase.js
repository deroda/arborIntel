const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db;

try {
    const serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');

    // Priority 1: Environment Variable (For Vercel / Cloud)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log("🔥 Initializing Firebase from Environment Variable...");
        // Handle if it's already an object or a string
        const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : process.env.FIREBASE_SERVICE_ACCOUNT;

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        db = admin.firestore();
        console.log("✅ Firebase Admin Initialized (Env Var)");

    }
    // Priority 2: Local File (For Development)
    else if (fs.existsSync(serviceAccountPath)) {
        console.log("📂 Initializing Firebase from Local File...");
        const serviceAccount = require(serviceAccountPath);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        db = admin.firestore();
        console.log("✅ Firebase Admin Initialized (Local File)");
    } else {
        console.warn("⚠️  WARNING: No Firebase credentials found (File or Env Var).");
        console.warn("    Services requiring DB will fail.");
    }
} catch (error) {
    console.error("❌ Firebase Initialization Error:", error);
}

module.exports = { db, admin };
