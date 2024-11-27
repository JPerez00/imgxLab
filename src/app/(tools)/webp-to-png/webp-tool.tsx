// src/app/(tools)/webp-to-png/webp-tool.tsx

'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { UploadBox } from '@/components/shared/upload-box';
import {
  useFileUploader,
  type FileUploaderResult,
} from '@/hooks/use-file-uploader';
import { FileDropzone } from '@/components/shared/file-dropzone';
import { Button } from '@/components/button';
import Image from 'next/image';

type ImageMetadata = {
  width: number;
  height: number;
  name: string;
  sizeKB: string;
  dimensions: string;
};

function useImageConverter(props: {
  canvas: HTMLCanvasElement | null;
  imageContent: string;
  targetFormat: 'png' | 'webp';
  fileName: string;
  quality: number;
}) {
  const { imageContent, targetFormat, fileName, quality } = props;

  const convertImage = async () => {
    const ctx = props.canvas?.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    const saveImage = () => {
      if (props.canvas) {
        const dataURL = props.canvas.toDataURL(
          `image/${targetFormat}`,
          targetFormat === 'webp' ? quality : undefined
        );
        const link = document.createElement('a');
        link.href = dataURL;
        const fileNameWithoutExtension = fileName.replace(/\..+$/, '');
        link.download = `${fileNameWithoutExtension}.${targetFormat}`;
        link.click();
      }
    };

    // Use window.Image to reference the global Image constructor
    const img = new window.Image();
    img.onload = () => {
      if (!props.canvas) return;
      props.canvas.width = img.width;
      props.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      saveImage();
    };

    img.src = imageContent;
  };

  return {
    convertImage,
  };
}

function SaveAsButton({
  imageContent,
  targetFormat,
  imageMetadata,
  quality,
}: {
  imageContent: string;
  targetFormat: 'png' | 'webp';
  imageMetadata: ImageMetadata;
  quality: number;
}) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const { convertImage } = useImageConverter({
    canvas: canvasRef,
    imageContent,
    targetFormat,
    fileName: imageMetadata.name,
    quality,
  });

  return (
    <div>
      <canvas ref={setCanvasRef} hidden />
      <Button onClick={() => void convertImage()} aria-label={`Save as ${targetFormat.toUpperCase()}`}>
        Save as {targetFormat.toUpperCase()}
      </Button>
    </div>
  );
}

export function WEBPToolCore(props: { fileUploaderProps: FileUploaderResult }) {
  const {
    imageContent,
    imageMetadata,
    handleFileUploadEvent,
    cancel,
    selectedFile,
  } = props.fileUploaderProps;

  const [quality, setQuality] = useLocalStorage<number>('webpTool_quality', 80);
  const [imageDetails, setImageDetails] = useState<ImageMetadata | null>(null);

  useEffect(() => {
    if (imageMetadata && selectedFile) {
      const dimensions = `${imageMetadata.width} × ${imageMetadata.height}`;
      const sizeKB = (selectedFile.size / 1024).toFixed(2);
      setImageDetails({
        width: imageMetadata.width,
        height: imageMetadata.height,
        name: selectedFile.name,
        sizeKB,
        dimensions,
      });
    } else {
      setImageDetails(null); // Reset imageDetails when no file is selected
    }
  }, [imageMetadata, selectedFile]);

  // Determine the current format based on the file extension
  const extension = imageDetails?.name.split('.').pop()?.toLowerCase();
  const currentFormat = extension === 'png' ? 'png' : 'webp';
  const targetFormat = currentFormat === 'png' ? 'webp' : 'png';

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-600 bg-clip-text text-transparent">
        WebP & PNG Converter
      </h1>
      {!imageDetails ? (
        <FileDropzone
          setCurrentFile={props.fileUploaderProps.handleFileUpload} // Correctly pass handleFileUpload
          acceptedFileTypes={['image/png', 'image/webp', '.png', '.webp']}
          dropText="Drop image file here"
        >
          <UploadBox
            title="Easily switch between WebP and PNG formats. Upload your images below, and get instant, high-quality conversions in seconds."
            accept=".png,.webp,image/png,image/webp"
            onChange={handleFileUploadEvent} // Pass handleFileUploadEvent to onChange
          />
        </FileDropzone>
      ) : (
        <div className="mt-6 mb-6">
          {imageDetails && (
            <div className="flex flex-col items-center">
              <Image
                src={imageContent}
                alt="Uploaded photograph"
                width={imageDetails.width}
                height={imageDetails.height}
                className="rounded-2xl object-contain mx-auto max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
                unoptimized // Prevent Next.js from optimizing dynamic URLs
              />
              <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400">
                <p className="font-medium">File Name: {imageDetails.name}</p>
                <p className="font-medium">File Size: {imageDetails.sizeKB} KB</p>
                <p className="font-medium">File Dimensions: {imageDetails.dimensions}</p>
              </div>
            </div>
          )}

          {/* Quality Slider for WebP Conversion */}
          {targetFormat === 'webp' && (
            <div className="mt-6 space-y-2 mb-6 max-w-md mx-auto w-full">
              <label className="text-sm font-medium text-zinc-400">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-center gap-4 mt-6">
            <SaveAsButton
              imageContent={imageContent}
              targetFormat={targetFormat}
              imageMetadata={imageDetails}
              quality={quality / 100}
            />
          </div>

          {/* Bottom Buttons */}
          <div className="mt-12 text-center flex justify-center gap-4">
            <Button onClick={cancel} aria-label="Convert Another Image">
              Convert Another Image
            </Button>
            <Button href="/" aria-label="Go Home">
              Go Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WEBPTool() {
  const fileUploaderProps = useFileUploader();

  return (
    <FileDropzone
      setCurrentFile={fileUploaderProps.handleFileUpload} // Ensure handleFileUpload is passed correctly
      acceptedFileTypes={['image/png', 'image/webp', '.png', '.webp']}
      dropText="Drop image file here"
    >
      <WEBPToolCore fileUploaderProps={fileUploaderProps} />
    </FileDropzone>
  );
}
