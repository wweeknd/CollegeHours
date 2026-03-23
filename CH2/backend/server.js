require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach io to the req.app
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Import Routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');


// Initialize Firebase
require('./firebase');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('College Hours API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
