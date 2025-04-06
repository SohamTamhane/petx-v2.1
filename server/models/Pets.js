const mongoose = require('mongoose');

const petsSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    age : {
        type: Number,
        required: true,
    },
    gender : {
        type: String,
        required: true,
    },
    category : {
        type: String,
        enum: ["Dog", "Cat","Other"],
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    sale : {
        type: String,
        required: true,
    },
    img: [
        {
            type: String
        }
    ],
})

module.exports = mongoose.model("Pets", petsSchema);