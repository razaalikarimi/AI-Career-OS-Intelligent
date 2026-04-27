const resumeRepository = require('./resume.repository');
const aiService = require('@/lib/backend/modules/ai/ai.service');
const logger = require('@/lib/backend/shared/logger');
const pdf = require('pdf-parse');

class ResumeService {
    async uploadResume(userId, fileData) {
        logger.info('Service: uploadResume started (Real Processing Mode)');
        
        // 1. Save resume record in DB
        const resume = await resumeRepository.create({
            user_id: userId,
            file_url: 'memory_storage', // In production, upload to S3/Cloudinary
            original_filename: fileData.originalname
        });

        // 2. Process Real Data
        try {
            let resumeText = '';
            
            // Extract text based on file type
            if (fileData.originalname.toLowerCase().endsWith('.pdf')) {
                const data = await pdf(fileData.buffer);
                resumeText = data.text;
                logger.info('PDF text extracted successfully');
            } else {
                resumeText = fileData.buffer.toString('utf-8');
                logger.info('Text/Generic file read successfully');
            }

            if (!resumeText || resumeText.trim().length < 10) {
                throw new Error('Could not extract meaningful text from resume');
            }

            logger.info('Service: Triggering Real AI Analysis...');
            const analysis = await aiService.analyzeResume(resumeText);
            
            logger.info('Service: Saving extracted data to DB...');
            await resumeRepository.saveExtractedData(resume.id, analysis);
            
            logger.info('Service: Updating status to completed...');
            await resumeRepository.updateStatus(resume.id, 'completed');
            
            logger.info('Service: Processing finished');
        } catch (error) {
            logger.error('Service Error during processing:', error);
            await resumeRepository.updateStatus(resume.id, 'failed');
        }

        return resume;
    }

    async getResumeDetails(resumeId) {
        return resumeRepository.findById(resumeId);
    }
}

module.exports = new ResumeService();
