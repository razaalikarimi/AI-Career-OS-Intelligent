require('dotenv').config();
const { pool } = require('./src/infrastructure/database/mysql');

async function check() {
    try {
        const [rows] = await pool.query('SELECT id, status FROM resumes ORDER BY created_at DESC LIMIT 5');
        console.log('Latest Resumes:', rows);
        const [data] = await pool.query('SELECT * FROM extracted_resume_data LIMIT 5');
        console.log('Extracted Data:', data);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
