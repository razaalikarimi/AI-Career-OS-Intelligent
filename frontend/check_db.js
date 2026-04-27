const { pool } = require('./src/lib/backend/infrastructure/database/mysql');

async function checkDB() {
    try {
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [resumes] = await pool.query('SELECT COUNT(*) as count FROM resumes');
        const [interviews] = await pool.query('SELECT COUNT(*) as count FROM interview_sessions');
        const [skills] = await pool.query('SELECT COUNT(*) as count FROM skills');
        
        console.log('DB Status:');
        console.log('- Users:', users[0].count);
        console.log('- Resumes:', resumes[0].count);
        console.log('- Interviews:', interviews[0].count);
        console.log('- Skills:', skills[0].count);
        
        process.exit(0);
    } catch (error) {
        console.error('DB Check Failed:', error);
        process.exit(1);
    }
}

checkDB();
