const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender:{
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true
    },
    vacinationStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    lastVacinationDate: {
        type: Date,
        default: Date.now(),
    },
    medicalHistory: [
        {
            type: String,
        }
    ],
    currentMedicalStatus: {
        type: String,
    },
    allergies: [
        {
            type: String
        }
    ],
    photos: [
        {
            type: String
        }
    ]
})

module.exports = mongoose.model("PetProfile", petProfileSchema);