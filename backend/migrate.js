require('dotenv').config();
const { pool } = require('./src/infrastructure/database/mysql');
const fs = require('fs');
const path = require('path');
const logger = require('./src/shared/logger');

const migrate = async () => {
    try {
        logger.info('Starting Database Migration...');
        const sqlFile = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        
        // Disable FK checks
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');

        // Drop tables in reverse order of dependencies to avoid FK issues
        const dropQueries = [
            'DROP TABLE IF EXISTS applications',
            'DROP TABLE IF EXISTS interview_feedback',
            'DROP TABLE IF EXISTS interview_sessions',
            'DROP TABLE IF EXISTS learning_progress',
            'DROP TABLE IF EXISTS study_plans',
            'DROP TABLE IF EXISTS job_requirements',
            'DROP TABLE IF EXISTS job_roles',
            'DROP TABLE IF EXISTS user_skills',
            'DROP TABLE IF EXISTS skills',
            'DROP TABLE IF EXISTS extracted_resume_data',
            'DROP TABLE IF EXISTS resumes',
            'DROP TABLE IF EXISTS users',
            'DROP TABLE IF EXISTS jobs',
            'DROP TABLE IF EXISTS notifications'
        ];

        for (let query of dropQueries) {
            await pool.query(query);
        }

        const queries = sqlFile
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        for (let query of queries) {
            await pool.query(query);
        }

        // Add a default placeholder user for development
        // Insert placeholder user
        await pool.query('INSERT IGNORE INTO users (id, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)', 
            ['user-123-placeholder', 'ali@example.com', 'hashed_pw', 'Ali Raza', 'user']);

        // Insert mock job roles
        await pool.query('INSERT IGNORE INTO job_roles (id, title, description) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)', 
            ['1', 'Senior Frontend Engineer', 'React and Next.js expert',
             '2', 'Backend Systems Architect', 'Node.js and Distributed Systems expert',
             '3', 'Full Stack Developer', 'End-to-end product developer']);

        logger.info('Migration Completed Successfully!');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        logger.info('Migration Completed Successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
