const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');

exports.userDetails = async (req, res) => {
    try {
        const user = req.user;
        const userDetails = await User.findOne({ email: user.email }, { password: false }).populate("profile").populate({
            path: "profile",
            populate: ["products", "cart"]
        })
        return res.status(200).json({
            success: true,
            message: "User Details Fetched Successfully !!",
            user: userDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.becomeSeller = async (req, res) => {
    try {
        const user = req.user;
        if(user.type === "Seller"){
            return res.status(401).json({
                success: false,
                message: "User is Already Seller"
            })
        }

        const userDetails = await User.findOneAndUpdate({ email: user.email }, { type: "Seller" })

        const payload = {
            id: user.id,
            type: "Seller",
            email: user.email,
            username: user.username,
            verified: user.verified
        }

        const jwt_options = {
            expiresIn: "7d"
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

        return res.status(200).json({
            success: true,
            message: "User Details Fetched Successfully !!",
            token: token
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.becomeCaretaker = async (req, res) => {
    try {
        const user = req.user;
        if(user.type === "Caretaker"){
            return res.status(401).json({
                success: false,
                message: "User is Already Caretaker"
            })
        }

        const userDetails = await User.findOneAndUpdate({ email: user.email }, { type: "Caretaker" })

        const payload = {
            id: user.id,
            type: "Caretaker",
            email: user.email,
            username: user.username,
            verified: user.verified
        }

        const jwt_options = {
            expiresIn: "7d"
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

        return res.status(200).json({
            success: true,
            message: "User Details Updated Successfully !!",
            token: token
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const user = req.user;
        const {name, address, pincode, mobile} = req.body;
        const userDetails = await User.findOne({ email: user.email });
        const profileDetails = await UserProfile.findOneAndUpdate({userId: userDetails._id}, {
            address: {
                name: name,
                address: address,
                pincode: pincode,
                mobile: mobile
            }
        })
        return res.status(200).json({
            success: true,
            message: "Address Updated Successfully !!"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}