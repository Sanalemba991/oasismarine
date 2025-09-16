import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

function generateProductSlug(productName, subcategoryName) {
  let slug = generateSlug(productName);
  
  if (subcategoryName) {
    const subcategorySlug = generateSlug(subcategoryName);
    slug = `${subcategorySlug}-${slug}`;
  }
  
  return slug;
}

function generateUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

async function populateProductSlugs() {
  try {
    console.log('Starting to populate product slugs...');
    
    // Get all products with their subcategories
    const products = await prisma.product.findMany({
      include: {
        subcategory: true,
      },
    });

    console.log(`Found ${products.length} products to process`);

    const existingSlugs = [];
    const updates = [];

    for (const product of products) {
      // Generate base slug
      const baseSlug = generateProductSlug(
        product.name, 
        product.subcategory?.name
      );
      
      // Ensure uniqueness
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
      existingSlugs.push(uniqueSlug);
      
      updates.push({
        id: product.id,
        slug: uniqueSlug,
        name: product.name,
        subcategory: product.subcategory?.name || 'No subcategory'
      });
      
      console.log(`Generated slug for "${product.name}": ${uniqueSlug}`);
    }

    // Update products with generated slugs
    for (const update of updates) {
      await prisma.product.update({
        where: { id: update.id },
        data: { slug: update.slug },
      });
    }

    console.log(`Successfully updated ${updates.length} products with slugs`);
  } catch (error) {
    console.error('Error populating product slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateProductSlugs();