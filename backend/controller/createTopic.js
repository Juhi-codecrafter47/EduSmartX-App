const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { PDFDocument } = require('pdf-lib');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const cloudinary = require('../config/cloudinary');

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

// Compress PDF
async function compressPDF(fileBuffer) {
    try {
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
        return compressedPdfBytes;
    } catch (error) {
        console.error("PDF Compression Error:", error);
        return fileBuffer; 
    }
}

// Upload PDF to Cloudinary
async function uploadToCloudinary(filePath) {
    return await cloudinary.uploader.upload(filePath, { 
        folder: "notes", 
        resource_type: "raw"
    });
}

// Create a topic with PDF upload
exports.createTopic = async (req, res) => {
    try {
        const { name, chapterId } = req.body;
        const file = req.files?.pdfFile; 

        if (!name || !chapterId) {
            return res.status(400).json({
                success: false,
                message: "Name and chapterId are required"
            });
        }

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found"
            });
        }

        let pdfUrl = "";
        if (file) {
            if (!file.mimetype.includes("pdf")) {
                return res.status(400).json({
                    success: false,
                    message: "Only PDF files are allowed"
                });
            }

            // Compress PDF
            const compressedBuffer = await compressPDF(file.data);

            // Save the compressed PDF to a temp file
            const tempFilePath = path.join(__dirname, '../temp/compressed.pdf');
            await writeFileAsync(tempFilePath, compressedBuffer);

            // Upload to Cloudinary
            const uploadResponse = await uploadToCloudinary(tempFilePath);
            pdfUrl = uploadResponse.secure_url;

            // Delete temp file
            await unlinkAsync(tempFilePath);
        }

        const topic = await Topic.create({
            name,
            chapterId,
            notes: pdfUrl, 
            questions: []
        });

        chapter.topics.push(topic._id);
        await chapter.save();

        res.status(201).json({
            success: true,
            data: topic,
            message: "Topic created successfully with PDF"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while creating topic"
        });
    }
};

// Upload notes (PDF) for a topic
exports.uploadNotes = async (req, res) => {
    try {
        const { topicId } = req.body;
        const file = req.files?.pdfFile;

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        if (!file.mimetype.includes("pdf")) {
            return res.status(400).json({ success: false, message: "Only PDF files are allowed" });
        }

        // Compress PDF
        const compressedBuffer = await compressPDF(file.data);

        // Save the compressed PDF to a temp file
        const tempFilePath = path.join(__dirname, '../temp/compressed.pdf');
        await writeFileAsync(tempFilePath, compressedBuffer);

        // Upload to Cloudinary
        const uploadResponse = await uploadToCloudinary(tempFilePath);

        // Delete temp file
        await unlinkAsync(tempFilePath);

        // Update topic with new PDF link
        const topic = await Topic.findByIdAndUpdate(
            topicId,
            { notes: uploadResponse.secure_url },
            { new: true }
        );

        if (!topic) {
            return res.status(404).json({ success: false, message: "Topic not found" });
        }

        res.status(200).json({ success: true, message: "PDF uploaded successfully", data: topic });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Error uploading PDF" });
    }
};


// Get all topics
exports.getAllTopics = async (req, res) => {
    try {
        // const topics = await Topic.find().populate("chapterId", "name");
        const topics = await Topic.find({},"name");

        res.status(200).json({
            success: true,
            data: topics
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while fetching topics"
        });
    }
};

// Get topic by ID
exports.getTopicById = async (req, res) => {
    try {
        const { topicId } = req.params;

        const topic = await Topic.findById(topicId)
            .populate("chapterId", "name")
            .populate("questions");

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        res.status(200).json({
            success: true,
            data: topic
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while fetching topic"
        });
    }
};

// Delete topic
exports.deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        // Find topic
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        // Remove topic from chapter
        await Chapter.findByIdAndUpdate(topic.chapterId, {
            $pull: { topics: topicId }
        });

        // Delete topic
        await Topic.findByIdAndDelete(topicId);

        res.status(200).json({
            success: true,
            message: "Topic deleted successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while deleting topic"
        });
    }
};

exports.getTotalTopics = async (req, res) => {
  try {
    const totalTopics = await Topic.countDocuments();

    res.status(200).json({
      success: true,
      message: "Total topics retrieved successfully.",
      data:totalTopics
    });
  } catch (error) {
    console.error("Error fetching total topics:", error);
    res.status(500).json({ success: false, message: "Server error while fetching topics." });
  }
};
