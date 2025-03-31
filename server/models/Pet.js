const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    species: {
        type: String,
        enum: ["Dog", "Cat"],
        required: true
    },
    profileImg: {
        type: String,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PetProfile"
    }
})

module.exports = mongoose.model("Pet", petSchema);