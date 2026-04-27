import { NextResponse } from 'next/server';
const authService = require('../../../../../lib/backend/modules/auth/auth.service');

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        const result = await authService.login(email, password);
        return NextResponse.json({
            status: 'success',
            data: result
        }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        }, { status: error.status || 500 });
    }
}
