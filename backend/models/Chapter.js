const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }]
});

module.exports = mongoose.model("Chapter", ChapterSchema);
