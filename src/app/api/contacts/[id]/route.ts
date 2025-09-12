import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PATCH request for contact ID:', params.id)
    
    const body = await request.json()
    const { status, priority } = body
    
    console.log('Update data:', { status, priority })

    // Validate input
    if (!status && !priority) {
      return NextResponse.json(
        { error: 'Status or priority is required' },
        { status: 400 }
      )
    }

    // Update contact - using lowercase 'contact'
    const updatedContact = await (prisma as any).contact.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        repliedAt: status === 'replied' ? new Date() : undefined,
        updatedAt: new Date()
      }
    })

    console.log('Contact updated successfully:', updatedContact.id)
    return NextResponse.json(updatedContact)

  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE request for contact ID:', params.id)
    
    // Delete contact - using lowercase 'contact'
    await (prisma as any).contact.delete({
      where: { id: params.id }
    })

    console.log('Contact deleted successfully:', params.id)
    return NextResponse.json({ message: 'Contact deleted successfully' })

  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
