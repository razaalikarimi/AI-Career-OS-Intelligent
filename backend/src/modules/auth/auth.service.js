const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const { AppError } = require('../../shared/errorHandler');

class AuthService {
    async register(userData) {
        const existingUser = await authRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await authRepository.create({
            ...userData,
            password: hashedPassword
        });

        return this.generateTokens(user);
    }

    async login(email, password) {
        const user = await authRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Invalid email or password', 401);
        }

        return this.generateTokens(user);
    }

    generateTokens(user) {
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'super-secret-key',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }
}

module.exports = new AuthService();
