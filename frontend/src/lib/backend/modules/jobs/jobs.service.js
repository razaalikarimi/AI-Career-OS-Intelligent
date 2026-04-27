const { pool } = require('../../infrastructure/database/mysql');
const externalJobsService = require('@/lib/backend/services/jobs/external-jobs.service');

class JobsService {
    async getAllJobs() {
        try {
            const [rows] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.error('Jobs Fetch Error:', error);
            // If DB fails, return some data at least
            return [];
        }
    }

    async searchExternalJobs(query, location) {
        return await externalJobsService.searchJobs(query || 'Software Engineer', location);
    }
}

module.exports = new JobsService();
