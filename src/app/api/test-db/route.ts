import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the database connection by trying to connect and fetch a simple query
    await prisma.$connect();
    
    // Try to get user count as a test query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      message: 'Database connection successful',
      userCount,
      url: process.env.DATABASE_URL?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') // Hide credentials
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
