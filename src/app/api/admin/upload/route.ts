import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    // Check environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'pdf'

    console.log('File received:', file?.name, 'Type:', type);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid image file type' },
        { status: 400 }
      );
    }

    if (type === 'pdf' && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid PDF file type' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('File buffer size:', buffer.length);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: type === 'pdf' ? 'product-catalogs' : 'product-images',
        resource_type: type === 'pdf' ? 'raw' : 'image',
        use_filename: true,
        unique_filename: true,
      };

      if (type === 'image') {
        uploadOptions.transformation = [
          { quality: 'auto', fetch_format: 'auto' }
        ];
      }

      console.log('Uploading to Cloudinary with options:', uploadOptions);

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result?.secure_url);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id,
      type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const type = searchParams.get('type'); // 'image' or 'pdf'

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const deleteOptions: any = {
      resource_type: type === 'pdf' ? 'raw' : 'image'
    };

    await cloudinary.uploader.destroy(publicId, deleteOptions);

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
