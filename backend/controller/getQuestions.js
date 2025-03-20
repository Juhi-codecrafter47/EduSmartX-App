const mongoose = require("mongoose");
const User = require("../models/User");
const Question = require("../models/Question");
const Topic = require("../models/Topic");

exports.getQuestionsForTest = async (req, res) => {
    try {
        const { userId, topicIds } = req.body;

        // ✅ Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, data: "User does not exist" });
        }

        // ✅ Convert topicIds to ObjectId
        const topicObjectIds = topicIds.map(id => new mongoose.Types.ObjectId(id));

        // ✅ Check if topics exist
        const existingTopics = await Topic.find({ _id: { $in: topicObjectIds } });
        const foundTopicIds = existingTopics.map(topic => topic._id.toString());
        const invalidTopics = topicIds.filter(id => !foundTopicIds.includes(id));

        if (invalidTopics.length > 0) {
            return res.status(400).json({ success: false, data: "Some topics are invalid" });
        }

        // ✅ Create accuracy map
        let accuracyMap = {};
        user.accuracy.forEach(acc => {
            accuracyMap[acc.topicId.toString()] = acc.accuracy;
        });

        // ✅ Categorize topics
        let lowAccuracyTopics = topicObjectIds.filter(id => (accuracyMap[id] || 50) <= 40);
        let mediumAccuracyTopics = topicObjectIds.filter(id => (accuracyMap[id] || 50) > 40 && (accuracyMap[id] || 50) <= 70);
        let highAccuracyTopics = topicObjectIds.filter(id => (accuracyMap[id] || 50) > 70);

        console.log("Low Accuracy Topics:", lowAccuracyTopics);
        console.log("Medium Accuracy Topics:", mediumAccuracyTopics);
        console.log("High Accuracy Topics:", highAccuracyTopics);

        // ✅ Fetch questions correctly
        const fetchQuestions = async (topics, difficulty, limit) => {
            if (topics.length === 0) return [];
            console.log(`Fetching ${difficulty} questions for topics:`, topics);
            let questions = await Question.find({ topics: { $in: topics }, difficulty }).limit(limit);
            console.log(`Found ${questions.length} ${difficulty} questions`);
            return questions;
        };

        // ✅ Get questions
        let easyQuestions = await fetchQuestions(lowAccuracyTopics, "Easy", 7);
        let mediumQuestions = await fetchQuestions(mediumAccuracyTopics, "Medium", 5);
        let hardQuestions = await fetchQuestions(highAccuracyTopics, "Hard", 4);

        // ✅ Combine results
        const questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

        console.log("Total questions retrieved:", questions.length);
        res.json({ success: true, data: questions });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, data: "Server Error" });
    }
};


exports.getQuestions = async (userId, topicIds) => {
    try {
        if (!userId || !topicIds || topicIds.length === 0) {
            return { success: false, error: "User ID and topics are required." };
        }

        // ✅ Check if user exists
        const user = await User.findById(userId);
        if (!user) return { success: false, error: "User not found." };

        // ✅ Convert topicIds to ObjectId
        const topicObjectIds = topicIds.map(id => new mongoose.Types.ObjectId(id));

        // ✅ Check if topics exist
        const existingTopics = await Topic.find({ _id: { $in: topicObjectIds } });
        const foundTopicIds = existingTopics.map(topic => topic._id.toString());
        const invalidTopics = topicIds.filter(id => !foundTopicIds.includes(id));

        if (invalidTopics.length > 0) {
            return { success: false, error: `Invalid topics found: ${invalidTopics.join(", ")}` };
        }

        // ✅ Create accuracy map (default to 0 if topic not found in user.accuracy)
        let accuracyMap = {};
        user.accuracy = user.accuracy || []; // Ensure accuracy field exists
        topicObjectIds.forEach(id => {
            let userAcc = user.accuracy.find(acc => acc.topicId.toString() === id.toString());
            accuracyMap[id.toString()] = userAcc ? userAcc.accuracy : 50;
        });

        console.log("📌 Accuracy Map:", accuracyMap);

        // ✅ Categorize topics based on accuracy
        let lowAccuracyTopics = topicObjectIds.filter(id => accuracyMap[id.toString()] <= 40);
        let mediumAccuracyTopics = topicObjectIds.filter(id => accuracyMap[id.toString()] > 40 && accuracyMap[id.toString()] <= 70);
        let highAccuracyTopics = topicObjectIds.filter(id => accuracyMap[id.toString()] > 70);

        console.log("📌 Topic Categorization:", {
            Low: lowAccuracyTopics,
            Medium: mediumAccuracyTopics,
            High: highAccuracyTopics
        });

        // ✅ Fetch questions function (Ensures accuracy-based difficulty selection)
        const fetchQuestions = async (topics, difficulty, limit) => {
            if (topics.length === 0) return [];

            console.log(`📌 Fetching ${difficulty} questions for topics:`, topics);
            const questions = await Question.find({
                topics: { $in: topics },
                difficulty: difficulty
            }).limit(limit);

            console.log(`✅ Found ${questions.length} ${difficulty} questions`);
            return questions;
        };

        // ✅ Define limits for each category
        const EASY_QUESTION_LIMIT = 7;
        const MEDIUM_QUESTION_LIMIT = 5;
        const HARD_QUESTION_LIMIT = 4;

        // ✅ Fetch questions based on difficulty
        const easyQuestions = await fetchQuestions(lowAccuracyTopics, "Easy", EASY_QUESTION_LIMIT);
        const mediumQuestions = await fetchQuestions(mediumAccuracyTopics, "Medium", MEDIUM_QUESTION_LIMIT);
        const hardQuestions = await fetchQuestions(highAccuracyTopics, "Hard", HARD_QUESTION_LIMIT);

        // ✅ Combine all fetched questions
        let finalQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

        if (finalQuestions.length === 0) {
            return { success: false, error: "No questions available for the selected topics." };
        }

        return { success: true, data: finalQuestions };

    } catch (error) {
        console.error("❌ Error fetching questions:", error);
        return { success: false, error: "Server error while fetching questions." };
    }
};

