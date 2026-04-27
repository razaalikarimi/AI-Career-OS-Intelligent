require('dotenv').config();
const express = require('express');

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
    process.exit(1);
});
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const { globalErrorHandler } = require('./shared/errorHandler');
const logger = require('./shared/logger');
const { testConnection } = require('./infrastructure/database/mysql');

const authRoutes = require('./api/auth.routes');
const resumeRoutes = require('./api/resume.routes');
const interviewRoutes = require('./api/interview.routes');
const apiLimiter = require('./shared/rateLimiter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.get('/', (req, res) => res.status(200).json({ status: 'API is running', version: '1.0.0' }));

// Real-time
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        logger.info(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});

// Error Handling
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testConnection();
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            server.listen(PORT, () => {
                logger.info(`Server running on port ${PORT}`);
            });
        }
    } catch (err) {
        logger.error('Failed to start server:', err);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
