const logger = require('@/lib/backend/shared/logger');

class ExternalJobsService {
    constructor() {
        this.appId = process.env.ADZUNA_APP_ID;
        this.appKey = process.env.ADZUNA_APP_KEY;
        this.baseUrl = 'https://api.adzuna.com/v1/api/jobs/in/search/1'; // 'in' for India
    }

    async searchJobs(query, location = 'India') {
        if (!this.appId || !this.appKey) {
            logger.warn('Adzuna API credentials missing. Returning mock external data.');
            return this.getMockExternalJobs();
        }

        try {
            const url = `${this.baseUrl}?app_id=${this.appId}&app_key=${this.appKey}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&content-type=application/json`;
            const response = await fetch(url);
            const data = await response.json();
            
            return data.results.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                salary_range: job.salary_min ? `${job.salary_min} - ${job.salary_max}` : 'Not disclosed',
                description: job.description,
                url: job.redirect_url,
                type: job.contract_type || 'Full-time',
                source: 'Adzuna / External'
            }));
        } catch (error) {
            logger.error('External Job Search Failed:', error);
            return this.getMockExternalJobs();
        }
    }

    getMockExternalJobs() {
        return [
            {
                id: 'ext-1',
                title: 'Senior Software Engineer (Real-time Feed)',
                company: 'Google India',
                location: 'Bangalore, India',
                salary_range: '₹30L - ₹50L',
                description: 'Build large-scale distributed systems. Experience with Go, Java, or C++ required.',
                url: 'https://careers.google.com',
                type: 'Full-time',
                source: 'External Search'
            },
            {
                id: 'ext-2',
                title: 'Frontend Lead',
                company: 'Zomato',
                location: 'Gurgaon, India',
                salary_range: '₹25L - ₹45L',
                description: 'Leading the frontend architecture for our consumer application using React and Next.js.',
                url: 'https://zomato.com/careers',
                type: 'Full-time',
                source: 'External Search'
            }
        ];
    }
}

module.exports = new ExternalJobsService();
