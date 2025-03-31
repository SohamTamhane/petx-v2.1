const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.Map,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["Cash", "Online"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Package Packed", "Dispatched", "Out for Delivery", "Delivered"],
        required: true,
        default: "Accepted"
    }
})

module.exports = mongoose.model("Order", orderSchema);