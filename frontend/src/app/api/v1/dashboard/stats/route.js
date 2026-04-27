import { NextResponse } from 'next/server';
import dashboardService from '@/lib/backend/modules/dashboard/dashboard.service';

export async function GET() {
    try {
        const userId = 'user-123-placeholder'; // In production, get from auth session
        const stats = await dashboardService.getStats(userId);
        return NextResponse.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch real-time stats. Please check database connection.'
        }, { status: 500 });
    }
}
