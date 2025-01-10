import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
      return NextResponse.json(
        { error: 'Upload preset is missing' },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset: uploadPreset },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
