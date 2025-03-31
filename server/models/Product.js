const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slug: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    img: [
        {
            type: String
        }
    ],
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    purchaseCount : {
        type: Number,
        default: 0 
    }
    
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);