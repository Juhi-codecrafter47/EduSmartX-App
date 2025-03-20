const Subject = require('../models/Subject');
const Course = require('../models/Course');

exports.createSubject = async (req, res) => {
    try {
        const { name, courseId } = req.body;

        // Validate input
        if (!name || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Name and courseId are required"
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Create subject
        const subject = await Subject.create({
            name,
            courseId,
            chapters: []
        });

        // Add subject to course
        course.subjects.push(subject._id);
        await course.save();

        res.status(201).json({
            success: true,
            data: subject,
            message: "Subject created successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while creating subject"
        });
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate("courseId", "name");

        res.status(200).json({
            success: true,
            data: subjects
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while fetching subjects"
        });
    }
};


exports.getSubjectDetails = async (req, res) => {
    try {
        const {id} = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        const course = await Subject.findById(id).populate("chapters","name");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: course, 
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "There was an issue while retrieving course details",
            error: e.message,
        });
    }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const subject = await Subject.findById(subjectId)
            .populate("courseId", "name")
            .populate("chapters");

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while fetching subject"
        });
    }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Find subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Remove subject from course
        await Course.findByIdAndUpdate(subject.courseId, {
            $pull: { subjects: subjectId }
        });

        // Delete subject
        await Subject.findByIdAndDelete(subjectId);

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while deleting subject"
        });
    }
};
