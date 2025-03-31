const User = require('../models/User');
const Profile = require('../models/UserProfile');
const Product = require('../models/Product');
const UserProfile = require('../models/UserProfile');

exports.productCategory = async (req, res) => {
    try {

        const { category } = req.body;
        
        const productDetails = await Product.find({category: category});

        return res.status(200).json({
            success: true,
            message: "Product Fetched Successfully",
            products: productDetails
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.productDetails = async (req, res) => {
    try {

        const { slug } = req.body;
        
        const productDetails = await Product.findOne({slug: slug});

        return res.status(200).json({
            success: true,
            message: "Product Fetched Successfully",
            products: productDetails
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.addtoCartProduct = async (req, res) => {
    try {

        const user = req.user;
        const { slug } = req.body;
        
        const productDetails = await Product.findOne({slug: slug});
        const userDetails = await User.findOne({email: user.email});
        const existingUserProfile = await Profile.findOne({cart: productDetails._id});

        if(existingUserProfile){
            return res.status(401).json({
                success: false,
                message: "Product Already Exist in the Cart"
            });
        }

        const userProfileDetails = await Profile.findOneAndUpdate({userId: userDetails._id}, {
            $push: {
                cart: productDetails._id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Product Added to Cart"
        });
    }
    
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.removeFromCartProduct = async (req, res) => {
    try {

        const user = req.user;
        const { slug } = req.body;
        
        const productDetails = await Product.findOne({slug: slug});
        const userDetails = await User.findOne({email: user.email});
        const existingUserProfile = await Profile.findOne({cart: productDetails._id});

        if(!existingUserProfile){
            return res.status(401).json({
                success: false,
                message: "Product Doesn't Exist in the Cart"
            });
        }

        const userProfileDetails = await Profile.findOneAndUpdate({userId: userDetails._id}, {
            $pull: {
                cart: productDetails._id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Product Remove From Cart"
        });
    }
    
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}