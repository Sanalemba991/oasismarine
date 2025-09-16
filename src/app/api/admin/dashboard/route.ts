import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching dashboard stats...')

    // Get counts from database
    const [
      totalUsers,
      totalProducts, 
      totalProductInquiries,
      totalContactForms
    ] = await Promise.all([
      (prisma as any).user.count(),
      (prisma as any).product.count(),
      (prisma as any).contact.count(),
      (prisma as any).contactSubmission.count()
    ])

    const stats = {
      totalUsers,
      totalProducts,
      totalContacts: totalProductInquiries + totalContactForms,
      totalProductInquiries,
      totalContactForms,
      pageViews: 0 // Can be implemented later with analytics
    }

    console.log('Dashboard stats:', stats)

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
