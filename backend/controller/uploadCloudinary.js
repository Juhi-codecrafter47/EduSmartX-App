const { cloudinary } = require('../config/cloudinary'); 

async function uploadFileToCloudinary(file, folder) {
    console.log("Cloudinary object:", cloudinary); // 🔍 Debugging
    console.log("Uploader object:", cloudinary.uploader); // 🔍 Check if uploader exists

    if (!cloudinary.uploader) {
        throw new Error("❌ Cloudinary uploader is NOT initialized!");
    }

    if (!file || !file.tempFilePath) {
        throw new Error("❌ File path is missing!");
    }

    const options = { folder };
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
module.exports = {uploadFileToCloudinary};
