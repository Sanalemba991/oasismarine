import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    // Fetch product by slug with related category and subcategory data
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        isActive: true, // Only return active products
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            href: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            href: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        viewCount: product.viewCount + 1, // Return updated view count
      },
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}