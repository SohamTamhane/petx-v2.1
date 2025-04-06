const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mobile:{
        type: Number,
    },
    pets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pets"
        }
    ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.Map,
        }
    ],
    productorders: [
        {
            type: mongoose.Schema.Types.Map,
        }
    ],
    adoption: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pets"
        }
    ],
    address: {
        type: mongoose.Schema.Types.Map,
    },
    currentLocation: {
        type: String
    }
})

module.exports = mongoose.model("UserProfile", profileSchema);