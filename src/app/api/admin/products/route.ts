import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');

    const whereClause: any = {};
    if (categoryId) whereClause.categoryId = categoryId;
    if (subcategoryId) whereClause.subcategoryId = subcategoryId;

    // @ts-ignore - Temporary fix for Prisma client type issue
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        subcategory: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      shortDescription,
      longDescription,
      cardImage,
      detailImages,
      shortFeatures,
      specifications,
      reviewsData,
      catalogFile,
      categoryId,
      subcategoryId,
      isActive = true
    } = body;

    if (!name || !shortDescription || !cardImage) {
      return NextResponse.json(
        { error: 'Name, short description, and card image are required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    const product = await prisma.product.create({
      data: {
        name,
        shortDescription,
        longDescription,
        cardImage,
        detailImages: detailImages || [],
        shortFeatures: shortFeatures || [],
        specifications,
        reviewsData,
        catalogFile,
        categoryId: categoryId || null,
        subcategoryId: subcategoryId || null,
        isActive
      },
      include: {
        category: true,
        subcategory: true
      }
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      id, 
      name,
      shortDescription,
      longDescription,
      cardImage,
      detailImages,
      shortFeatures,
      specifications,
      reviewsData,
      catalogFile,
      categoryId,
      subcategoryId,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data with only valid Product model fields
    const updateData: any = {
      name,
      shortDescription,
      longDescription,
      cardImage,
      detailImages: detailImages || [],
      shortFeatures: shortFeatures || [],
      specifications,
      reviewsData,
      catalogFile,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      isActive: isActive !== undefined ? isActive : true
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // @ts-ignore - Temporary fix for Prisma client type issue
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        subcategory: true
      }
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
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
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // @ts-ignore - Temporary fix for Prisma client type issue
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
