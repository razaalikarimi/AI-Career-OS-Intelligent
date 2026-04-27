import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ status: 'API is running', version: '2.0.0 (Pure Next.js)' });
}
