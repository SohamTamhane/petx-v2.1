import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { cloudinaryConnect } from './config/cloudinary.js';

import http from 'http';
import { Server } from 'socket.io';

import dbConnect from './config/database.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);

// Connect to database and cloudinary
dbConnect();
cloudinaryConnect();

const PORT = process.env.PORT || 8080;

import AuthRoutes from './routes/Auth.js';
import UserRoutes from './routes/User.js';
import SellerRoutes from './routes/Seller.js';
import MarketplaceRoutes from './routes/Marketplace.js';
import PaymentRoutes from './routes/Payment.js';
import RoomRoutes from './routes/Room.js';
import AdoptRoutes from './routes/Adoption.js';

// Set up API routes
app.use('/api/v2/auth', AuthRoutes);
app.use('/api/v2/user', UserRoutes);
app.use('/api/v2/seller', SellerRoutes);
app.use('/api/v2/market', MarketplaceRoutes);
app.use('/api/v2/payment', PaymentRoutes);
app.use('/api/v2/room', RoomRoutes);
app.use('/api/v2/adopt', AdoptRoutes);

const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is Running up...',
  });
});
app.use('/', router);





// ----------- Socket Programming ---------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000' || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join room for private messaging
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  // Handle location updates for room members
  socket.on('updateLocation', (data) => {
    // Broadcast to all members of the room
    io.to(data.roomId).emit('locationUpdated', {
      userId: data.userId,
      username: data.username,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server Started at PORT: ${PORT}`);
});

export { io };