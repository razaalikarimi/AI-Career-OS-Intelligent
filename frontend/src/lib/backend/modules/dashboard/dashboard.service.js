const { pool } = require('../../infrastructure/database/mysql');

class DashboardService {
    async getStats(userId) {
        try {
            const [resumeCount] = await pool.query('SELECT COUNT(*) as count FROM resumes WHERE user_id = ?', [userId]);
            const [interviewCount] = await pool.query('SELECT COUNT(*) as count FROM interview_sessions WHERE user_id = ?', [userId]);
            const [skillCount] = await pool.query('SELECT COUNT(*) as count FROM user_skills WHERE user_id = ?', [userId]);
            
            // Get latest activities
            const [activities] = await pool.query(`
                (SELECT 'Resume Uploaded' as text, created_at as time, status FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 2)
                UNION
                (SELECT 'Interview Session' as text, created_at as time, status FROM interview_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 2)
                ORDER BY time DESC LIMIT 5
            `, [userId, userId]);

            return {
                resumes: resumeCount[0].count,
                interviews: interviewCount[0].count,
                skills: skillCount[0].count,
                activities: activities.map(a => ({
                    text: a.text,
                    time: a.time,
                    status: a.status
                }))
            };
        } catch (error) {
            console.error('Dashboard Stats Error:', error);
            throw error;
        }
    }
}

module.exports = new DashboardService();
