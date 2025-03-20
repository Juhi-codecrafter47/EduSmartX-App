const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
});

module.exports = mongoose.model("Course", CourseSchema);
