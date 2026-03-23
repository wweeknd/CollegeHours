const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Try requiring the service account. If missing or not set up, we'll fail gracefully.
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (e) {
  console.error("Error initializing firebase for seeding:", e);
  process.exit(1);
}

const db = admin.firestore();

const demoUsers = [
  {
    email: 'student@demo.edu',
    password: 'demo123',
    name: 'Alex (Student)',
    role: 'Student',
    department: 'CSE',
    year: '3rd Year',
    section: 'A',
    avatarBg: '#d1dfc7' 
  },
  {
    email: 'faculty@demo.edu',
    password: 'demo123',
    name: 'Dr. Smith (Faculty)',
    role: 'Faculty',
    department: 'CSE',
    subjects: ['Data Structures', 'AI'],
    avatarBg: '#f0e6d2' 
  },
  {
    email: 'staff@demo.edu',
    password: 'demo123',
    name: 'Admin Sarah (Staff)',
    role: 'Staff',
    staffOffice: 'Main Admin',
    staffDesignation: 'Placement Officer',
    avatarBg: '#e6e6fa' 
  }
];

async function seed() {
  console.log("Seeding demo users...");
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('demo123', salt);

    for (const user of demoUsers) {
      // Check if user exists
      const snapshot = await db.collection('users').where('email', '==', user.email).get();
      if (snapshot.empty) {
        // Create user
        const userData = { ...user, password: hash, createdAt: new Date().toISOString() };
        await db.collection('users').add(userData);
        console.log(`✅ Created ${user.role} demo user: ${user.email}`);
      } else {
        console.log(`ℹ️ ${user.role} demo user already exists: ${user.email}`);
      }
    }
    console.log("Done seeding!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
}

seed();
