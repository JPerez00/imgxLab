import { NextResponse } from 'next/server';
import { ExifTool } from 'exiftool-vendored';
import * as fs from 'fs/promises';

const exifTool = new ExifTool();

export async function POST(request: Request) {
  try {
    const { fileData, fileName } = await request.json();

    // Decode the Base64 file data
    const buffer = Buffer.from(fileData, 'base64');

    // Write the file temporarily
    const tempFilePath = `/tmp/${fileName}`;
    await fs.writeFile(tempFilePath, buffer);

    // Extract EXIF data
    const tags = await exifTool.read(tempFilePath);

    // Extract necessary fields
    const cameraMake = tags.Make || 'Unknown';
    const cameraModel = tags.Model || 'Unknown';
    const shutterCount =
      tags.ImageCount || tags.ShutterCount || 'Unavailable';

    // Clean up temporary file
    await fs.unlink(tempFilePath);

    return NextResponse.json({
      Make: cameraMake,
      Model: cameraModel,
      shutterCount,
    });
  } catch (error) {
    console.error('Error processing shutter count:', error);
    return NextResponse.json(
      { error: 'Failed to process shutter count' },
      { status: 500 }
    );
  }
}
