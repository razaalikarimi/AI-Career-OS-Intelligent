import { NextResponse } from 'next/server';
const resumeService = require('../../../../../lib/backend/modules/resume/resume.service');

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const result = await resumeService.getResumeDetails(id);
        
        if (!result) {
            return NextResponse.json({ status: 'fail', message: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            data: result
        }, { status: 200 });
    } catch (error) {
        console.error('Status fetch error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
