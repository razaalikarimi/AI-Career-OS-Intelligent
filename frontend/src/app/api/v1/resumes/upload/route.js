import { NextResponse } from 'next/server';
import resumeService from '@/lib/backend/modules/resume/resume.service';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('resume');

        if (!file) {
            return NextResponse.json({ status: 'fail', message: 'No file uploaded' }, { status: 400 });
        }

        const userId = 'user-123-placeholder';
        const fileData = {
            originalname: file.name,
            buffer: Buffer.from(await file.arrayBuffer())
        };

        const result = await resumeService.uploadResume(userId, fileData);

        return NextResponse.json({
            status: 'success',
            message: 'Resume upload successful. Processing started.',
            data: {
                resumeId: result.id,
                status: 'pending'
            }
        }, { status: 202 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
