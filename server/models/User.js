const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    uid: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    verified:{
        type: Boolean,
        required: true,
        default: false,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["User", "Seller", "Caretaker"],
        required: true
    },
    profileImg: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile"
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
})

module.exports = mongoose.model("User", userSchema);