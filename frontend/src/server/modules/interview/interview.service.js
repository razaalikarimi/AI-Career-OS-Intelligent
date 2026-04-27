const { v4: uuidv4 } = require('uuid');
const pool = require('../../infrastructure/database/mysql').pool;
const aiService = require('../ai/ai.service');

class InterviewService {
    async createSession(userId, jobRoleId) {
        const id = uuidv4();
        await pool.query(
            'INSERT INTO interview_sessions (id, user_id, job_role_id, status) VALUES (?, ?, ?, ?)',
            [id, userId, jobRoleId, 'scheduled']
        );
        return { id, userId, jobRoleId, status: 'scheduled' };
    }

    async startSession(sessionId) {
        await pool.query(
            'UPDATE interview_sessions SET status = ? WHERE id = ?',
            ['ongoing', sessionId]
        );
        // Generate first question using AI based on job role
        return await this.generateNextQuestion(sessionId);
    }

    async generateNextQuestion(sessionId, previousAnswer = null) {
        // Logic to get job role and history
        const [session] = await pool.query(
            'SELECT job_role_id FROM interview_sessions WHERE id = ?',
            [sessionId]
        );
        
        // AI Integration to generate question
        const question = await aiService.generateInterviewQuestion(session[0].job_role_id, previousAnswer);
        
        // Save question to history
        const questionId = uuidv4();
        await pool.query(
            'INSERT INTO interview_feedback (id, interview_session_id, question) VALUES (?, ?, ?)',
            [questionId, sessionId, question]
        );
        
        return { questionId, question };
    }

    async logViolation(sessionId, type, severity, metadata = null) {
        const id = uuidv4();
        await pool.query(
            'INSERT INTO proctoring_logs (id, session_id, violation_type, severity, metadata) VALUES (?, ?, ?, ?, ?)',
            [id, sessionId, type, severity, metadata ? JSON.stringify(metadata) : null]
        );
        return { id, type, severity };
    }

    async submitAnswer(sessionId, questionId, answer) {
        await pool.query(
            'UPDATE interview_feedback SET answer = ? WHERE id = ? AND interview_session_id = ?',
            [answer, questionId, sessionId]
        );
        
        // Trigger async evaluation of the answer (optional real-time)
        return { status: 'recorded' };
    }
}

module.exports = new InterviewService();
