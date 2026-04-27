const logger = require('../../shared/logger');
const { AppError } = require('../../shared/errorHandler');

class AIService {
    constructor() {
        this.provider = process.env.AI_PROVIDER || 'openai';
    }

    async analyzeResume(text) {
        logger.info('Analyzing resume text with AI...');
        
        // If real AI is configured, use it here
        if (process.env.OPENAI_API_KEY) {
            // Real AI logic would go here
            logger.info('Real AI Analysis triggered (stub)');
        }

        // Improved Smart Mock Logic
        try {
            // Attempt to find experience years in text (e.g., "1 year", "2+ years")
            let experienceYears = 1.0;
            const expMatch = text.match(/(\d+(\.\d+)?)\s*(year|yr)/i);
            if (expMatch) {
                experienceYears = parseFloat(expMatch[1]);
            }

            // Simple Skill Extraction Mock
            const commonSkills = ["JavaScript", "React", "Node.js", "SQL", "Python", "Docker"];
            const extractedSkills = commonSkills
                .filter(skill => text.toLowerCase().includes(skill.toLowerCase()))
                .map(skill => ({ name: skill, proficiency: 4 }));

            if (extractedSkills.length === 0) {
                extractedSkills.push({ name: "General Engineering", proficiency: 3 });
            }

            return {
                summary: text.length > 50 ? text.substring(0, 150) + "..." : "Professional profile based on uploaded resume.",
                skills: extractedSkills,
                experience_years: experienceYears,
                education: text.toLowerCase().includes("bachelor") ? "Bachelor's Degree" : "Professional Certification",
                ats_score: Math.floor(Math.random() * 20) + 70 // Random score between 70-90
            };
        } catch (error) {
            logger.error('AI Resume Analysis failed:', error);
            throw new AppError('AI processing failed', 500);
        }
    }

    async generateStudyPlan(skillGap) {
        logger.info('Generating study plan based on skill gap...');
        return [
            { topic: "Advanced SQL Optimization", status: "not_started" },
            { topic: "Microservices Architecture Patterns", status: "not_started" },
            { topic: "Redis Caching Strategies", status: "not_started" }
        ];
    }

    async generateInterviewQuestion(roleId, previousAnswer = null) {
        logger.info('Generating AI interview question...');
        // In production, this would use the prompt:
        // "Based on role ${roleId} and candidate's last answer ${previousAnswer}, ask the next relevant technical or HR question."
        
        const questions = [
            "Tell me about a challenging technical problem you solved recently.",
            "How do you handle state management in a large-scale React application?",
            "What is your approach to optimizing slow database queries?",
            "Explain the difference between optimistic and pessimistic locking.",
            "How do you ensure security in a distributed microservices architecture?"
        ];
        
        return questions[Math.floor(Math.random() * questions.length)];
    }

    async evaluateInterviewResponse(question, answer) {
        logger.info('Evaluating interview response...');
        return {
            score: 8,
            feedback: "Great explanation of the CAP theorem, but could have used more real-world examples.",
            suggestion: "Try to mention specific trade-offs you've made in past projects."
        };
    }

    async generateFinalInterviewReport(data) {
        logger.info('Generating final AI interview report...');
        // Simulate complex AI analysis
        return {
            technical_score: 85,
            communication_score: 90,
            confidence_score: 80,
            risk_score: 5, // Based on violations
            feedback: "The candidate showed strong proficiency in React and System Design. Communication was clear, though some hesitation was noted on database sharding questions. No significant proctoring violations detected."
        };
    }
}

module.exports = new AIService();
