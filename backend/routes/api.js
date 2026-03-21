const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../firebase');

// --- DASHBOARD ROUTE ---
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Latest 5 announcements from Firebase
    const annSnapshot = await db.collection('announcements').orderBy('createdAt', 'desc').limit(5).get();
    const announcements = annSnapshot.empty ? [] : annSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    // Upcoming deadlines from Firebase
    const dlSnapshot = await db.collection('deadlines').where('dueDate', '>=', new Date().toISOString()).limit(4).get();
    const deadlines = dlSnapshot.empty ? [] : dlSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    // Faculty Status from Firebase
    const facSnapshot = await db.collection('users').where('role', '==', 'Faculty').get();
    let facultyWithStatus = [];
    if (!facSnapshot.empty) {
        facultyWithStatus = facSnapshot.docs.map((doc, i) => {
            const f = doc.data();
            let status = 'Available till 4 PM';
            let dotColor = '#4CAF50';
            if (i === 1) { status = 'In a Meeting'; dotColor = '#FF9800'; }
            if (i === 2) { status = 'In Cabin 402'; dotColor = '#4CAF50'; }
            return { _id: doc.id, name: f.name, avatarBg: f.avatarBg, status, dotColor };
        });
    }

    res.json({ announcements, deadlines, faculty: facultyWithStatus });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- ANNOUNCEMENT ROUTES ---
router.post('/announcements', auth, async (req, res) => {
  if (req.user.role !== 'Faculty') return res.status(403).json({ message: 'Access denied. Faculty only.' });
  try {
    const { title, description, priority, tags } = req.body;
    
    // Get creator name
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    const creatorName = userDoc.exists ? userDoc.data().name : 'Faculty';

    const newAnnouncement = {
      title, 
      description, 
      priority, 
      tags,
      createdBy: { name: creatorName }, 
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('announcements').add(newAnnouncement);
    const finalData = { _id: docRef.id, ...newAnnouncement };

    // Socket.io Real-time update
    req.app.get('io').emit('new_announcement', finalData);
    
    res.json(finalData);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
