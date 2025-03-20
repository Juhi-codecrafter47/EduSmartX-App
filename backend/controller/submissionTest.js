const Test = require("../models/Test");
const User = require("../models/User");
const Question = require("../models/Question");

exports.submitTest = async (req, res) => {
  try {
    const { testId, userResponses } = req.body;

    if (!testId || !userResponses || userResponses.length === 0) {
      return res.status(400).json({ success: false, message: "Test ID and responses are required." });
    }
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });
    if (test.isCompleted) return res.status(400).json({ success: false, message: "Test already submitted." });

    const user = await User.findById(test.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    let correctCount = 0, wrongCount = 0, totalAttempted = 0;
    let topicAccuracy = {};

    for (let response of userResponses) {
      const question = await Question.findById(response.questionId);
      if (!question) {
        console.warn(`Question not found: ${response.questionId}`);
        continue;
      }

      if (!question.topics || question.topics.length === 0) {
        console.warn(`Missing topics for question: ${response.questionId}`);
        continue;
      }

      const timeTaken = response.timeTaken || 0;
      let accuracyScore = 0;

      // ✅ Convert to same data type
      const selectedAnswer = response.selectedAnswer.toString();
      const correctAnswer = question.correctAnswer.toString();

      console.log(`Question ID: ${response.questionId}, Selected: ${selectedAnswer}, Correct: ${correctAnswer}`);

      const isCorrect = selectedAnswer === correctAnswer;
      if (isCorrect) {
        correctCount++;
        if (timeTaken <= question.timeLimit) accuracyScore = 1;
        else if (timeTaken <= 1.5 * question.timeLimit) accuracyScore = 0.5;
        else if (timeTaken <= 2 * question.timeLimit) accuracyScore = 0.3;
      } else {
        wrongCount++;
      }

      totalAttempted++;

      // ✅ Update accuracy for each topic
      for (let topicId of question.topics) {
        topicId = topicId.toString();
        if (!topicAccuracy[topicId]) {
          topicAccuracy[topicId] = { correct: 0, total: 0, accuracyPoints: 0 };
        }
        topicAccuracy[topicId].total += 1;
        topicAccuracy[topicId].accuracyPoints += accuracyScore;
        if (isCorrect) topicAccuracy[topicId].correct += 1;
      }

      if (Array.isArray(test.questions)) {
        let testQuestion = test.questions.find(q => q.questionId.toString() === response.questionId);
        if (testQuestion) {
          testQuestion.userAnswer = selectedAnswer;
          testQuestion.isCorrect = isCorrect;
          testQuestion.timeTaken = timeTaken;
          testQuestion.accuracyScore = accuracyScore;
        }
      }
    }

    let score = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;
    let percentage = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;

    test.score = score;
    test.totalQuestionsAttempted = totalAttempted;
    test.isCompleted = true;
    test.endTime = new Date();
    await test.save();

    // ✅ Update topic-wise accuracy in User model
    for (let topicId in topicAccuracy) {
      let { correct, total, accuracyPoints } = topicAccuracy[topicId];
      let newAccuracy = (accuracyPoints / total) * 100;

      let accuracyEntry = user.accuracy.find(acc => acc.topicId.toString() === topicId);
      if (accuracyEntry) {
        let updatedAccuracy = ((accuracyEntry.accuracy * accuracyEntry.totalTestsGiven) + (newAccuracy * total)) 
                              / (accuracyEntry.totalTestsGiven + total);
        accuracyEntry.accuracy = updatedAccuracy;
        accuracyEntry.totalTestsGiven += total;
        accuracyEntry.totalQuestionsAttempted += total;
      } else {
        user.accuracy.push({
          topicId,
          accuracy: newAccuracy,
          totalTestsGiven: total,
          totalQuestionsAttempted: total
        });
      }
    }

    user.testHistory.push({
      testId: test._id,
      topicId: test.topics?.[0] || null,
      score: score,
      questionsAttempted: totalAttempted,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      percentage: percentage,
      timeTaken: (test.endTime - test.startTime) / 1000,
      testDate: new Date()
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Test submitted successfully.",
      data: {
        correct: correctCount,
        wrong: wrongCount,
        total: totalAttempted,
        score: score.toFixed(2),
        percentage: percentage.toFixed(2)
      }
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ success: false, message: "Server error while submitting test." });
  }
};