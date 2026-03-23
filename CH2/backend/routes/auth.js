const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'collegeHoursSecretToken';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const docRef = await db.collection('users').add({
      name,
      email,
      password: hashedPassword,
      role,
      department: department || 'General',
      avatarBg: '#d1dfc7',
      createdAt: new Date().toISOString()
    });

    const payload = { userId: docRef.id, role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: docRef.id, name, email, role } });
  } catch (err) {
    console.error('❌ Register Error:', err.message || err);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) return res.status(400).json({ message: 'Invalid credentials' });

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarBg: user.avatarBg } });
  } catch (err) {
    console.error('❌ Login Error:', err.message || err);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
});

// Social Login (Google / Microsoft via Firebase)
router.post('/social', async (req, res) => {
  try {
    const { idToken, name, email, photoURL } = req.body;

    if (!idToken || !email) {
      return res.status(400).json({ message: 'Missing required social login data.' });
    }

    // Verify the Firebase ID token
    const admin = require('firebase-admin');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    if (decodedToken.email !== email) {
      return res.status(400).json({ message: 'Email mismatch.' });
    }

    // Check if user already exists in our Firestore
    const snapshot = await db.collection('users').where('email', '==', email).get();
    
    let userId, userData;

    if (!snapshot.empty) {
      // Existing user — just log them in
      const userDoc = snapshot.docs[0];
      userId = userDoc.id;
      userData = userDoc.data();
    } else {
      // New user — auto-register with Student role
      const docRef = await db.collection('users').add({
        name: name || email.split('@')[0],
        email,
        photoURL: photoURL || null,
        role: 'Student',
        department: 'General',
        avatarBg: '#d1dfc7',
        authProvider: decodedToken.firebase?.sign_in_provider || 'social',
        createdAt: new Date().toISOString()
      });
      userId = docRef.id;
      userData = { name: name || email.split('@')[0], email, role: 'Student', photoURL };
    }

    const payload = { userId, role: userData.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatarBg: userData.avatarBg || '#d1dfc7',
        photoURL: userData.photoURL || photoURL || null
      }
    });
  } catch (err) {
    console.error('❌ Social Login Error:', err.message || err);
    res.status(500).json({ message: 'Social login failed. Please try again.' });
  }
});

module.exports = router;


