const express = require('express');
const interviewController = require('../modules/interview/interview.controller');

const router = express.Router();

router.post('/sessions', interviewController.createSession);
router.post('/sessions/:id/start', interviewController.startSession);
router.post('/sessions/:id/answer', interviewController.submitAnswer);
router.post('/sessions/:id/violation', interviewController.logViolation);

module.exports = router;
