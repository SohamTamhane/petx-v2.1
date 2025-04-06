const Pets = require("../models/Pets");


exports.petCategory = async (req, res) => {
    try{
        const { category } = req.body;

        const petDetails = await Pets.find({category: category});

        return res.status(200).json({
            success: true,
            message: "Pet Fetched Successfully!!",
            pets: petDetails 
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}