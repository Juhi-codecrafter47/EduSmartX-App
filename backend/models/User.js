const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePic: { type: String },

    // Progress tracking
    progress: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
        completed: { type: Boolean, default: false },
      }
    ],

    // Accuracy tracking per topic
    accuracy: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
        accuracy: { type: Number, default: 50 }, // Initial accuracy set to 50%
        totalQuestionsAttempted: { type: Number, default: 0 }, // Total questions attempted
        totalTestsGiven: { type: Number, default: 0 } // Number of tests taken for the topic
      }
    ],

    // Test History - Now includes correct, wrong, percentage, and score
    testHistory: [
      {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
        score: { type: Number, required: true }, // Score based on correct/(correct + wrong)
        percentage: { type: Number, required: true }, // Correct/Total * 100
        questionsAttempted: { type: Number, required: true },
        correctAnswers: { type: Number, required: true },
        wrongAnswers: { type: Number, required: true }, // New: Track wrong answers
        timeTaken: { type: Number, required: true },
        testDate: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
