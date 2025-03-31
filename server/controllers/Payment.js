const { instance } = require("../config/razorpay");
const Product = require("../models/Product");
const User = require("../models/User");
// const mailSender = require("../config/mailSender");
// const { PaymentSuccessEmail, paymentSuccessEmail } = require("../mail/PaymentSuccessEmail");
const mongoose = require("mongoose")
const crypto = require("crypto");
const UserProfile = require("../models/UserProfile");


//Capture the payment and initiate the Razorpay order (Order Create)
exports.capturePayment = async (req, res) => {

    const { total_amount } = req.body;
    console.log(total_amount);
    const userId = req.user.id;

    //Order Create
    const options = {
        // amount: total_amount,
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    // Initiate the payment using Razorpay
    try {
        const paymentResponse = await instance.orders.create(options)
        // console.log("Payment Details: ", paymentResponse)
        return res.status(200).json({
            success: true,
            data: paymentResponse,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order.",
            error: error.message
        })
    }

}

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try{

        const razorpay_order_id = req.body?.orderId
        const razorpay_payment_id = req.body?.paymentId
        const razorpay_signature = req.body?.razorpay_signature
        const cart = req.body?.cart;
        const address = req.body?.address;

        const userId = req.user.id
    
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            // !product ||
            !userId
        ) {
            return res.status(200).json({ 
                success: false, 
                message: "Payment Failed" 
            })
        }

        let orderCart = [];

        cart.map(async (elm) => {
            orderCart.push({
                ...elm,
                orderId: razorpay_order_id,
                status: "Accepted"
            })

            let sellerId = elm.sellerId;
            const sellerProfile = await UserProfile.findOneAndUpdate({userId: sellerId}, {
                $push: {
                    productorders: {
                        orderId: razorpay_order_id,
                        ...elm,
                        address: address,
                        status: "Accepted",
                        userId: userId
                    }
                }
            })

            const productDetails = await Product.findOneAndUpdate({_id: elm._id}, {
                stock: elm.stock - 1,
                purchaseCount: elm.purchaseCount + 1
            })
        })

        const userProfile = await UserProfile.findOneAndUpdate({userId: userId}, {
            $push: {
                orders: {
                    orderId: razorpay_order_id,
                    order: orderCart,
                    address: address
                }
            },
            cart: []
        })
    
        let body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex")
    
        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({ 
                success: true, 
                message: "Payment Verified" 
            })
        }

        return res.status(401).json({ 
            success: false, 
            message: "Payment Failed" 
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not initiate order.",
            error: error.message
        })
    }
}








//Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const { orderId, paymentId, amount } = req.body;
//     // console.log("Success Email: ", orderId, paymentId, amount);

//     const userId = req.user.id;
//     // console.log(req.user);

//     if (!orderId || !paymentId || !amount) {
//         return res.status(400).json({
//             success: false,
//             message: 'Please provide all the details',
//         });
//     }

//     try {
//         const user = await User.findById(userId);
//         // console.log(user);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }
//         await mailSender(
//             user.email,
//             `Payment Received`,
//             paymentSuccessEmail(
//                 `${user.name}`,
//                 amount / 100,
//                 orderId,
//                 paymentId,
//             )
//         )

//         //return res
//         return res.status(200).json({
//             success: true,
//             message: "Mail Send Successfully",
//         })
//     } catch (error) {
//         console.log("Error while sending email", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }