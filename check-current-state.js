const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCurrentState() {
  try {
    console.log('=== CATEGORIES ===');
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            products: true
          }
        },
        products: true
      }
    });
    
    categories.forEach(cat => {
      console.log(`\n📁 ${cat.name} (${cat.href}) - isCategory: ${cat.isCategory}`);
      console.log(`   Products directly in category: ${cat.products.length}`);
      
      if (cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`   📂 ${sub.name} (${sub.href})`);
          console.log(`      Products in subcategory: ${sub.products.length}`);
          if (sub.products.length > 0) {
            sub.products.forEach(prod => {
              console.log(`        - ${prod.name} (ID: ${prod.id})`);
            });
          }
        });
      }
      
      if (cat.products.length > 0) {
        cat.products.forEach(prod => {
          console.log(`      - ${prod.name} (ID: ${prod.id})`);
        });
      }
    });

    console.log('\n=== ALL PRODUCTS ===');
    const allProducts = await prisma.product.findMany({
      include: {
        category: true,
        subcategory: true
      }
    });
    
    allProducts.forEach(prod => {
      console.log(`\n🛍️ ${prod.name}`);
      console.log(`   Category: ${prod.category?.name || 'None'} (ID: ${prod.categoryId || 'None'})`);
      console.log(`   Subcategory: ${prod.subcategory?.name || 'None'} (ID: ${prod.subcategoryId || 'None'})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentState();
