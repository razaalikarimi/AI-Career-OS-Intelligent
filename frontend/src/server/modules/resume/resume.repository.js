const { pool } = require('../../infrastructure/database/mysql');
const { v4: uuidv4 } = require('uuid');

class ResumeRepository {
    async create(data) {
        const id = uuidv4();
        await pool.query(
            'INSERT INTO resumes (id, user_id, file_url, original_filename, status) VALUES (?, ?, ?, ?, ?)',
            [id, data.user_id, data.file_url, data.original_filename, 'pending']
        );
        return { id, ...data };
    }

    async updateStatus(id, status) {
        await pool.query('UPDATE resumes SET status = ? WHERE id = ?', [status, id]);
    }

    async saveExtractedData(resumeId, analysis) {
        const id = uuidv4();
        await pool.query(
            'INSERT INTO extracted_resume_data (id, resume_id, raw_json, summary, experience_years, education_level) VALUES (?, ?, ?, ?, ?, ?)',
            [id, resumeId, JSON.stringify(analysis.skills), analysis.summary, analysis.experience_years, analysis.education]
        );
    }

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT r.*, e.summary, e.experience_years, e.education_level, e.raw_json 
             FROM resumes r 
             LEFT JOIN extracted_resume_data e ON r.id = e.resume_id 
             WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }
}

module.exports = new ResumeRepository();
