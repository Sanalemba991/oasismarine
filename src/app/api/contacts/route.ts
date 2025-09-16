import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      phone, 
      subject, 
      message, 
      priority = 'medium',
      productId,
      productName,
      productImage 
    } = body

    console.log('Creating contact with data:', {
      userId: (session.user as any).id,
      name: session.user.name,
      email: session.user.email,
      phone,
      subject,
      message,
      priority,
      productId,
      productName,
      productImage
    })

    // Create contact entry
    const contact = await (prisma as any).contact.create({
      data: {
        name: session.user.name || '',
        email: session.user.email || '',
        phone: phone || '',
        subject,
        message,
        priority,
        status: 'new',
        userId: (session.user as any).id,
        productId,
        productName,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('Contact created successfully:', contact)

    return NextResponse.json({ 
      success: true, 
      message: 'Contact message sent successfully',
      contact 
    })

  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Fetching contacts...')
    
    // Fetch all contacts with detailed logging
    const contacts = await (prisma as any).contact.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Found contacts:', contacts.length)
    console.log('Contacts data:', contacts)

    return NextResponse.json(contacts)

  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: (error as any).message },
      { status: 500 }
    )
  }
}
