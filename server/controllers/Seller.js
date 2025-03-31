const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const UserProfile = require('../models/UserProfile');

exports.addProduct = async (req, res) => {
    try {

        const user = req.user;
        const { title, desc, price, discountedPrice, stock, category } = req.body;
        const imgs = req.files.img;
        // console.log(imgs);

        const timestamp = Date.now();
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + "-" + timestamp;

        if (!title || !desc || !price || !discountedPrice || !stock || !imgs) {
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details",
            });
        }

        let imagesUrl = [];
        if(imgs.length===undefined){
            let uploadedProductImages = await uploadImageToCloudinary(imgs, process.env.FOLDER_NAME);
            imagesUrl.push(uploadedProductImages.secure_url);
        }
        else{
            for (let i = 0; i < imgs.length; i++) {
                let uploadedProductImages = await uploadImageToCloudinary(imgs[i], process.env.FOLDER_NAME);
                imagesUrl.push(uploadedProductImages.secure_url);
            }
        }

        const res1 = await Product.create({ title: title, desc: desc, category: category, slug: slug, price: price, discountedPrice: discountedPrice, stock: stock, img: imagesUrl, sellerId: user.id });
        const userInfo = await UserProfile.findOneAndUpdate({ userId: user.id }, {
            $push: {
                products: res1
            }
        });

        return res.status(200).json({
            success: true,
            message: "Product Added Successfully",
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

exports.deleteProduct = async (req, res) => {
    try{
        const user = req.user;
        const {slug} = req.body;

        if(!slug){
            return res.status(401).json({
                success: false,
                message: "Product Not Found"
            })
        }
        
        const productInfo = await Product.findOneAndDelete({slug: slug});
        if(!productInfo){
            return res.status(401).json({
                success: false,
                message: "Product Not Found"
            })
        }
        const response = await UserProfile.updateMany({userId: user.id}, {
            $pull: {
                products: productInfo._id
            }
        })
    
        return res.status(200).json({
            success: true,
            message: "Products Deleted Successfully !!"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


exports.updateProduct = async (req, res) => {
    try{
        const user = req.user;
        const {slug, title, desc, price, discountedPrice, stock, category} = req.body;

        if(!slug || !title || !desc || !price || !discountedPrice || !stock || !category){
            return res.status(401).json({
                success: false,
                message: "Product Not Found"
            })
        }
        
        const productInfo = await Product.findOneAndUpdate({slug: slug}, {title: title, desc: desc, price: price, discountedPrice: discountedPrice, stock: stock, category: category});

        return res.status(200).json({
            success: true,
            message: "Products Edited Successfully !!"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


exports.updateOrderStatus = async (req, res) => {
    try{
        const user = req.user;
        const {slug, orderId, status} = req.body;

        if(!slug || !orderId || !status){
            return res.status(401).json({
                success: false,
                message: "Fill All the Details"
            })
        }
        
        const orderDetails = await UserProfile.findOneAndUpdate({
            userId: user.id,
            productorders: {
                $elemMatch: {
                    slug: slug,
                    orderId: orderId
                }
            }
        }, {
            "$set": {
                "productorders.$.status": status
            }
        })

        const userDetails = await UserProfile.findOneAndUpdate(
            {
                "orders.order.orderId": orderId,
                "orders.order.slug": slug
            },
            {
                "$set": {
                    "orders.$.order.$.status": status
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Updated Order Status Successfully Successfully !!",
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}