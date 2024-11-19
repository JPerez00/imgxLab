import { NextResponse } from 'next/server';
import { ExifTool } from 'exiftool-vendored';
import * as fs from 'fs/promises';
import * as path from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let tempFilePath: string | null = null;
  const exifTool = new ExifTool();

  try {
    const { fileData } = await request.json();

    // Decode the Base64 file data into a Buffer
    const buffer = Buffer.from(fileData, 'base64');

    // Write buffer to a temporary file
    const tempFileName = `upload-${Date.now()}.jpg`;
    tempFilePath = path.join('/tmp', tempFileName);
    await fs.writeFile(tempFilePath, buffer);

    // Extract EXIF data from the temporary file
    const tags = await exifTool.read(tempFilePath, ['-all']);

    // Try to extract the shutter count from various possible tags
    const shutterCount =
      tags.ShutterCount ||
      tags.ImageCount ||
      tags['Sony:ShutterCount'] ||
      tags['MakerNotes:ShutterCount'] ||
      tags['MakerNotes:ImageCount'] ||
      'Unavailable';

    const cameraMake = tags.Make || 'Unknown';
    const cameraModel = tags.Model || 'Unknown';

    return NextResponse.json({
      Make: cameraMake,
      Model: cameraModel,
      shutterCount,
    });
  } catch (error) {
    console.error('Error processing shutter count:', error);

    // Handle the error without using 'any'
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        error: 'Failed to process shutter count',
        details: errorMessage,
      },
      { status: 500 }
    );
  } finally {
    // Clean up temporary file if it exists
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }
    await exifTool.end();
  }
}
