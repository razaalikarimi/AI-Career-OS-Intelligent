import { NextResponse } from 'next/server';
import interviewService from '@/lib/backend/modules/interview/interview.service';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log('Violation Log Request:', { sessionId: id, ...body });
        
        const { type, severity, metadata } = body;
        const log = await interviewService.logViolation(id, type, severity, metadata);
        return NextResponse.json({ status: 'success', data: log }, { status: 200 });
    } catch (error) {
        console.error('CRITICAL: Interview violation log error:', error);
        return NextResponse.json({ 
            status: 'error', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
