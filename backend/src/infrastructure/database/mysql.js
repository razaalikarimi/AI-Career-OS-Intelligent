const mysql = require('mysql2/promise');
const logger = require('../../shared/logger');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_career_os',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        logger.error('MySQL connection failed:', error);
        process.exit(1);
    }
};

module.exports = { pool, testConnection };
