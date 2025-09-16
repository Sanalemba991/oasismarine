import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

export async function GET() {
  try {
    // @ts-ignore - Temporary fix for Prisma client type issue
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
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

    const { name, href, isCategory, visible = true, order } = await request.json();

    if (!name || !href) {
      return NextResponse.json(
        { error: 'Name and href are required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    const maxOrder = await prisma.category.aggregate({
      _max: { order: true }
    });
    
    const finalOrder = order || ((maxOrder._max.order || 0) + 1);

    // @ts-ignore - Temporary fix for Prisma client type issue
    const category = await prisma.category.create({
      data: {
        name,
        href,
        isCategory: isCategory || false,
        visible,
        order: finalOrder
      },
      include: {
        subcategories: true
      }
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
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

    const { id, name, href, isCategory, visible } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(href && { href }),
        ...(typeof isCategory !== 'undefined' && { isCategory }),
        ...(typeof visible !== 'undefined' && { visible })
      },
      include: {
        subcategories: true
      }
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
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
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
