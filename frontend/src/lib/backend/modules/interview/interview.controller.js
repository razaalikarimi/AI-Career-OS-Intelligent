const interviewService = require('./interview.service');
const logger = require('../../shared/logger');

class InterviewController {
    async createSession(req, res, next) {
        try {
            const { jobRoleId } = req.body;
            const userId = 'user-123-placeholder'; // In real app, from req.user
            const session = await interviewService.createSession(userId, jobRoleId);
            res.status(201).json({ status: 'success', data: session });
        } catch (error) {
            next(error);
        }
    }

    async startSession(req, res, next) {
        try {
            const { id } = req.params;
            const firstQuestion = await interviewService.startSession(id);
            res.status(200).json({ status: 'success', data: firstQuestion });
        } catch (error) {
            next(error);
        }
    }

    async submitAnswer(req, res, next) {
        try {
            const { id } = req.params;
            const { questionId, answer } = req.body;
            await interviewService.submitAnswer(id, questionId, answer);
            
            // Get next question
            const nextQuestion = await interviewService.generateNextQuestion(id, answer);
            res.status(200).json({ status: 'success', data: nextQuestion });
        } catch (error) {
            next(error);
        }
    }

    async logViolation(req, res, next) {
        try {
            const { id } = req.params;
            const { type, severity, metadata } = req.body;
            const log = await interviewService.logViolation(id, type, severity, metadata);
            res.status(200).json({ status: 'success', data: log });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InterviewController();
