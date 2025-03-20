const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "name is required"
            });
        }

        const course = await Course.create({ name, subjects: [] });

        res.status(201).json({
            success: true,
            data: course,
            message: "Course created successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Issue while creating course"
        });
    }
};

exports.getCoursedetails = async (req, res) => {
    try {
        const {id} = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        const course = await Course.findById(id).populate("subjects","name");

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