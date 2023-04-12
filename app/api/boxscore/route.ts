import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return NextResponse.json({ error: "Please enter a route with a sport such as: '/api/boxscore/nba'" });
}