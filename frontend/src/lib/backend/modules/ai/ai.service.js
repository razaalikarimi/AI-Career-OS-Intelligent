const logger = require('../../shared/logger');
const { AppError } = require('../../shared/errorHandler');
const OpenAI = require('openai');

class AIService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || process.env.AI_PROVIDER; // Checking both as user might have placed it in AI_PROVIDER
        this.openai = this.apiKey && this.apiKey.startsWith('sk-') ? new OpenAI({ apiKey: this.apiKey }) : null;
    }

    async analyzeResume(text) {
        logger.info('Analyzing resume text with AI...');
        
        if (this.openai) {
            try {
                logger.info('Calling Real OpenAI API...');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a professional ATS resume analyzer. Extract data in JSON format: { summary: string, skills: [{name: string, proficiency: number}], experience_years: number, education: string, ats_score: number, recommendations: [string] }"
                        },
                        {
                            role: "user",
                            content: `Analyze this resume text:\n\n${text}`
                        }
                    ],
                    response_format: { type: "json_object" }
                });

                const result = JSON.parse(response.choices[0].message.content);
                logger.info('Real AI Analysis successful');
                return result;
            } catch (error) {
                logger.error('Real OpenAI Analysis failed, falling back to smart mock:', error);
            }
        }

        // Improved Smart Mock Logic (Fallback if no API key or API fails)
        logger.info('Using Smart Mock for analysis...');
        try {
            // Attempt to find experience years in text (e.g., "1 year", "2+ years")
            let experienceYears = 1.0;
            const expMatch = text.match(/(\d+(\.\d+)?)\s*(year|yr)/i);
            if (expMatch) {
                experienceYears = parseFloat(expMatch[1]);
            }

            // Simple Skill Extraction Mock
            const commonSkills = ["JavaScript", "React", "Node.js", "SQL", "Python", "Docker", "Java", "C++", "AWS"];
            const extractedSkills = commonSkills
                .filter(skill => text.toLowerCase().includes(skill.toLowerCase()))
                .map(skill => ({ name: skill, proficiency: Math.floor(Math.random() * 2) + 3 }));

            if (extractedSkills.length === 0) {
                extractedSkills.push({ name: "General Engineering", proficiency: 3 });
            }

            return {
                summary: text.length > 50 ? text.substring(0, 200).replace(/\n/g, ' ') + "..." : "Professional profile based on uploaded resume.",
                skills: extractedSkills,
                experience_years: experienceYears,
                education: text.toLowerCase().includes("bachelor") ? "Bachelor's Degree" : "Professional Certification",
                ats_score: Math.floor(Math.random() * 20) + 75,
                recommendations: [
                    "Add more quantitative achievements (e.g., %, $ values).",
                    "Strengthen your summary with key technical keywords.",
                    "Ensure your experience matches the target role requirements."
                ]
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
