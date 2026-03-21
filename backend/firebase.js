const admin = require('firebase-admin');
let db;

try {
  console.log('Checking for serviceAccountKey.json...');
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
  console.log('🔥 Firebase Firestore Connected!');
} catch (error) {
  console.error('⚠️ Firebase Connection Error: You are missing "serviceAccountKey.json". Running in mock mode.');
  // Mock DB to prevent crashes
  db = {
    collection: (name) => ({
      get: async () => ({ docs: [], empty: true }),
      add: async () => ({ id: 'mock123' }),
      where: () => ({
        get: async () => ({ docs: [], empty: true })
      }),
      doc: () => ({
         get: async () => ({ exists: false }),
         set: async () => ({})
      })
    })
  };
}

module.exports = { admin, db };
