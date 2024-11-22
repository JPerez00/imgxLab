// src/app/(tools)/img-compressor/compressor-tool.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { UploadBox } from '@/components/shared/upload-box';
import { FileDropzone } from '@/components/shared/file-dropzone';
import { Button } from '@/components/button';
import { toast } from 'sonner';

export default function CompressorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [imageDetails, setImageDetails] = useState<{
    name: string;
    sizeKB: string;
    dimensions: string;
  } | null>(null);
  const [compressedSizeKB, setCompressedSizeKB] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Unsupported file type. Please upload a JPEG, PNG, or WebP image.');
        setSelectedFile(null);
        return;
      }

      const maxSizeMB = 20; // Allow up to 20MB files
      if (selectedFile.size / 1024 / 1024 > maxSizeMB) {
        toast.error(`File is too large. Please upload an image smaller than ${maxSizeMB} MB.`);
        setSelectedFile(null);
        return;
      }

      const originalUrl = URL.createObjectURL(selectedFile);
      setOriginalImageUrl(originalUrl);

      const img = new window.Image();
      img.onload = () => {
        setImageDetails({
          name: selectedFile.name,
          sizeKB: (selectedFile.size / 1024).toFixed(2),
          dimensions: `${img.width} × ${img.height}`,
        });
      };
      img.src = originalUrl;

      return () => {
        URL.revokeObjectURL(originalUrl);
        setImageDetails(null);
      };
    }
  }, [selectedFile]);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setCompressedSizeKB(null);
  };

  const resetTool = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setImageDetails(null);
    setCompressedSizeKB(null);
    setIsLoading(false);
  };

  const compressImage = async () => {
    if (!selectedFile || !imageDetails) return;

    setIsLoading(true);

    // Calculate 80% reduction in file size
    const originalSizeMB = selectedFile.size / 1024 / 1024;
    const desiredSizeMB = originalSizeMB * 0.2; // Targeting 20% of original size

    // Preserve original dimensions
    const [width, height] = imageDetails.dimensions.split(' × ').map(Number);
    const maxDimension = Math.max(width, height);

    const options = {
      maxSizeMB: desiredSizeMB,
      maxWidthOrHeight: maxDimension,
      useWebWorker: true,
      initialQuality: 0.6, // Adjusted for better compression without significant quality loss
      alwaysKeepResolution: true,
    };

    try {
      const compressedBlob = await imageCompression(selectedFile, options);
      const compressedSize = (compressedBlob.size / 1024).toFixed(2); // Size in KB

      setCompressedSizeKB(compressedSize);

      // Trigger download without opening in a new tab
      const compressedUrl = URL.createObjectURL(compressedBlob);
      const link = document.createElement('a');
      link.href = compressedUrl;
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.') || 'compressed-image';
      const extension = selectedFile.type.split('/')[1] || 'jpg';
      link.download = `${fileName}-compressed.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the compressed URL after download
      URL.revokeObjectURL(compressedUrl);

      toast.success(
        `Image compressed successfully from ${imageDetails.sizeKB} KB to ${compressedSize} KB.`
      );
    } catch (error) {
      console.error('Error during image compression:', error);
      if (error instanceof Error) {
        toast.error(`Failed to compress the image: ${error.message}`);
      } else {
        toast.error('Failed to compress the image.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-500 to-85% bg-clip-text text-transparent">
        Image Compressor
      </h1>

      {!selectedFile ? (
        <FileDropzone
          setCurrentFile={handleFileChange}
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
          dropText="Drop image file here"
        >
          <UploadBox
            title="Upload your JPEG, PNG, or WebP images to reduce file size without losing quality or altering their dimensions."
            description="Upload Image"
            accept="image/jpeg, image/png, image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />
        </FileDropzone>
      ) : (
        <div className="mt-6 mb-6">
          {originalImageUrl && imageDetails && (
            <div className="flex flex-col items-center">
              <Image
                src={originalImageUrl}
                alt="Original uploaded image"
                width={500}
                height={500}
                className="rounded-2xl object-contain mx-auto max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
              />
              <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400">
                <p className="font-medium">File Name: {imageDetails.name}</p>
                <p className="font-medium">File Size: {imageDetails.sizeKB} KB</p>
                <p className="font-medium">File Dimensions: {imageDetails.dimensions}</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-6 text-center text-white font-semibold text-2xl animate-pulse">
              <p>Compressing Image...</p>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={compressImage}
              disabled={isLoading || compressedSizeKB !== null}
              aria-label="Compress Image"
            >
              {isLoading ? 'Compressing...' : 'Compress Image'}
            </Button>
            <Button
              onClick={resetTool}
              aria-label="Go Home"
            >
              Go Home
            </Button>
          </div>

          {compressedSizeKB !== null && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={resetTool}
                aria-label="Compress Another Image"
              >
                Compress Another Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
