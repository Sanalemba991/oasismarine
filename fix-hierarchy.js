const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
});

async function fixHierarchy() {
  try {
    console.log('🔧 Fixing category hierarchy...');

    // Step 1: Get all current data
    const categories = await prisma.navCategory.findMany({
      include: { subcategories: true }
    });
    
    const products = await prisma.product.findMany({
      include: { category: true, subcategory: true }
    });

    console.log('Current categories:', categories.map(c => ({ name: c.name, href: c.href, isCategory: c.isCategory })));
    console.log('Current products:', products.map(p => ({ 
      name: p.name, 
      category: p.category?.name, 
      subcategory: p.subcategory?.name 
    })));

    // Step 2: Delete all current categories and subcategories
    await prisma.product.updateMany({
      data: {
        categoryId: null,
        subcategoryId: null
      }
    });

    await prisma.navSubcategory.deleteMany({});
    await prisma.navCategory.deleteMany({});

    console.log('✅ Cleared existing data');

    // Step 3: Create proper hierarchy
    
    // Create "Our Products" as navigation item (not a real category)
    const ourProducts = await prisma.navCategory.create({
      data: {
        name: 'Our Products',
        href: '/products',
        isCategory: false, // Just navigation
        visible: true,
        order: 1
      }
    });

    // Create "LED Installation" as MAIN CATEGORY
    const ledInstallation = await prisma.navCategory.create({
      data: {
        name: 'LED Installation',
        href: '/products/led-installation',
        isCategory: true, // Real category
        visible: true,
        order: 2
      }
    });

    // Create "Interactive Displays" as SUBCATEGORY under LED Installation
    const interactiveDisplays = await prisma.navSubcategory.create({
      data: {
        name: 'Interactive Displays',
        href: '/products/led-installation/interactive-displays',
        visible: true,
        order: 1,
        categoryId: ledInstallation.id // Under LED Installation
      }
    });

    console.log('✅ Created proper hierarchy:');
    console.log('📁 Our Products (navigation) -> /products');
    console.log('📁 LED Installation (category) -> /products/led-installation');
    console.log('   └── 📁 Interactive Displays (subcategory) -> /products/led-installation/interactive-displays');

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
          subcategoryId: null // No subcategory
        }
      });
      console.log('✅ Assigned U30 to LED Installation category');
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
      console.log('✅ Assigned LED Strip to Interactive Displays subcategory under LED Installation');
    }

    // Step 5: Verify the structure
    const finalCategories = await prisma.navCategory.findMany({
      include: { 
        subcategories: true,
        products: true
      }
    });

    console.log('\n🎯 Final Structure:');
    finalCategories.forEach(category => {
      console.log(`📁 ${category.name} (${category.isCategory ? 'Category' : 'Navigation'})`);
      console.log(`   URL: ${category.href}`);
      console.log(`   Products: ${category.products.length}`);
      
      if (category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
          console.log(`   └── 📁 ${sub.name} (Subcategory)`);
          console.log(`       URL: ${sub.href}`);
        });
      }
    });

    console.log('\n✅ Hierarchy fixed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixHierarchy();
