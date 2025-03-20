const Question = require("../models/Question");
const QuestionPaper = require("../models/QuestionPaper");

exports.generateQuestionPaper = async (req, res) => {
  try {
    const { topics } = req.body; // Topics provided in the request body

    // Define how many questions are required per subject
    const questionCounts = { physics: 30, chemistry: 30, math: 30 };

    let questionsBySubject = { physics: [], chemistry: [], math: [] };

    for (const subject of Object.keys(topics)) {
      if (topics[subject].length > 0) {
        let allQuestions = [];

        // Fetch questions for each topic
        for (const topicId of topics[subject]) {
          const topicQuestions = await Question.find({ topics: topicId }).limit(questionCounts[subject]); 
          allQuestions.push(...topicQuestions);
        }

        // Shuffle the questions to make selection random
        allQuestions = allQuestions.sort(() => Math.random() - 0.5);

        // Select up to the required number of questions
        questionsBySubject[subject] = allQuestions.slice(0, questionCounts[subject]);
      }
    }

    // Check if at least one subject has questions
    if (!questionsBySubject.physics.length && !questionsBySubject.chemistry.length && !questionsBySubject.math.length) {
      return res.status(400).json({ success: false, message: "No questions available for the given topics." });
    }

    // Save the new question paper
    const newPaper = new QuestionPaper({
      physics: questionsBySubject.physics.map(q => q._id), // Store only IDs
      chemistry: questionsBySubject.chemistry.map(q => q._id),
      math: questionsBySubject.math.map(q => q._id),
    });

    await newPaper.save();

    res.status(201).json({ success: true, paper: newPaper });
  } catch (error) {
    console.error("Error generating question paper:", error);
    res.status(500).json({ success: false, message: "Server error while generating paper." });
  }
};