const mongoose = require("mongoose");

const QuestionPaperSchema = new mongoose.Schema({
  physics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],  // Physics questions
  chemistry: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // Chemistry questions
  math: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],  // Math questions
  totalMarks: { type: Number, default: 360 },  // Total marks for the paper
  createdAt: { type: Date, default: Date.now },  // Timestamp
});

module.exports = mongoose.model("QuestionPaper", QuestionPaperSchema);
