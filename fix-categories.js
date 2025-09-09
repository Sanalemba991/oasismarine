const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixCategories() {
  try {
    console.log('Fixing category structure...');

    // Find the duplicate categories
    const categories = await prisma.category.findMany({
      include: { subcategories: true }
    });

    console.log('Current categories:', categories.length);

    // Remove the "Our Products" category (keep "Products")
    const ourProductsCategory = categories.find(cat => cat.name === 'Our Products');
    if (ourProductsCategory) {
      console.log('Removing "Our Products" category...');
      await prisma.category.delete({
        where: { id: ourProductsCategory.id }
      });
      console.log('Removed "Our Products" category');
    }

    // Update "Products" to be visible and have the right order
    const productsCategory = categories.find(cat => cat.name === 'Products');
    if (productsCategory) {
      console.log('Updating "Products" category...');
      await prisma.category.update({
        where: { id: productsCategory.id },
        data: {
          visible: true,
          order: 1
        }
      });
      console.log('Updated "Products" category');
    }

    // Update "Our Services" to have order 2
    const servicesCategory = categories.find(cat => cat.name === 'Our Services');
    if (servicesCategory) {
      console.log('Updating "Our Services" category...');
      await prisma.category.update({
        where: { id: servicesCategory.id },
        data: {
          order: 2
        }
      });
      console.log('Updated "Our Services" category');
    }

    console.log('✅ Categories fixed successfully!');
    
    // Show final state
    const finalCategories = await prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { order: 'asc' }
    });

    console.log('\n--- FINAL CATEGORIES ---');
    finalCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} → ${cat.href} (visible: ${cat.visible})`);
      if (cat.subcategories.length > 0) {
        cat.subcategories.forEach((sub, subIndex) => {
          console.log(`   ${subIndex + 1}. ${sub.name} → ${sub.href}`);
        });
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
