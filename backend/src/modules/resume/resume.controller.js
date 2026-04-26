const resumeService = require('./resume.service');
const logger = require('../../shared/logger');

class ResumeController {
    async upload(req, res, next) {
        try {
            console.log('Controller: Upload started');
            if (!req.file) {
                return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
            }

            const userId = 'user-123-placeholder'; 
            console.log('Controller: Calling resumeService.uploadResume');
            
            const result = await resumeService.uploadResume(userId, req.file);
            console.log('Controller: uploadResume finished, result ID:', result.id);

            res.status(202).json({
                status: 'success',
                message: 'Resume upload successful. Processing started.',
                data: {
                    resumeId: result.id,
                    status: 'pending'
                }
            });
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message,
                stack: error.stack
            });
        }
    }

    async getStatus(req, res, next) {
        try {
            const { id } = req.params;
            const result = await resumeService.getResumeDetails(id);
            
            if (!result) {
                return res.status(404).json({ status: 'fail', message: 'Resume not found' });
            }

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ResumeController();
