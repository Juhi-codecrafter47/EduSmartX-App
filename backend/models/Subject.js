const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }]
});

module.exports = mongoose.model("Subject", SubjectSchema);
