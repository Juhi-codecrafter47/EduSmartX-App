const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            (req.headers.authorization || '').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // Decode token without verifying
        const decodedWithoutVerify = jwt.decode(token);
        console.log("Decoded Token (without verification):", decodedWithoutVerify);

        if (!decodedWithoutVerify) {
            return res.status(401).json({
                success: false,
                message: "Invalid token structure",
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRETE);
            console.log("Decoded Token (verified):", decoded);
            req.user = decoded;
            next();
        } catch (e) {
            console.error("Token verification error:", e.message);
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
                error: e.message,
            });
        }
    } catch (e) {
        console.error("Unexpected error:", e.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};



// ✅ Fixed role check: "student" (previously used undefined variable `user`)
exports.isStudent = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only",
            });
        }
        next();
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};

// ✅ Fixed admin role check
exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.accountType !== "admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};
