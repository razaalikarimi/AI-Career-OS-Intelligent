const { createWorker } = require('../../infrastructure/queue/bullmq');
const aiService = require('../ai/ai.service');
const resumeRepository = require('./resume.repository');
const logger = require('../../shared/logger');

const resumeWorker = createWorker('resume-processing', async (job) => {
    const { resumeId, filePath } = job.data;
    
    try {
        logger.info(`Processing resume: ${resumeId}`);
        
        // 1. Update status to processing
        await resumeRepository.updateStatus(resumeId, 'processing');

        // 2. Simulate file reading (in reality, use pdf-parse or similar)
        const resumeText = "Simulated resume text from file...";

        // 3. Call AI Orchestration layer
        const analysis = await aiService.analyzeResume(resumeText);

        // 4. Save extracted data
        await resumeRepository.saveExtractedData(resumeId, analysis);

        // 5. Update status to completed
        await resumeRepository.updateStatus(resumeId, 'completed');

        logger.info(`Successfully processed resume: ${resumeId}`);
    } catch (error) {
        logger.error(`Error processing resume ${resumeId}:`, error);
        await resumeRepository.updateStatus(resumeId, 'failed');
        throw error; // Let BullMQ handle retries
    }
});

module.exports = resumeWorker;
