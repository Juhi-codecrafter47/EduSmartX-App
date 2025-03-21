const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');
const { uploadFileToCloudinary } = require('./uploadCloudinary');

function isFileTypeSupported(supportedTypes, type) {
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
        if (!hashedPassword) {
            return res.status(500).json({
                success: false,
                message: "Issue while hashing password",
            });
        }

        let profilePic = null;
        if (file) {
            const supportedTypes = ["jpeg", "jpg", "png"];
            const fileType = file.name.split('.').pop().toLowerCase();

            if (!isFileTypeSupported(supportedTypes, fileType)) {
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist, sign up first",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
            expiresIn: "2h",
        });

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully",
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Issue while logging in, try again later",
            error: e.message,
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'email name');

        res.status(200).json({
            success: true,
            data: users,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};
exports.getUserData = async (req, res) => {
    try {
        // Extract the token from the request headers
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Verify and decode the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRETE); // Ensure JWT_SECRET is correct in .env
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }

        const userId = decoded.id; // Extract user ID from decoded token
        console.log("Decoded userId:", userId);

        const user = await User.findById(userId)
            .populate('progress.topicId')
            .populate('accuracy.topicId')
            .populate('testHistory.testId')
            .populate('testHistory.topicId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message,
        });
    }
};
