const User = require('../models/User');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');

exports.updateProgress = async (req, res) => {
  try {
    const { userId, topicId } = req.body;

    if (!userId || !topicId) {
      return res.status(400).json({ success: false, message: "User ID and Topic ID are required." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Check if topic exists in progress
    const progressEntry = user.progress.find(p => p.topicId.toString() === topicId);

    if (progressEntry) {
      // If topic already exists, mark it as completed
      progressEntry.completed = true;
    } else {
      // If topic does not exist, add it
      user.progress.push({ topicId, completed: true });
    }

    await user.save();

    res.status(200).json({ success: true, message: "Progress updated successfully!" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, message: "Server error while updating progress." });
  }
};

exports.removeFromComplete = async (req, res) => {
  try {
    const { userId, topicId } = req.body;

    if (!userId || !topicId) {
      return res.status(400).json({ success: false, message: "User ID and Topic ID are required." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Find the topic in progress
    const progressEntry = user.progress.find(p => p.topicId.toString() === topicId);

    if (progressEntry) {
      // Remove the topic from progress
      user.progress = user.progress.filter(p => p.topicId.toString() !== topicId);
      await user.save();
      return res.status(200).json({ success: true, message: "Topic removed from completed progress." });
    } else {
      return res.status(404).json({ success: false, message: "Topic not found in progress." });
    }
  } catch (error) {
    console.error("Error removing from completed progress:", error);
    res.status(500).json({ success: false, message: "Server error while removing progress." });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Fetch course
    const course = await Course.findById(courseId).populate("subjects");
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    let overallCompleted = 0;
    let overallTotal = 0;

    const subjectProgress = [];

    for (let subject of course.subjects) {
      let subjectCompleted = 0;
      let subjectTotal = 0;

      // Fetch chapters for the subject
      const chapters = await Chapter.find({ subjectId: subject._id }).populate("topics");

      for (let chapter of chapters) {
        subjectTotal += chapter.topics.length;
        overallTotal += chapter.topics.length;

        // Count completed topics
        chapter.topics.forEach(topic => {
          if (user.progress.some(p => p.topicId.toString() === topic._id.toString() && p.completed)) {
            subjectCompleted++;
            overallCompleted++;
          }
        });
      }

      // Avoid division by zero
      const subjectPercentage = subjectTotal ? ((subjectCompleted / subjectTotal) * 100).toFixed(2) : "0.00";

      subjectProgress.push({
        subjectId: subject._id,
        subjectName: subject.name,
        completedPercentage: subjectPercentage,
      });
    }

    // Overall course progress
    const overallPercentage = overallTotal ? ((overallCompleted / overallTotal) * 100).toFixed(2) : "0.00";

    res.status(200).json({
      success: true,
      overallProgress: overallPercentage,
      subjectWiseProgress: subjectProgress
    });

  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ success: false, message: "Server error while fetching progress." });
  }
};