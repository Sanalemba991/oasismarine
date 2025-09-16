# How to Add Your Book Page Images

To add your book page images to the FlipBook component:

1. Place your book page images in this folder: `/public/book-pages/`

2. Name your images as follows:
   - `page-1.jpg` (Cover page)
   - `page-2.jpg` (Page 1)
   - `page-3.jpg` (Page 2)
   - `page-4.jpg` (Page 3)
   - ... and so on up to `page-20.jpg` (Page 19)

3. Supported image formats: JPG, PNG, WEBP

4. Recommended image dimensions: 
   - Width: 800-1200px
   - Height: 1000-1600px
   - Aspect ratio: Approximately 3:4 (portrait orientation)

5. For best results:
   - Use high-quality images (300 DPI if possible)
   - Ensure images are properly cropped
   - Keep file sizes reasonable (< 1MB per image)

## Current Status
- FlipBook component is configured for 20 pages
- Images will fallback to the logo if not found
- Page numbers are automatically displayed on each page

## Customization
If you need more or fewer than 20 pages, update the `pages` array in:
`/src/components/FlipBook.tsx`

Add or remove image paths as needed.
