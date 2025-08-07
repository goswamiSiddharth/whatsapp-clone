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

// // Define allowed origins for CORS
// const allowedOrigins = [
//   process.env.CLIENT_URL || 'http://localhost:3000',
//   'https://whatsapp-clone-ten-beryl.vercel.app' // Explicitly allow deployed client
// ];

// // Configure Socket.IO with CORS
// const io = socketIo(server, {
//   cors: {
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ['GET', 'POST'],
//   },
// });

// // Middleware
// app.set('io', io);
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));
// app.use(express.json());

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
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messages');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://whatsapp-clone-ten-beryl.vercel.app'
];

// Middleware
app.use(cors({
  origin: allowedOrigins, // Simplified CORS to accept array directly
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/messages', messageRoutes);

// Export for Vercel serverless
module.exports = app;