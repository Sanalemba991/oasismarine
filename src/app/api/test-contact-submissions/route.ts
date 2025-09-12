import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testing ContactSubmission model...')

    // Test 1: Count contact submissions
    const count = await (prisma as any).contactSubmission.count()
    console.log('✅ ContactSubmission count:', count)

    // Test 2: Find all contact submissions
    const submissions = await (prisma as any).contactSubmission.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    })
    console.log('✅ Find ContactSubmissions:', submissions.length)

    // Test 3: Create a test submission (if none exist)
    let testSubmission = null
    if (count === 0) {
      testSubmission = await (prisma as any).contactSubmission.create({
        data: {
          name: 'Test Contact',
          email: 'test@example.com',
          subject: 'Test Contact Form',
          message: 'This is a test contact form submission',
          status: 'new',
          priority: 'medium',
          source: 'contact_form',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log('✅ Created test submission:', testSubmission.id)
    }

    return NextResponse.json({
      success: true,
      tests: {
        count: count,
        findMany: submissions.length,
        create: testSubmission ? 'Created test submission' : 'Skipped (submissions exist)',
      },
      sample: submissions.slice(0, 2),
      message: 'All ContactSubmission methods are working!'
    })

  } catch (error) {
    console.error('❌ Error testing ContactSubmissions:', error)
    return NextResponse.json({
      success: false,
      error: (error as any).message,
      message: 'ContactSubmission methods failed'
    }, { status: 500 })
  }
}
