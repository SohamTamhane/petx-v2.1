const express = require('express');
require('dotenv').config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

const http = require('http');
const { Server } = require('socket.io');

const dbConnect = require('./config/database');

const app = express();
app.use(express.json());
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)
dbConnect();
cloudinaryConnect();

const PORT = process.env.PORT || 8080;

const AuthRoutes = require('./routes/Auth');
const UserRoutes = require('./routes/User');
const SellerRoutes = require('./routes/Seller');
const MarketplaceRoutes = require('./routes/Marketplace');
const PaymentRoutes = require('./routes/Payment');
const RoomRoutes = require('./routes/Room');
const AdoptRoutes = require('./routes/Adoption');

app.use("/api/v2/auth", AuthRoutes);
app.use("/api/v2/user", UserRoutes);
app.use("/api/v2/seller", SellerRoutes);
app.use("/api/v2/market", MarketplaceRoutes);
app.use("/api/v2/payment", PaymentRoutes);
app.use("/api/v2/room", RoomRoutes);
app.use("/api/v2/adopt", AdoptRoutes);

const router = express.Router();
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Server is Running up..."
    })
})
app.use('/', router);





// ----------- Socket Programming ---------------
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
            longitude: data.longitude
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});






app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
})