/**
 * Utility functions for generating URL-friendly slugs
 */

export function generateSlug(text: string): string {
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

export function generateProductSlug(productName: string, subcategoryName?: string): string {
  let slug = generateSlug(productName);
  
  if (subcategoryName) {
    const subcategorySlug = generateSlug(subcategoryName);
    slug = `${subcategorySlug}-${slug}`;
  }
  
  return slug;
}

export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}