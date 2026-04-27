const mysql = require('mysql2/promise');

let pool;

if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ai_career_os',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}
pool = global._mysqlPool;

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL connection failed:', error);
    }
};

module.exports = { pool, testConnection };
