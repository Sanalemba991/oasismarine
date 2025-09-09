import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🔧 Fixing category hierarchy...');

    // Step 1: Get all current data
    const categories = await prisma.category.findMany({
      include: { subcategories: true }
    });
    
    const products = await prisma.product.findMany({
      include: { category: true, subcategory: true }
    });

    // Step 2: Clear existing relationships
    await prisma.product.updateMany({
      data: {
        categoryId: null,
        subcategoryId: null
      }
    });

    await prisma.subcategory.deleteMany({});
    await prisma.category.deleteMany({});

    // Step 3: Create proper hierarchy
    
    // Create "Our Products" as navigation item (not a real category)
    const ourProducts = await prisma.category.create({
      data: {
        name: 'Our Products',
        href: '/products',
        isCategory: false, // Just navigation
        visible: true,
        order: 1
      }
    });

    // Create "LED Installation" as MAIN CATEGORY
    const ledInstallation = await prisma.category.create({
      data: {
        name: 'LED Installation',
        href: '/products/led-installation',
        isCategory: true, // Real category
        visible: true,
        order: 2
      }
    });

    // Create "Interactive Displays" as SUBCATEGORY under LED Installation
    const interactiveDisplays = await prisma.subcategory.create({
      data: {
        name: 'Interactive Displays',
        href: '/products/led-installation/interactive-displays',
        visible: true,
        order: 1,
        categoryId: ledInstallation.id // Under LED Installation
      }
    });

    // Step 4: Assign products correctly
    
    // Find your products by name
    const u30Product = await prisma.product.findFirst({
      where: { name: { contains: 'U30' } }
    });

    const ledStripProduct = await prisma.product.findFirst({
      where: { name: { contains: 'LED Strip' } }
    });

    // Assign U30 to LED Installation category (main category)
    if (u30Product) {
      await prisma.product.update({
        where: { id: u30Product.id },
        data: {
          categoryId: ledInstallation.id,
          subcategoryId: null // No subcategory, just main category
        }
      });
    }

    // Assign LED Strip to Interactive Displays subcategory (under LED Installation)
    if (ledStripProduct) {
      await prisma.product.update({
        where: { id: ledStripProduct.id },
        data: {
          categoryId: ledInstallation.id, // Still belongs to LED Installation
          subcategoryId: interactiveDisplays.id // But specifically in Interactive Displays subcategory
        }
      });
    }

    // Step 5: Verify the structure
    const finalCategories = await prisma.category.findMany({
      include: { 
        subcategories: true,
        products: true
      }
    });

    const result = {
      message: '✅ Hierarchy fixed successfully!',
      structure: finalCategories.map((category: any) => ({
        name: category.name,
        href: category.href,
        isCategory: category.isCategory,
        productCount: category.products.length,
        subcategories: category.subcategories.map((sub: any) => ({
          name: sub.name,
          href: sub.href
        }))
      }))
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Failed to fix hierarchy' }, { status: 500 });
  }
}
