import { NextResponse } from 'next/server';
import { ExifTool } from 'exiftool-vendored';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const exifTool = new ExifTool();
    const version = await exifTool.version();
    await exifTool.end();

    return NextResponse.json({ version });
  } catch (error: any) {
    console.error('Error executing exiftool:', error);
    return NextResponse.json(
      { error: 'Failed to execute exiftool', details: error.message || error.toString() },
      { status: 500 }
    );
  }
}
