const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNavigation() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true
      },
      orderBy: { order: 'asc' }
    });
    
    console.log('Categories and Subcategories:');
    categories.forEach(cat => {
      console.log(`Category: ${cat.name} (${cat.href}) - isCategory: ${cat.isCategory} - visible: ${cat.visible}`);
      cat.subcategories.forEach(sub => {
        console.log(`  - ${sub.name} (${sub.href}) - visible: ${sub.visible}`);
      });
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNavigation();
