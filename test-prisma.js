const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available Prisma methods:');
console.log(Object.getOwnPropertyNames(prisma).filter(name => !name.startsWith('_')));

// Test specific models
console.log('\nTesting models:');
console.log('Has category:', typeof prisma.category);
console.log('Has subcategory:', typeof prisma.subcategory);
console.log('Has Category:', typeof prisma.Category);
console.log('Has Subcategory:', typeof prisma.Subcategory);
