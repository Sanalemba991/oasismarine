const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('Checking current categories in database...\n');

    const categories = await prisma.category.findMany({
      include: {
        subcategories: true
      },
      orderBy: { order: 'asc' }
    });

    console.log('Found categories:', categories.length);
    
    categories.forEach((cat, index) => {
      console.log(`\n${index + 1}. ${cat.name}`);
      console.log(`   - Href: ${cat.href}`);
      console.log(`   - Visible: ${cat.visible}`);
      console.log(`   - Is Category: ${cat.isCategory}`);
      console.log(`   - Order: ${cat.order}`);
      console.log(`   - Image: ${cat.image || 'No image'}`);
      
      if (cat.subcategories.length > 0) {
        console.log(`   - Subcategories: ${cat.subcategories.length}`);
        cat.subcategories.forEach((sub, subIndex) => {
          console.log(`     ${subIndex + 1}. ${sub.name} (${sub.href}) - Visible: ${sub.visible}`);
        });
      }
    });

    console.log('\n--- END OF CATEGORIES ---');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
