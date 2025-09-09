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
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, categoryId, subcategoryId, productIds } = body;

    switch (action) {
      case 'reassign-products-to-category':
        if (!categoryId || !Array.isArray(productIds)) {
          return NextResponse.json(
            { error: 'Category ID and product IDs array are required' },
            { status: 400 }
          );
        }

        // @ts-ignore - Temporary fix for Prisma client type issue
        await prisma.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            categoryId: categoryId,
            subcategoryId: null // Clear subcategory when reassigning to category
          }
        });

        return NextResponse.json({ 
          message: `Successfully reassigned ${productIds.length} products to category`,
          updatedProducts: productIds.length
        });

      case 'reassign-products-to-subcategory':
        if (!subcategoryId || !categoryId || !Array.isArray(productIds)) {
          return NextResponse.json(
            { error: 'Category ID, subcategory ID and product IDs array are required' },
            { status: 400 }
          );
        }

        // @ts-ignore - Temporary fix for Prisma client type issue
        await prisma.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            categoryId: categoryId,
            subcategoryId: subcategoryId
          }
        });

        return NextResponse.json({ 
          message: `Successfully reassigned ${productIds.length} products to subcategory`,
          updatedProducts: productIds.length
        });

      case 'move-products-on-category-update':
        if (!categoryId) {
          return NextResponse.json(
            { error: 'Category ID is required' },
            { status: 400 }
          );
        }

        // When a category is updated, ensure all its products maintain proper relationships
        // @ts-ignore - Temporary fix for Prisma client type issue
        const categoryProducts = await prisma.product.findMany({
          where: { categoryId: categoryId },
          include: { category: true, subcategory: true }
        });

        // @ts-ignore - Temporary fix for Prisma client type issue
        const subcategories = await prisma.subcategory.findMany({
          where: { categoryId: categoryId }
        });

        // Ensure products with subcategories have the correct parent category
        for (const subcategory of subcategories) {
          // @ts-ignore - Temporary fix for Prisma client type issue
          await prisma.product.updateMany({
            where: { subcategoryId: subcategory.id },
            data: { categoryId: categoryId }
          });
        }

        return NextResponse.json({ 
          message: 'Successfully updated product relationships for category',
          categoryProducts: categoryProducts.length,
          subcategories: subcategories.length
        });

      case 'cleanup-orphaned-products':
        // Find products that have subcategoryId but their subcategory doesn't exist
        // @ts-ignore - Temporary fix for Prisma client type issue
        const orphanedProducts = await prisma.product.findMany({
          where: {
            subcategoryId: { not: null }
          },
          include: { subcategory: true }
        });

        const productsToCleanup = orphanedProducts.filter(p => !p.subcategory);
        
        if (productsToCleanup.length > 0) {
          // @ts-ignore - Temporary fix for Prisma client type issue
          await prisma.product.updateMany({
            where: {
              id: { in: productsToCleanup.map(p => p.id) }
            },
            data: {
              subcategoryId: null
            }
          });
        }

        return NextResponse.json({ 
          message: 'Successfully cleaned up orphaned products',
          cleanedProducts: productsToCleanup.length
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in product management:', error);
    return NextResponse.json(
      { error: 'Failed to manage products' },
      { status: 500 }
    );
  }
}
