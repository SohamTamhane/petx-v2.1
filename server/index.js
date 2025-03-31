const express = require('express');
require('dotenv').config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const {cloudinaryConnect} = require("./config/cloudinary");

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

app.use("/api/v2/auth", AuthRoutes);
app.use("/api/v2/user", UserRoutes);
app.use("/api/v2/seller", SellerRoutes);
app.use("/api/v2/market", MarketplaceRoutes);
app.use("/api/v2/payment", PaymentRoutes);

const router = express.Router();
router.get('/', (req, res)=>{
    res.json({
        success: true,
        message: "Server is Running up..."
    })
})
app.use('/', router);

app.listen(PORT, ()=>{
    console.log(`Server Started at PORT: ${PORT}`);
})