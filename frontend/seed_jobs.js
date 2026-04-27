const { pool } = require('./src/lib/backend/infrastructure/database/mysql');
const { v4: uuidv4 } = require('uuid');

async function seedJobs() {
    try {
        const [jobs] = await pool.query('SELECT COUNT(*) as count FROM jobs');
        if (jobs[0].count === 0) {
            console.log('Seeding real jobs...');
            const sampleJobs = [
                ['Senior Full Stack Engineer', 'Netflix', 'Los Gatos, CA (Remote)', '$250k - $350k', 'full-time'],
                ['Staff Software Engineer', 'Airbnb', 'San Francisco, CA', '$300k - $450k', 'full-time'],
                ['Lead AI Engineer', 'Anthropic', 'Remote', '$280k - $400k', 'full-time']
            ];

            for (const j of sampleJobs) {
                await pool.query(
                    'INSERT INTO jobs (id, title, company, location, salary_range, type) VALUES (?, ?, ?, ?, ?, ?)',
                    [uuidv4(), ...j]
                );
            }
            console.log('Jobs seeded successfully.');
        } else {
            console.log('Jobs table already has data.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedJobs();
