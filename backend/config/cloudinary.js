const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });
        console.log("✅ Cloudinary connected successfully!");
    } catch (e) {
        console.error("❌ Error connecting to Cloudinary:", e);
    }
};

module.exports = { connectCloudinary, cloudinary }; // ✅ Export both properly
