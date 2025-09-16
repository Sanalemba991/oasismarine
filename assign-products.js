const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function assignProductsToSubcategories() {
  try {
    // Get the products first
    const products = await prisma.product.findMany();
    console.log('Found products:');
    products.forEach(p => {
      console.log(`- ${p.name} (ID: ${p.id})`);
    });

    // Get the subcategories
    const ledInstallation = await prisma.subcategory.findFirst({
      where: { name: 'LED Installation' }
    });
    
    const interactiveDisplays = await prisma.subcategory.findFirst({
      where: { name: 'Interarctive displays' } // Note: keeping the typo as it exists in DB
    });

    console.log('\nFound subcategories:');
    console.log('LED Installation:', ledInstallation?.id);
    console.log('Interactive Displays:', interactiveDisplays?.id);

    // Get the main category
    const ourProducts = await prisma.category.findFirst({
      where: { name: 'Our Products' }
    });

    console.log('Our Products category:', ourProducts?.id);

    // Find specific products
    const ledStrip = products.find(p => p.name === 'LED Strip');
    const u30 = products.find(p => p.name === 'U30');

    if (ledStrip && interactiveDisplays && ourProducts) {
      // Assign LED Strip to Interactive Displays subcategory
      await prisma.product.update({
        where: { id: ledStrip.id },
        data: {
          categoryId: ourProducts.id,
          subcategoryId: interactiveDisplays.id
        }
      });
      console.log('✅ LED Strip assigned to Interactive Displays');
    }

    if (u30 && ledInstallation && ourProducts) {
      // Assign U30 to LED Installation subcategory  
      await prisma.product.update({
        where: { id: u30.id },
        data: {
          categoryId: ourProducts.id,
          subcategoryId: ledInstallation.id
        }
      });
      console.log('✅ U30 assigned to LED Installation');
    }

    console.log('\n🎉 Products assigned successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignProductsToSubcategories();
