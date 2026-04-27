import { NextResponse } from 'next/server';
const interviewService = require('../../../../../lib/backend/modules/interview/interview.service');

export async function POST(request) {
    try {
        const body = await request.json();
        const { jobRoleId } = body;
        const userId = 'user-123-placeholder';
        const session = await interviewService.createSession(userId, jobRoleId);
        return NextResponse.json({ status: 'success', data: session }, { status: 201 });
    } catch (error) {
        console.error('Interview session creation error:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
