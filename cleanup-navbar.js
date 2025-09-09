const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupAndUpdateNavbar() {
  try {
    console.log('Cleaning up duplicate categories...');

    // Delete duplicate categories (keeping the ones with products)
    await prisma.category.delete({
      where: { id: '68afde605e57b44362038cb0' } // LED Installation duplicate
    });
    
    await prisma.category.delete({
      where: { id: '68afde605e57b44362038cb1' } // Interactive Displays duplicate  
    });

    // Delete old subcategories since we now have main categories
    await prisma.subcategory.delete({
      where: { id: '68ad8ebeda33f6f9dcab2984' } // LED Installation subcategory
    });
    
    await prisma.subcategory.delete({
      where: { id: '68adaf4545cfe60070c25c1d' } // Interactive Displays subcategory
    });

    // Update "Our Products" category to be the main products page
    await prisma.category.update({
      where: { id: '68ad8e95da33f6f9dcab2982' },
      data: {
        name: 'Our Products',
        href: '/products',
        isCategory: false, // This will be a direct link, not a dropdown
        visible: true,
        order: 0
      }
    });

    console.log('Cleanup completed!');
    
    // Show final structure
    console.log('\n=== FINAL STRUCTURE ===');
    const categories = await prisma.category.findMany({
      include: { subcategories: true, products: true },
      orderBy: { order: 'asc' }
    });
    categories.forEach(cat => {
      console.log(`Category: ${cat.name} - ${cat.href} (${cat.products.length} products) - Dropdown: ${cat.isCategory}`);
      cat.products.forEach(prod => {
        console.log(`  - ${prod.name}`);
      });
      cat.subcategories.forEach(sub => {
        console.log(`  Subcategory: ${sub.name} - ${sub.href}`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAndUpdateNavbar();
