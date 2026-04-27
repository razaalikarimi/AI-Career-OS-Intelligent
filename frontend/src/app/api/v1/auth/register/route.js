import { NextResponse } from 'next/server';
const authService = require('../../../../lib/backend/modules/auth/auth.service');

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await authService.register(body);
        return NextResponse.json({
            status: 'success',
            data: result
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        }, { status: error.status || 500 });
    }
}
