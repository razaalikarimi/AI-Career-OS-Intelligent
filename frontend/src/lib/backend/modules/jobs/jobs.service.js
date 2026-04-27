const { pool } = require('../../infrastructure/database/mysql');

class JobsService {
    async getAllJobs() {
        try {
            const [rows] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.error('Jobs Fetch Error:', error);
            throw error;
        }
    }
}

module.exports = new JobsService();
