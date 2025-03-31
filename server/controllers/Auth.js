const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const otpGenerator = require("otp-generator");
const passwordTemplate = require('../mail/ResetPasswordMail');
const mailSender = require('../config/mailSender');
const ResetPassword = require('../models/ResetPassword');
const mongoose = require('mongoose');
const UserProfile = require('../models/UserProfile');

// const axios = require("axios");

exports.userExists = async (req, res) => {
    try{
        const {email} = req.body;

        if(!email){
            return res.status(401).json({
                success: false,
                message: "Fill All the Details"
            })
        }
        
        // If User Already Exists
        let existingUser = await User.findOne({email});
        if(existingUser){
            if(existingUser.verified === false){
                const existingOTP = await OTP.findOne({email: email});
                if(existingOTP){
                    await OTP.findOneAndDelete({email: email});
                }
    
                var otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false
                })
    
                const otpBody = await OTP.create({email: email, otp});
                
                const payload = {
                    id: existingUser._id,
                    type: existingUser.type,
                    email: existingUser.email,
                    username: existingUser.username,
                    verified: existingUser.verified
                }
        
                const jwt_options = {
                    expiresIn: "7d"
                }

                let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);
                return res.status(200).json({
                    success: true,
                    flag: true,
                    message: "OTP Sent Successfully",
                    token: token
                })
            }

            return res.status(401).json({
                success: false,
                message: "User Already Exists with Same Email"
            })
        }

        return res.status(200).json({
            success: true,
            flag: false,
            message: "User Does not Exists",
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

exports.register = async (req, res) => {
    try{
        const {name, email, username, password, confirmPassword, type, profileImg} = req.body;

        if(!name || !email || !username || !password || !confirmPassword || !type || !profileImg){
            return res.status(401).json({
                success: false,
                message: "Fill All the Details"
            })
        }

        if(password!==confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password must be Same"
            })
        }

        let existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User Already Exists with Same Email"
            })
        }

        existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User Already Exists with Same Username"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await User.create({name, email, username, password: hashedPassword, type, profileImg});
        const response1 = await UserProfile.create({userId: response._id});
        const response2 = await User.findOneAndUpdate({email: email}, {profile: response1});

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        const otpBody = await OTP.create({email, otp});

        const payload = {
            id: response2._id,
            type: response2.type,
            email: response2.email,
            username: response2.username,
            verified: response2.verified
        }

        const jwt_options = {
            expiresIn: "7d"
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            token: token
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


exports.resendOTP = async (req, res) => {
    try{
        const user = req.user;

        const existingOTP = await OTP.findOne({email: user.email});
        if(existingOTP){
            await OTP.findOneAndDelete({email: user.email});
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        const otpBody = await OTP.create({email: user.email, otp});
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
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

exports.verifyUser = async (req, res) => {
    try{
        const user = req.user;
        const {otp}  = req.body;

        if(!otp){
            return res.status(401).json({
                success: false,
                message: "Please Enter Valid OTP"
            });
        }
        
        const recentOTP = await OTP.find({email: user.email}).sort({createdAt:-1}).limit(1);
        if(recentOTP.length == 0){
            return res.status(401).json({
                success: false,
                message: "OTP Not Found"
            })
        }
        else if(otp !== recentOTP[0].otp){
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        const response = await User.findOneAndUpdate({email: user.email}, {verified: true});
        await OTP.findOneAndDelete({email: user.email});
        return res.status(200).json({
            success: true,
            message: "OTP Verification Successfully"
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


exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email && !password){
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            })
        }

        let existingUser;
        if(email){
            existingUser = await User.findOne({email});
            if(!existingUser){
                return res.status(401).json({
                    success: false,
                    message: "User Doesn't Exist, Please Register"
                })
            }
        }

        const hashedPassword = await bcrypt.compare(password, existingUser.password);
        if(!hashedPassword){
            return res.status(401).json({
                success: false,
                message: "Invalid Email Id or Password"
            })
        }
        else{
            const payload = {
                id: existingUser._id,
                type: existingUser.type,
                email: existingUser.email,
                // username: existingUser.username,
                verified: existingUser.verified
            }

            const jwt_options = {
                expiresIn: "7d"
            }

            let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

            return res.status(200).json({
                success: true,
                message: "Login Successful",
                token: token,
                verified: existingUser.verified,
                profileImg: existingUser.profileImg,
                type: existingUser.type
            })
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}



// exports.registerWithGoogle = async (req, res) => {
//     try{
//         const {name, email, uid, type, profileImg} = req.body;

//         if(!name || !email || !uid || !type || !profileImg){
//             return res.status(401).json({
//                 success: false,
//                 message: "Fill All the Details"
//             })
//         }

//         let existingUser = await User.findOne({email});
//         if(existingUser){
//             await User.findOneAndUpdate({email: email}, {uid: uid});
//             return res.status(401).json({
//                 success: true,
//                 message: "Google Account Linked Successfully, Try Login !!"
//             })
//         }

//         const username = email;
//         existingUser = await User.findOne({username});
//         if(existingUser){
//             return res.status(401).json({
//                 success: false,
//                 message: "User Already Exists with Same Username"
//             })
//         }

//         const hashedPassword = await bcrypt.hash(uid, 10);

//         const response = await User.create({name, email, uid: uid, username, password: hashedPassword, type, profileImg});
//         const response1 = await UserProfile.create({userId: response._id});
//         const response2 = await User.findOneAndUpdate({email: email}, {profile: response1});

//         var otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false
//         })

//         const otpBody = await OTP.create({email, otp});

//         const payload = {
//             id: response2._id,
//             type: response2.type,
//             email: response2.email,
//             username: response2.username,
//             verified: response2.verified
//         }

//         const jwt_options = {
//             expiresIn: "7d"
//         }

//         let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

//         return res.status(200).json({
//             success: true,
//             message: "User Registered Successfully",
//             token: token
//         })

//     }
//     catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         })
//     }
// }



// exports.loginWithGoogle = async (req, res) => {
//     try{
//         const {email, uid} = req.body;
//         if(!email || !uid){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please Fill All the Details"
//             })
//         }

//         let existingUser = await User.findOne({email, uid});
//         if(!existingUser){
//             return res.status(401).json({
//                 success: false,
//                 message: "This Email is not linked with the Google Account, Please try Signup with Google"
//             })
//         }

//         else{
//             const payload = {
//                 id: existingUser._id,
//                 type: existingUser.type,
//                 email: existingUser.email,
//                 username: existingUser.username,
//                 verified: existingUser.verified
//             }

//             const jwt_options = {
//                 expiresIn: "7d"
//             }

//             let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

//             return res.status(200).json({
//                 success: true,
//                 message: "Login Successful",
//                 token: token,
//                 verified: existingUser.verified,
//                 profileImg: existingUser.profileImg
//             })
//         }
//     }
//     catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         })
//     }
// }

exports.resetPasswordEmail = async (req, res) => {
    try{
        const {email} = req.body;

        if(!email){
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            })
        }

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Email Id is not Registered"
            })
        }

        const existingPassword = await ResetPassword.findOne({email: email});
        if(existingPassword){
            await ResetPassword.findOneAndDelete({email: email});
        }

        var password = otpGenerator.generate(20, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
            specialChars: false
        })

        const response  = await ResetPassword.create({email: email, password: password})

        const password_link = `${process.env.FRONTEND_URL}/auth/resetpass/verify/${user._id}?q=${password}`;
        const mailResponse = await mailSender(email, "Reset Password Mail from Petx", passwordTemplate(password_link));

        return res.status(200).json({
            success: true,
            message: "Reset Password Email Sent Successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

exports.resetPassword = async (req, res) => {
    try{

        const {password, confirmPassword, id, query} = req.body;

        if(!password || !confirmPassword || !id || !query){
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            });
        }

        if(password!==confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            });
        }

        const userID = new mongoose.Types.ObjectId(id);
        const existingUser = await User.findById(userID);
        if(!existingUser){
            return res.status(401).json({
                success: false,
                message: "Invalid User"
            });
        }

        const checkPass = await ResetPassword.find({email: existingUser.email}).sort({createdAt:-1}).limit(1);
        if(checkPass.length==0){
            return res.status(401).json({
                success: false,
                message: "Reset Link is Expired"
            });     
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.findByIdAndUpdate(userID, {password: hashedPassword});
        await ResetPassword.findOneAndDelete({email: existingUser.email, password: query});

        return res.status(200).json({
            success: true,
            message: "Reset Password Successfully"
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}




// exports.checkMobileStatus = async (req, res) => {
//     try{

//         const {mobile} = req.body;

//         if(!mobile){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please Fill All the Details"
//             });
//         }

        
//         const existingUser = await User.findOne({mobile: mobile});
//         if(!existingUser){
//             return res.status(401).json({
//                 success: false,
//                 message: "Mobile is Not Registered!!"
//             });
//         }

//         let chat_id;
//         if(!existingUser.chat_id) chat_id = false;
//         else chat_id = existingUser.chat_id;

//         return res.status(200).json({
//             success: true,
//             username: existingUser.username,
//             chat_id: chat_id,
//             message: "Mobile Status Successfully Fetched!!"
//         });

//     }
//     catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// }


// exports.updateMobileStatus = async (req, res) => {
//     try{

//         const {username, chat_id} = req.body;

//         if(!username || !chat_id){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please Fill All the Details"
//             });
//         }

        
//         const existingUser = await User.findOneAndUpdate({username: username}, {chat_id: chat_id});
//         return res.status(200).json({
//             success: true,
//             message: "Account Linked Successfully"
//         });

//     }
//     catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// }

// exports.getMobileCode = async (req, res) => {
//     try{

//         const {mobile} = req.body;

//         if(!mobile){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please Fill All the Details"
//             });
//         }
        
//         const existingUser = await User.findOne({mobile: mobile});
//         // return res.status(200).json({
//         //     success: true,
//         //     message: "Account Linked Successfully"
//         // });

//         const existingOTP = await OTPMobile.findOne({mobile: mobile});
//         if(existingOTP){
//             await OTPMobile.findOneAndDelete({mobile: mobile});
//         }

//         var otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false
//         })
        
//         const textToSend = `Hi, ${existingUser.name}, Your OTP is: ${otp}`;
//         const otpBody = await OTPMobile.create({mobile: mobile, otp});
//         await axios.post("https://api.telegram.org/bot7675095761:AAEHsi2nNmzgMfSdjfsgPNExrrnXct--gfk/sendMessage", {text: textToSend, chat_id: existingUser.chat_id})

//         return res.status(200).json({
//             success: true,
//             message: "OTP Sent Successfully"
//         })

//     }
//     catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// }



// exports.verifyMobile = async (req, res) => {
//     try{
//         // const user = req.user;
//         const {mobile, otp}  = req.body;

//         if(!otp){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please Enter Valid OTP"
//             });
//         }
        
//         const recentOTP = await OTPMobile.find({mobile: mobile}).sort({createdAt:-1}).limit(1);
//         if(recentOTP.length == 0){
//             return res.status(401).json({
//                 success: false,
//                 message: "OTP Not Found"
//             })
//         }
//         else if(otp !== recentOTP[0].otp){
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid OTP"
//             })
//         }
        
//         const existingUser = await User.findOne({mobile: mobile});
//         const payload = {
//             id: existingUser._id,
//             type: existingUser.type,
//             email: existingUser.email,
//             username: existingUser.username,
//             verified: existingUser.verified
//         }

//         const jwt_options = {
//             expiresIn: "7d"
//         }

//         let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

//         return res.status(200).json({
//             success: true,
//             message: "Login Successful",
//             token: token,
//             verified: existingUser.verified,
//             profileImg: existingUser.profileImg
//         })

//         // const response = await User.findOneAndUpdate({email: user.email}, {verified: true});
//         // await OTP.findOneAndDelete({email: user.email});
//         // return res.status(200).json({
//         //     success: true,
//         //     message: "OTP Verification Successfully"
//         // })
//     }
//     catch(error){
//         // console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         })
//     }
// }