const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupProductsCategory() {
  try {
    console.log('Setting up Products category...');

    // Check if Products category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name: 'Products' }
    });

    if (existingCategory) {
      console.log('Products category already exists!');
      return;
    }

    // Create the Products category
    const productsCategory = await prisma.category.create({
      data: {
        name: 'Products',
        href: '/products',
        isCategory: false,
        visible: true,
        order: 1
      }
    });

    console.log('Products category created successfully!', productsCategory);

    // Optional: Create some sample categories with subcategories for demonstration
    const servicesCategory = await prisma.category.create({
      data: {
        name: 'Our Services',
        href: '/services',
        isCategory: true,
        visible: true,
        order: 2
      }
    });

    // Create subcategories for Services
    await prisma.subcategory.createMany({
      data: [
        {
          name: 'LED Installation',
          href: '/products/led-installation',
          categoryId: servicesCategory.id,
          visible: true,
          order: 1
        },
        {
          name: 'Interactive Displays',
          href: '/products/interactive-displays',
          categoryId: servicesCategory.id,
          visible: true,
          order: 2
        }
      ]
    });

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProductsCategory();
