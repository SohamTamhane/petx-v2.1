const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 10*60
    }
});

module.exports = mongoose.model("ResetPassword", resetPasswordSchema);