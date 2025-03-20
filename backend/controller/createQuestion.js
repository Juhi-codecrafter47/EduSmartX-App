const Question = require('../models/Question');
const Topic = require('../models/Topic');
const cloudinary = require('../config/cloudinary');

const {uploadFileToCloudinary}=require('./uploadCloudinary');


exports.createQuestionWithImage = async (req, res) => {
    try {
        const { correctAnswer, difficulty, topics, timeLimit } = req.body;
        const file = req.files?.imageFile;

        if (!file || !correctAnswer || !difficulty || !topics || topics.length === 0 || !timeLimit) {
            return res.status(400).json({
                success: false,
                message: "All fields are required. Ensure an image is uploaded and the correct answer is provided."
            });
        }

        const topicIds = Array.isArray(topics) ? topics : [topics];

        const existingTopics = await Topic.find({ _id: { $in: topicIds } });

        if (existingTopics.length !== topicIds.length) {
            return res.status(400).json({
                success: false,
                message: "Some topics do not exist. Please provide valid topic IDs."
            });
        }

        const uploadResponse = await uploadFileToCloudinary(file);
        if (!uploadResponse.secure_url) {
            return res.status(500).json({ success: false, message: "Error uploading image to Cloudinary" });
        }

        const question = await Question.create({
            imageUrl: uploadResponse.secure_url,
            correctAnswer,
            difficulty,
            topics: topicIds,
            timeLimit
        });

        await Topic.updateMany(
            { _id: { $in: topicIds } },
            { $push: { questions: question._id } }
        );

        res.status(201).json({
            success: true,
            data: question,
            message: "Question image uploaded successfully with correct answer"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while uploading question image"
        });
    }
};
