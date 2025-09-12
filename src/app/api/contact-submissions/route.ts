import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all contact form submissions
export async function GET(request: NextRequest) {
  try {
    // Fetch all contact submissions
    const contactSubmissions = await (prisma as any).contactSubmission.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(contactSubmissions);

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new contact submission (public endpoint for contact form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for tracking
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create contact submission
    const contactSubmission = await (prisma as any).contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
        priority: 'medium',
        source: 'contact_form',
        ipAddress: ip,
        userAgent: userAgent
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Contact submission received successfully',
        id: contactSubmission.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
