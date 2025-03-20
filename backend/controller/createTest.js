const User = require('../models/User');
const Test = require('../models/Test');
const { getQuestions } = require('./getQuestions'); // ✅ Corrected import

exports.createTest = async (req, res) => {
    try {
        const { userId, topicIds } = req.body;

        if (!userId || !Array.isArray(topicIds) || topicIds.length === 0) {
            return res.status(400).json({ success: false, message: "User ID and topics are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // ✅ Corrected function call
        const result = await getQuestions(userId, topicIds);
        if (!result.success) {
            return res.status(404).json({ success: false, message: result.error });
        }

        const testQuestions = result.data.map(q => ({
            questionId: q._id,
            correctOption: q.correctAnswer || null, // ✅ Ensure correct field exists
            imageUrl: q.imageUrl || null, // ✅ Handle missing image URLs
            difficulty: q.difficulty || "Unknown", // ✅ Default difficulty if missing
            topics: q.topics || [], // ✅ Default empty array if missing
            timeLimit: q.timeLimit || 30 // ✅ Default time limit (if missing)
        }));

        const test = await Test.create({
            userId,
            topics: topicIds,
            questions: testQuestions,
            startTime: new Date()
        });

        res.status(201).json({ success: true, data: test, message: "Test created successfully." });
    } catch (error) {
        console.error("❌ Error creating test:", error);
        res.status(500).json({ success: false, message: "Server error while creating test." });
    }
};
