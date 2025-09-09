import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { name, href, categoryId, visible = true, order, image } = await request.json();

    if (!name || !href || !categoryId) {
      return NextResponse.json(
        { error: 'Name, href, and categoryId are required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    const maxOrder = await prisma.subcategory.aggregate({
      where: { categoryId },
      _max: { order: true }
    });
    
    const finalOrder = order || ((maxOrder._max.order || 0) + 1);

    // @ts-ignore - Temporary fix for Prisma client type issue
    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        href,
        categoryId,
        visible,
        order: finalOrder,
        image: image || null
      }
    });

    return NextResponse.json({ subcategory });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id, name, href, visible, image } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(href && { href }),
        ...(typeof visible !== 'undefined' && { visible }),
        ...(typeof image !== 'undefined' && { image })
      }
    });

    return NextResponse.json({ subcategory });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    await prisma.subcategory.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}
