const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
      }
    ], // Multiple topics in one test

    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true
        },
        correctOption: {
          type: Number,
          required: true
        }, // Stores correct option to compare during result calculation
        userAnswer: {
          type: Number
        }, // User's selected option (updated after test submission)
        isCorrect: {
          type: Boolean,
          default: false
        }, // Indicates if the user's answer was correct
        timeTaken: {
          type: Number,
          default: 0
        }, // Time taken by the user to answer this question
        accuracyScore: {
          type: Number,
          default: 0
        } // Accuracy score based on timing rules
      }
    ],

    startTime: {
      type: Date,
      default: Date.now
    }, // When the test started

    endTime: {
      type: Date
    }, // When the test ended (Updated upon completion)

    score: {
      type: Number,
      default: 0
    }, // Total score of the test (updated after evaluation)

    totalQuestionsAttempted: {
      type: Number,
      default: 0
    }, // Total number of questions attempted in this test

    isCompleted: {
      type: Boolean,
      default: false
    } // Marks whether the test is completed
  },
  { timestamps: true }
);

// Automatically update `endTime` when `isCompleted` is set to true
TestSchema.pre("save", function (next) {
  if (this.isCompleted && !this.endTime) {
    this.endTime = new Date();
  }
  next();
});

module.exports = mongoose.model("Test", TestSchema);
