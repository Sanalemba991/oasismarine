import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }


    const product = await prisma.product.findUnique({
      where: {
        id: id,
        isActive: true // Only return active products for public view
      },
      include: {
        category: true,
        subcategory: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Increment view count
    try {
   
      await prisma.product.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });
    } catch (viewError) {
      console.warn('Failed to update view count:', viewError);
      // Don't fail the request if view count update fails
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
