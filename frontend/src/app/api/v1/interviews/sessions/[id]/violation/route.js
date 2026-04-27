import { NextResponse } from 'next/server';
const interviewService = require('../../../../../../../lib/backend/modules/interview/interview.service');

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const { type, severity, metadata } = await request.json();
        const log = await interviewService.logViolation(id, type, severity, metadata);
        return NextResponse.json({ status: 'success', data: log }, { status: 200 });
    } catch (error) {
        console.error('Interview violation log error:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
