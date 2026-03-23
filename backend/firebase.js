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
  console.error('⚠️ Firebase Connection Error: You are missing "serviceAccountKey.json". Running in in-memory mock mode.');
  // Mock In-Memory DB to prevent crashes and allow testing without Firebase
  const mockStorage = {
    users: []
  };

  db = {
    collection: (name) => {
      if (!mockStorage[name]) mockStorage[name] = [];
      return {
        get: async () => ({ 
          docs: mockStorage[name].map(d => ({ id: d.id, data: () => d })), 
          empty: mockStorage[name].length === 0 
        }),
        add: async (data) => {
          const id = 'mock_' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
          mockStorage[name].push({ id, ...data });
          return { id };
        },
        where: (field, op, val) => {
          let filtered = mockStorage[name];
          if (op === '==') {
            filtered = mockStorage[name].filter(d => d[field] === val);
          }
          return {
            get: async () => ({ 
              docs: filtered.map(d => ({ id: d.id, data: () => d })), 
              empty: filtered.length === 0 
            })
          };
        },
        doc: (id) => ({
           get: async () => {
             const found = mockStorage[name].find(d => d.id === id);
             return found ? { exists: true, id, data: () => found } : { exists: false };
           },
           set: async (data) => {
             const idx = mockStorage[name].findIndex(d => d.id === id);
             if (idx >= 0) mockStorage[name][idx] = { ...mockStorage[name][idx], ...data };
             else mockStorage[name].push({ id, ...data });
           }
        })
      };
    }
  };
}

module.exports = { admin, db };
