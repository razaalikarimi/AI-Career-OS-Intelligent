const resumeRepository = require('./resume.repository');
const aiService = require('../ai/ai.service');
const logger = require('../../shared/logger');

class ResumeService {
    async uploadResume(userId, fileData) {
        console.log('Service: uploadResume started (Direct Mode)');
        
        // 1. Save resume record in DB
        const resume = await resumeRepository.create({
            user_id: userId,
            file_url: 'memory_storage',
            original_filename: fileData.originalname
        });

        // 2. Process Directly (Bypass Queue for stability)
        try {
            console.log('Service: Processing AI Analysis...');
            const analysis = await aiService.analyzeResume("Direct processing text...");
            
            console.log('Service: Saving extracted data...');
            await resumeRepository.saveExtractedData(resume.id, analysis);
            
            console.log('Service: Updating status to completed...');
            await resumeRepository.updateStatus(resume.id, 'completed');
            
            console.log('Service: All steps finished');
        } catch (error) {
            console.error('Service Error during processing:', error);
            await resumeRepository.updateStatus(resume.id, 'failed');
        }

        return resume;
    }

    async getResumeDetails(resumeId) {
        return resumeRepository.findById(resumeId);
    }
}

module.exports = new ResumeService();
