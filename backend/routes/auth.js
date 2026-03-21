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
    res.status(500).send('Server Error with Firebase Auth');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
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
    res.status(500).send('Server Error with Firebase Auth');
  }
});

module.exports = router;
