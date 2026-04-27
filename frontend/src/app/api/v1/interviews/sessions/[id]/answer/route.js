import { NextResponse } from 'next/server';
const interviewService = require('../../../../../../lib/backend/modules/interview/interview.service');

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const { questionId, answer } = await request.json();
        await interviewService.submitAnswer(id, questionId, answer);
        
        const nextQuestion = await interviewService.generateNextQuestion(id, answer);
        return NextResponse.json({ status: 'success', data: nextQuestion }, { status: 200 });
    } catch (error) {
        console.error('Interview answer submission error:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
