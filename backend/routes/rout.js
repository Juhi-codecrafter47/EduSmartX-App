const express =require('express');
const { signup, login, getAllUsers } = require('../controller/Auth');
const { createCourse, getCoursedetails } = require('../controller/createCourse');
const { createSubject, getSubjectDetails } = require('../controller/createSubject');
const { createChapter } = require('../controller/createChapter');
const { createTopic, getTotalTopics, getAllTopics } = require('../controller/createTopic');
const { createQuestionWithImage } = require('../controller/createQuestion');
const { getQuestionsForTest } = require('../controller/getQuestions');
const { createTest } = require('../controller/createTest');
const { submitTest } = require('../controller/submissionTest');
const { chatBot } = require('../controller/gemini');
const { updateProgress } = require('../controller/completeProgrss');
const { sendBattleRequest } = require('../controller/createBattle');
const router =express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/course/create',createCourse);
router.get('/course',getCoursedetails);
router.post('/subject/create',createSubject);
router.post('/chapter/create',createChapter);
router.get('/chapter',getSubjectDetails);
router.post('/topic/create',createTopic);
router.post('/question/create',createQuestionWithImage);
router.get('/questions/test',getQuestionsForTest);
router.post('/test/create',createTest);
router.post('/chatBot',chatBot);
router.post('/completedtopic',updateProgress);
router.get('/getTotalTopics',getTotalTopics);
router.get('/users',getAllUsers);
router.get('/topics',getAllTopics);
router.post('/sendRequest',sendBattleRequest);
module.exports=router;