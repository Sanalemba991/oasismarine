const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('=== CATEGORIES ===');
    const categories = await prisma.category.findMany({
      include: { subcategories: true }
    });
    categories.forEach(cat => {
      console.log(`Category: ${cat.name} (ID: ${cat.id}) - href: ${cat.href}`);
      cat.subcategories.forEach(sub => {
        console.log(`  Subcategory: ${sub.name} (ID: ${sub.id}) - href: ${sub.href}`);
      });
    });

    console.log('\n=== PRODUCTS ===');
    const products = await prisma.product.findMany({
      include: { category: true, subcategory: true }
    });
    products.forEach(prod => {
      console.log(`Product: ${prod.name}`);
      console.log(`  Category: ${prod.category?.name || 'None'} (ID: ${prod.categoryId || 'None'})`);
      console.log(`  Subcategory: ${prod.subcategory?.name || 'None'} (ID: ${prod.subcategoryId || 'None'})`);
      console.log(`  Active: ${prod.isActive}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
