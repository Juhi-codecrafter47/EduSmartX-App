const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  notes: { type: String },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

module.exports = mongoose.model("Topic", TopicSchema);
