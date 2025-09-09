const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkNavbar() {
  try {
    console.log('=== NAVBAR STRUCTURE ===');
    
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    categories.forEach(cat => {
      console.log(`\n📁 CATEGORY: ${cat.name}`);
      console.log(`   href: ${cat.href}`);
      console.log(`   isCategory: ${cat.isCategory}`);
      console.log(`   visible: ${cat.visible}`);
      
      if (cat.subcategories.length > 0) {
        console.log(`   SUBCATEGORIES:`);
        cat.subcategories.forEach(sub => {
          console.log(`   📂 ${sub.name}`);
          console.log(`      href: ${sub.href}`);
          console.log(`      visible: ${sub.visible}`);
        });
      }
    });

    console.log('\n=== WHAT NAVBAR API RETURNS ===');
    // Simulate what the navbar API returns
    const navbarData = {
      categories: categories.filter(cat => cat.visible).map(cat => ({
        id: cat.id,
        name: cat.name,
        href: cat.href,
        isCategory: cat.isCategory,
        visible: cat.visible,
        subcategories: cat.subcategories.filter(sub => sub.visible).map(sub => ({
          id: sub.id,
          name: sub.name,
          href: sub.href,
          visible: sub.visible
        }))
      }))
    };
    
    console.log(JSON.stringify(navbarData, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNavbar();
