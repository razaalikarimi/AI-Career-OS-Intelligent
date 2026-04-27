import { NextResponse } from 'next/server';
import jobsService from '@/lib/backend/modules/jobs/jobs.service';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const location = searchParams.get('location');

        let jobs;
        if (query) {
            jobs = await jobsService.searchExternalJobs(query, location);
        } else {
            jobs = await jobsService.getAllJobs();
        }

        return NextResponse.json({
            status: 'success',
            data: jobs
        });
    } catch (error) {
        console.error('Jobs API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch jobs. Check database connection.'
        }, { status: 500 });
    }
}
