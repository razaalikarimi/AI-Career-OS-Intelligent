import { NextResponse } from 'next/server';
import interviewService from '@/lib/backend/modules/interview/interview.service';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const firstQuestion = await interviewService.startSession(id);
        return NextResponse.json({ status: 'success', data: firstQuestion }, { status: 200 });
    } catch (error) {
        console.error('Interview start error:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
