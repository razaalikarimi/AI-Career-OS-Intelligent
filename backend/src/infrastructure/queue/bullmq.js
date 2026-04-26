const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');
const logger = require('../../shared/logger');

const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 0, // Don't hang if Redis is down
    enableOfflineQueue: false, // Fail fast
});

connection.on('error', (err) => {
    logger.error('Redis Connection Error:', err.message);
});

const resumeQueue = new Queue('resume-processing', { connection });

const createWorker = (name, processor) => {
    const worker = new Worker(name, processor, { connection });

    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed with error: ${err.message}`);
    });

    return worker;
};

module.exports = { resumeQueue, createWorker };
