const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  correctAnswer: { type: String, required: true }, // Store correct answer as text
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  timeLimit: { type: Number, required: true }
});

module.exports = mongoose.model("Question", QuestionSchema);
