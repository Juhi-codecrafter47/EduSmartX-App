// In your controller file (e.g., controller/syllabusController.js)
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');

exports.getSyllabus = async (req, res) => {
  try {
    // Fetch all courses
    const courses = await Course.find().populate({
      path: 'subjects',
      populate: {
        path: 'chapters',
        populate: {
          path: 'topics',
          model: 'Topic'
        }
      }
    });

    // Structure the syllabus data
    const syllabus = courses.map(course => ({
      courseName: course.name,
      subjects: course.subjects.map(subject => ({
        subjectName: subject.name,
        chapters: subject.chapters.map(chapter => ({
          chapterName: chapter.name,
          topics: chapter.topics.map(topic => topic.name)
        }))
      }))
    }));

    res.status(200).json({
      success: true,
      data: syllabus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching syllabus',
      error: error.message,
    });
  }
};
