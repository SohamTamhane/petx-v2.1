const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try{
        const token = req?.cookies?.token || req?.body?.token || req?.header("Authorization")?.replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing!!"
            })
        }
        // Verify the Token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success: false,
                message: "Invalid Token!!"
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifing the Token"
        })
    }
}

exports.isSeller = async (req, res, next) => {
    try{
        const user = req.user;
        if(user.type=="Seller"){
            next();
        }
        else{
            return res.status(401).json({
                success: false,
                message: "User is not a Seller"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifing the Token"
        })
    }
}

exports.isCaretaker = async (req, res, next) =>{
    try{
        const user = req.user;
        if (user.type == "Caretaker") {
            next();
        }
        else{
            return res.status(401).json({
                success: false,
                message: "User is not a Caretaker"
            })
        }
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message: "Something went wrong while verifing the token"
        })
    }
}