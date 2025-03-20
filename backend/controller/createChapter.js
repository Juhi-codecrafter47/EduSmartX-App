const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');

exports.createChapter = async (req, res) => {
    try {
        const { name, subjectId } = req.body;

        // Validate input
        if (!name || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "Name and subjectId are required"
            });
        }

        // Check if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Create chapter
        const chapter = await Chapter.create({
            name,
            subjectId,
            topics: []
        });

        // Add chapter to subject
        subject.chapters.push(chapter._id);
        await subject.save();

        res.status(201).json({
            success: true,
            data: chapter,
            message: "Chapter created successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while creating chapter"
        });
    }
};

// Get all chapters
exports.getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find().populate("subjectId", "name");

        res.status(200).json({
            success: true,
            data: chapters
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while fetching chapters"
        });
    }
};

// Get chapter by ID
exports.getChapterById = async (req, res) => {
    try {
        const { chapterId } = req.params;

        const chapter = await Chapter.findById(chapterId)
            .populate("subjectId", "name")
            .populate("topics");

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found"
            });
        }

        res.status(200).json({
            success: true,
            data: chapter
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while fetching chapter"
        });
    }
};

// Delete chapter
exports.deleteChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;

        // Find chapter
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found"
            });
        }

        // Remove chapter from subject
        await Subject.findByIdAndUpdate(chapter.subjectId, {
            $pull: { chapters: chapterId }
        });

        // Delete chapter
        await Chapter.findByIdAndDelete(chapterId);

        res.status(200).json({
            success: true,
            message: "Chapter deleted successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while deleting chapter"
        });
    }
};
