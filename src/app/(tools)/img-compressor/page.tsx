import CompressorTool from './compressor-tool';

export const metadata = {
  title: "Image Compressor - imgxLab",
  description: "Reduce image file sizes without compromising image quality. Supports JPEG, PNG, WebP, and more!",
};

export default function CompressorPage() {
  return <CompressorTool />;
}
