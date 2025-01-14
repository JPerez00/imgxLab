import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resizedPngBuffer = await sharp(buffer)
      .resize(128, 128, { fit: 'cover' })
      .png({
        palette: true,
        colors: 64,
        compressionLevel: 9,
        quality: 20,
      })
      .toBuffer();

    const icoBuffer = await pngToIco([resizedPngBuffer]);

    return new NextResponse(icoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Content-Disposition': 'attachment; filename="favicon.ico"',
      },
    });
  } catch (error) {
    console.error('PNG to ICO conversion failed:', error);
    return NextResponse.json(
      { error: 'Failed to convert PNG to ICO. Ensure you uploaded a valid PNG.' },
      { status: 500 }
    );
  }
}
