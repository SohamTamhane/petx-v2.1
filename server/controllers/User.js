const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/UserProfile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Pets = require("../models/Pets");

exports.userDetails = async (req, res) => {
  try {
    const user = req.user;
    const userDetails = await User.findOne(
      { email: user.email },
      { password: false }
    )
      .populate("profile")
      .populate({
        path: "profile",
        populate: ["products", "cart", "pets"],
      });
    return res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully !!",
      user: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.becomeSeller = async (req, res) => {
  try {
    const user = req.user;
    if (user.type === "Seller") {
      return res.status(401).json({
        success: false,
        message: "User is Already Seller",
      });
    }

    const userDetails = await User.findOneAndUpdate(
      { email: user.email },
      { type: "Seller" }
    );

    const payload = {
      id: user.id,
      type: "Seller",
      email: user.email,
      username: user.username,
      verified: user.verified,
    };

    const jwt_options = {
      expiresIn: "7d",
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

    return res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully !!",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.becomeCaretaker = async (req, res) => {
  try {
    const user = req.user;
    if (user.type === "Caretaker") {
      return res.status(401).json({
        success: false,
        message: "User is Already Caretaker",
      });
    }

    const userDetails = await User.findOneAndUpdate(
      { email: user.email },
      { type: "Caretaker" }
    );

    const payload = {
      id: user.id,
      type: "Caretaker",
      email: user.email,
      username: user.username,
      verified: user.verified,
    };

    const jwt_options = {
      expiresIn: "7d",
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, jwt_options);

    return res.status(200).json({
      success: true,
      message: "User Details Updated Successfully !!",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { cost } = req.body;
    const user = req.user;

    // if(typeof cost !== 'number' || cost < 0){
    //     return res.status(400).json({
    //         success: false,
    //         message: "Please provide a valid cost"
    //     })
    // }

    const userDetails = await User.findOneAndUpdate(
      { _id: user.id },
      { cost: cost }
    );
    return res.status(200).json({
      success: true,
      message: "User Details Updated Successfully !!",
      user: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
      error: error.message,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const user = req.user;
    const { name, address, pincode, mobile } = req.body;
    const userDetails = await User.findOne({ email: user.email });
    const profileDetails = await UserProfile.findOneAndUpdate(
      { userId: userDetails._id },
      {
        address: {
          name: name,
          address: address,
          pincode: pincode,
          mobile: mobile,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Address Updated Successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.addPet = async (req, res) => {
  try {
    const user = req.user;
    const { name, age, gender, category, price, sale } = req.body;
    const imgs = req.files.img;

    if (!name || !age || !gender || !category || !price || !sale) {
      return res.status(401).json({
        success: false,
        message: "Please Fill All the Details!!",
      });
    }

    let imageUrl = [];
    if (imgs.length === undefined) {
      let uploadedPetImages = await uploadImageToCloudinary(
        imgs,
        process.env.FOLDER_NAME
      );
      imageUrl.push(uploadedPetImages.secure_url);
    } else {
      for (let i = 0; i < imgs.length; i++) {
        let uploadedPetImages = await uploadImageToCloudinary(
          imgs[i],
          process.env.FOLDER_NAME
        );
        imageUrl.push(uploadedPetImages.secure_url);
      }
    }

    const respone = await Pets.create({
      name: name,
      age: age,
      gender: gender,
      category: category,
      price: price,
      sale: sale,
      img: imageUrl,
      userId: user.id,
    });
    const userInfo = await UserProfile.findOneAndUpdate(
      { userId: user.id },
      {
        $push: {
          pets: respone,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Pet Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const user = req.user;
    const { name, age, gender, category, price, sale } = req.body;

    if (!name || !age || !gender || !category || !price || !sale) {
      return res.status(401).json({
        success: false,
        message: "Pet is Not Found!!",
      });
    }

    const petInfo = await Pets.findOneAndUpdate({
      name: name,
      age: age,
      gender: gender,
      category: category,
      price: price,
      sale: sale,
    });

    return res.status(200).json({
      success: true,
      message: "Pet Edited Successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deletePet = async (req, res) => {
  try {
    // const petId = req.params.id;

    const { petId } = req.body;
    const user = req.user;

    const deletedPet = await Pets.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found!",
      });
    }

    const response = await UserProfile.updateMany(
      { userId: user.id },
      {
        $pull: {
          pets: petId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Pet deleted successfully!",
      data: deletedPet,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
      error: error.message,
    });
  }
};
