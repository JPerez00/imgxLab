// src/app/api/test-exiftool/route.ts

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ExifTool } from 'exiftool-vendored';

export async function GET() {
  try {
    const exifTool = new ExifTool();
    const version = await exifTool.version();
    await exifTool.end();

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error executing exiftool:', error);

    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        error: 'Failed to execute exiftool',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
