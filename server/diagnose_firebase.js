const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

console.log("🔍 Diagnosing Firebase Connection...");

try {
    const serviceAccountPath = path.join(__dirname, 'config/serviceAccountKey.json');
    console.log(`📂 Checking for key at: ${serviceAccountPath}`);

    if (!fs.existsSync(serviceAccountPath)) {
        console.error("❌ ERROR: serviceAccountKey.json NOT FOUND!");
        process.exit(1);
    }

    console.log("✅ Key file found. Attempting to parse...");
    const serviceAccount = require(serviceAccountPath);
    console.log(`🔑 Project ID: ${serviceAccount.project_id}`);

    console.log("🔌 Initializing App...");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();

    console.log("📡 Attempting Firestore Read (users collection)...");
    db.collection('users').get()
        .then(snapshot => {
            console.log(`✅ Connection SUCCESS! Found ${snapshot.size} documents.`);
            process.exit(0);
        })
        .catch(err => {
            console.error("❌ Connection FAILED!");
            console.error("---------------------------------------------------");
            console.error(err);
            console.error("---------------------------------------------------");
            process.exit(1);
        });

} catch (err) {
    console.error("❌ CRITICAL ERROR:", err.message);
    process.exit(1);
}
