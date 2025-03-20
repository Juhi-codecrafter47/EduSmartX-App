const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');
const {uploadFileToCloudinary}=require('./uploadCloudinary');

function isFileTypeSupport(supportedTypes, type) {
    return supportedTypes.includes(type);
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const file = req.files?.imageFile;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if(!hashedPassword){
            return res.status(400)
            .json({
                success:false,
                data:"issue while hashing password"
            })
        }

        let profilePic = null;
        if (file) {
            const supportedTypes = ["jpeg", "jpg", "png"];
            const fileType = file.name.split('.').pop().toLowerCase();

            if (!isFileTypeSupport(supportedTypes, fileType)) {
                return res.status(400).json({
                    success: false,
                    message: "File format not supported",
                });
            }

            const response = await uploadFileToCloudinary(file, "fileUpload");
            profilePic = response.secure_url;
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            profilePic: profilePic,
        });

        res.status(201).json({
            success: true,
            data: user,
            message: "User created successfully",
        });

    } catch (e) {
        console.error("Error while creating user:", e);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400)
            .json({
                success:false,
                data:"All Fields Required"
            })
        }

        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(400)
            .json({
                success:false,
                data:"user not exist, signup first"
            })
        }

        const comaparepassword=await bcrypt.compare(password,user.password);
        if(!comaparepassword){
            return res.status(400)
            .json({
                success:false,
                data:"password is incorrect"
            })
        }
        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }
        const token=jwt.sign(payload,process.env.JWT_SECRETE,{
            expiresIn:"2h"
        });
        user.token=token;

        const options={
            expires:new Date(Date.now() +3*24*60*60*100),
            httpOnly:true
        }

        res.cookie("token",token,options).status(200)
        .json({
            success:true,
            token,
            user,
            message:"logged in successfully"
        })
    }
    catch(e){
        res.status(500)
        .json({
            success:false,
            data:"issue while login ,try again later",
            message:e.message
        })
    }
}



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({},'email name'); 

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users",data:error.message });
    }
};