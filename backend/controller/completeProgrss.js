const User = require("../models/User");

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
