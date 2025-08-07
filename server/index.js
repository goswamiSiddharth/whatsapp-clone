// // server/index.js
// // Main server file for WhatsApp clone backend

// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const messageRoutes = require('./routes/messages');

// // Load environment variables
// dotenv.config();

// // Initialize Express app and HTTP server
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });

// // Middleware
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
// app.use(express.json());

// // Make io accessible to routes
// app.set('io', io);

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use('/messages', messageRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messages');

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL, // Vercel: https://whatsapp-clone-ten-beryl.vercel.app
  'http://localhost:3000' // Local testing
];

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.set('io', io);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/messages', messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});