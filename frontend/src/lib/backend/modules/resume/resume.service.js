const resumeRepository = require('./resume.repository');
const aiService = require('@/lib/backend/modules/ai/ai.service');
const logger = require('@/lib/backend/shared/logger');

// Fix for pdf-parse in Next.js environment
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {};
}
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
                logger.info('Starting PDF extraction (with fallback)...');
                try {
                    // 5 second timeout
                    const pdfPromise = pdf(fileData.buffer, { pagerender: () => "" });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 5000)
                    );
                    
                    const data = await Promise.race([pdfPromise, timeoutPromise]);
                    resumeText = data.text;
                    logger.info('PDF text extracted successfully');
                } catch (e) {
                    logger.warn('PDF extraction failed or timed out, using fallback');
                    resumeText = "Fallback: Resume processing skipped due to parsing timeout.";
                }
            } else {
                resumeText = fileData.buffer.toString('utf-8');
            }

            if (!resumeText || resumeText.trim().length < 5) {
                logger.warn('Warning: Extracted text is empty or too short');
                resumeText = "Could not extract text. Please check file format.";
            }

            logger.info('Service: Starting AI Analysis...');
            const analysis = await aiService.analyzeResume(resumeText);
            logger.info('Service: AI Analysis finished.');
            
            logger.info('Service: Saving to DB...');
            await resumeRepository.saveExtractedData(resume.id, analysis);
            
            logger.info('Service: Setting status to completed.');
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
