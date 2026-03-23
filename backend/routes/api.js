const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../firebase');

// --- DASHBOARD ROUTE ---
router.get('/dashboard', auth, async (req, res) => {
  try {
    const role = req.user.role || 'Student';
    
    // Fetch Announcements from DB (handles our mock db)
    const annSnapshot = await db.collection('announcements').get();
    let announcements = annSnapshot.empty ? [] : annSnapshot.docs.map(doc => {
       const d = doc.data();
       return { 
           id: doc.id, 
           title: d.title, 
           desc: d.description, 
           time: new Date(d.createdAt).toLocaleDateString(), 
           priority: d.priority, 
           author: d.createdBy?.name || 'Faculty' 
       };
    });
    
    // Sort reverse chronological
    announcements.reverse();

    if (announcements.length === 0) {
       announcements = [
         { id: 1, title: 'Exam Schedule Released', desc: 'The Mid-term examination schedule is now available.', time: '2 hours ago', priority: 'urgent', author: 'Dr. Smith' },
         { id: 2, title: 'Library Hours Extended', desc: 'Central library will be open 24/7 next week.', time: '1 day ago', priority: 'normal', author: 'Admin' },
         { id: 3, title: 'Guest Lecture in Auditorium A', desc: 'Tech talk by industry experts on AI patterns.', time: '2 days ago', priority: 'normal', author: 'CS Dept' },
       ];
    }

    const timetable = role === 'Faculty' ? [
      { id: 1, subject: 'Cloud Computing (CSE 301)', time: '09:00 AM - 10:30 AM', status: 'completed' },
      { id: 2, subject: 'Database Management (IT 201)', time: '11:00 AM - 12:30 PM', status: 'current' },
      { id: 3, subject: 'Faculty Meeting', time: '02:00 PM - 03:00 PM', status: 'upcoming' },
    ] : [
      { id: 1, subject: 'Operating Systems', time: '09:00 AM - 10:30 AM', status: 'completed' },
      { id: 2, subject: 'Software Engineering', time: '11:00 AM - 12:30 PM', status: 'current' },
      { id: 3, subject: 'Computer Networks', time: '02:00 PM - 03:30 PM', status: 'upcoming' },
    ];

    const deadlines = [
      { id: 1, title: 'Project Proposal Submission', subject: 'Software Engineering', date: 'Today, 11:59 PM', urgent: true },
      { id: 2, title: 'Assignment 3', subject: 'Operating Systems', date: 'Tomorrow, 5:00 PM', urgent: false },
      { id: 3, title: 'Lab Record Upload', subject: 'Computer Networks', date: 'Friday', urgent: false },
    ];

    const events = [
      { id: 1, name: 'Annual Tech Fest 2026', date: 'April 10-12, 2026', registered: true },
      { id: 2, name: 'Campus Placement Drive - TechCorp', date: 'April 15, 2026', registered: false },
    ];

    const questions = [
      { id: 1, title: 'How to deploy React app on Vercel?', status: 'Unresolved' },
      { id: 2, title: 'Doubt in OS Memory Paging', status: 'Resolved' }
    ];

    const placements = [
      { id: 1, text: 'TechCorp deadline extended to Mar 25' },
      { id: 2, text: 'GlobalTech shortlisting released' }
    ];

    const notifications = [
      { id: 1, text: 'System maintenance scheduled for weekend' },
      { id: 2, text: 'New policy update available in handbook' }
    ];

    const bookings = [
      { id: 1, text: 'Meeting with John Doe - 4:00 PM' }
    ];

    res.json({ announcements, timetable, deadlines, events, questions, placements, notifications, bookings });
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
