const { pool } = require('../../infrastructure/database/mysql');
const { v4: uuidv4 } = require('uuid');

class AuthRepository {
    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    async create(userData) {
        const id = uuidv4();
        const { email, password, full_name, role = 'user' } = userData;
        await pool.query(
            'INSERT INTO users (id, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [id, email, password, full_name, role]
        );
        return { id, email, full_name, role };
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT id, email, full_name, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = new AuthRepository();
