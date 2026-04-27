const pool = require('../../infrastructure/database/mysql').pool;
const aiService = require('../ai/ai.service');
const logger = require('../../shared/logger');
const { v4: uuidv4 } = require('uuid');

class EvaluationWorker {
    async evaluateSession(sessionId) {
        logger.info(`Starting evaluation for session: ${sessionId}`);
        
        try {
            // 1. Get all questions and answers
            const [responses] = await pool.query(
                'SELECT question, answer FROM interview_feedback WHERE interview_session_id = ?',
                [sessionId]
            );
            
            // 2. Get proctoring logs
            const [logs] = await pool.query(
                'SELECT violation_type, severity FROM proctoring_logs WHERE session_id = ?',
                [sessionId]
            );
            
            // 3. Combine data for AI analysis
            const interviewData = {
                transcript: responses,
                violations: logs
            };
            
            // 4. Call AI Service for final scoring
            const evaluation = await aiService.generateFinalInterviewReport(interviewData);
            
            // 5. Save metrics
            const id = uuidv4();
            await pool.query(
                `INSERT INTO interview_metrics 
                (id, session_id, technical_score, communication_score, confidence_score, proctoring_risk_score, ai_feedback) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    id, 
                    sessionId, 
                    evaluation.technical_score, 
                    evaluation.communication_score, 
                    evaluation.confidence_score, 
                    evaluation.risk_score, 
                    evaluation.feedback
                ]
            );
            
            // 6. Mark session as completed
            await pool.query(
                'UPDATE interview_sessions SET status = ? WHERE id = ?',
                ['completed', sessionId]
            );
            
            logger.info(`Evaluation completed for session: ${sessionId}`);
        } catch (error) {
            logger.error(`Evaluation failed for session ${sessionId}:`, error);
        }
    }
}

module.exports = new EvaluationWorker();
