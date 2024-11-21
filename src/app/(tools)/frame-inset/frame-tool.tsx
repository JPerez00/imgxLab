// src/app/(tools)/frame-inset/frame-tool.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileDropzone } from '@/components/shared/file-dropzone';
import { UploadBox } from '@/components/shared/upload-box';
import { Button } from '@/components/button';
import Image from 'next/image'; // Import Next.js Image component

const ASPECT_RATIOS = ['1:1', '4:5', '5:4', '9:16', '16:9', '2:1'] as const;
const BACKGROUND_COLORS = ['white', 'silver', 'gray', 'black', 'orange', 'red'] as const;

type AspectRatio = (typeof ASPECT_RATIOS)[number];
type BackgroundColor = (typeof BACKGROUND_COLORS)[number];

type ExportOption = {
  format: 'jpeg' | 'png';
  quality?: number;
};

export default function FrameTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageContent, setImageContent] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [fileDimensions, setFileDimensions] = useState<string | null>(null); // Added fileDimensions

  const [insetWidthPercentage, setInsetWidthPercentage] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1'); // Default aspect ratio
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>('white');
  const [selectedExportOption, setSelectedExportOption] = useState<ExportOption>({
    format: 'jpeg',
    quality: 0.95,
  }); // Default export option

  // Removed fileUploaderProps as it's unused
  // const fileUploaderProps = useFileUploader();

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      const img = new window.Image(); // Explicitly reference the global Image constructor
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setFileDimensions(`${img.width} × ${img.height}`); // Set fileDimensions
        setImageContent(objectUrl);
      };
      img.src = objectUrl;

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [selectedFile]);

  const resetTool = () => {
    setSelectedFile(null);
    setImageContent(null);
    setImageDimensions(null);
    setFileDimensions(null); // Reset fileDimensions
    setInsetWidthPercentage(5);
    setAspectRatio('1:1'); // Reset to default aspect ratio
    setBackgroundColor('white');
    setSelectedExportOption({ format: 'jpeg', quality: 0.95 }); // Reset export option
  };

  const renderImage = async () => {
    if (!imageContent || !imageDimensions || !aspectRatio) {
      console.error('Missing image content, dimensions, or aspect ratio.');
      return;
    }

    try {
      const { width: originalWidth, height: originalHeight } = imageDimensions;
      const { format, quality } = selectedExportOption;

      // Parse the selected aspect ratio
      const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
      const targetAspectRatio = ratioWidth / ratioHeight;

      // Determine the maximum allowed size (longest side of the original image)
      const originalLongestSide = Math.max(originalWidth, originalHeight);

      let canvasWidth: number;
      let canvasHeight: number;

      // Adjust canvas dimensions based on the aspect ratio
      if (targetAspectRatio >= 1) {
        // Landscape or square aspect ratio
        canvasWidth = originalLongestSide;
        canvasHeight = canvasWidth / targetAspectRatio;
      } else {
        // Portrait aspect ratio
        canvasHeight = originalLongestSide;
        canvasWidth = canvasHeight * targetAspectRatio;
      }

      // If canvas dimensions exceed the originalLongestSide, scale them down
      if (canvasWidth > originalLongestSide) {
        const scaleFactor = originalLongestSide / canvasWidth;
        canvasWidth *= scaleFactor;
        canvasHeight *= scaleFactor;
      }
      if (canvasHeight > originalLongestSide) {
        const scaleFactor = originalLongestSide / canvasHeight;
        canvasWidth *= scaleFactor;
        canvasHeight *= scaleFactor;
      }

      // Round canvas dimensions
      canvasWidth = Math.round(canvasWidth);
      canvasHeight = Math.round(canvasHeight);

      // Calculate the inset in pixels
      const insetPixels =
        (insetWidthPercentage / 100) * Math.min(canvasWidth, canvasHeight);

      // Adjust the image area dimensions
      const imageAreaWidth = canvasWidth - insetPixels * 2;
      const imageAreaHeight = canvasHeight - insetPixels * 2;

      // Scale the original image to fit within the image area
      const imageScalingFactor = Math.min(
        imageAreaWidth / originalWidth,
        imageAreaHeight / originalHeight,
        1 // Do not scale up the image
      );

      const finalImageWidth = originalWidth * imageScalingFactor;
      const finalImageHeight = originalHeight * imageScalingFactor;

      // Center the image within the canvas
      const imageX = (canvasWidth - finalImageWidth) / 2;
      const imageY = (canvasHeight - finalImageHeight) / 2;

      // Create the canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context.');
      }

      // Fill the background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load the image
      const img = new window.Image(); // Explicitly reference the global Image constructor
      img.src = imageContent;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject('Failed to load image.');
      });

      // Draw the image onto the canvas
      ctx.drawImage(img, imageX, imageY, finalImageWidth, finalImageHeight);

      // Determine the MIME type and file extension
      let mimeType = 'image/png';
      let fileExtension = 'png';
      if (format === 'jpeg') {
        mimeType = 'image/jpeg';
        fileExtension = 'jpg';
      }

      // Save the image
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Failed to create image blob.');
            return;
          }

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          const fileName =
            selectedFile?.name.split('.').slice(0, -1).join('.') ||
            'framed-image';
          link.download = `${fileName}-framed.${fileExtension}`;
          link.click();
          console.log('Image successfully saved!');
        },
        mimeType,
        quality // Quality parameter between 0 and 1
      );
    } catch (error) {
      console.error('Error rendering image:', error);
    }
  };

  // Memoize image styles to prevent unnecessary recalculations
  const imageStyle = useMemo(
    () => ({
      width: `${100 - insetWidthPercentage * 2}%`,
      height: `${100 - insetWidthPercentage * 2}%`,
      left: `${insetWidthPercentage}%`,
      top: `${insetWidthPercentage}%`,
    }),
    [insetWidthPercentage]
  );

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-600 bg-clip-text text-transparent">
        Frame Insets Designer
      </h1>

      {!selectedFile ? (
        <FileDropzone
          setCurrentFile={(file) => setSelectedFile(file)}
          acceptedFileTypes={['image/*']}
          dropText="Drop image file here"
        >
          <UploadBox
            title="Upload an image to add an inset frame, adjust the frame width and aspect ratio, and customize the background color."
            description="Upload Image"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
        </FileDropzone>
      ) : (
        <div className="mt-6 mb-6">
          <div
            className="relative mx-auto w-full max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
            style={{
              backgroundColor: backgroundColor,
              aspectRatio: aspectRatio.replace(':', '/'),
            }}
          >
            {/* Only render Image if imageContent is available */}
            {imageContent && (
              <div
                className="absolute"
                style={imageStyle}
              >
                <Image
                  src={imageContent}
                  alt={`Uploaded image: ${selectedFile.name}`} // Enhanced alt text for accessibility
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400">
            <p className="font-medium">File Name: {selectedFile.name}</p>
            <p className="font-medium">
              File Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
            <p className="font-medium">
              File Dimensions: {fileDimensions || 'Loading...'}
            </p>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="mt-8 space-y-8">
          {/* Inset Width */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">
              Inset Width: {insetWidthPercentage}%
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={insetWidthPercentage}
              onChange={(e) => setInsetWidthPercentage(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400">Aspect Ratio</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {ASPECT_RATIOS.map((ratio) => (
                <Button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  active={aspectRatio === ratio} // Use active prop
                  className="px-3 py-2"
                >
                  {ratio}
                </Button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400">
              Background Color
            </h3>
            <div className="flex gap-4 mt-2">
              {BACKGROUND_COLORS.map((color) => (
                <div
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`h-10 w-10 rounded-full cursor-pointer border-4 ${
                    backgroundColor === color
                      ? 'border-zinc-400' // Highlight selected color
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400">Export Options</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                onClick={() =>
                  setSelectedExportOption({ format: 'jpeg', quality: 0.8 })
                }
                active={
                  selectedExportOption.format === 'jpeg' &&
                  selectedExportOption.quality === 0.8
                }
                className="px-3 py-2"
              >
                JPEG 80%
              </Button>
              <Button
                onClick={() =>
                  setSelectedExportOption({ format: 'jpeg', quality: 0.95 })
                }
                active={
                  selectedExportOption.format === 'jpeg' &&
                  selectedExportOption.quality === 0.95
                }
                className="px-3 py-2"
              >
                JPEG 95%
              </Button>
              <Button
                onClick={() =>
                  setSelectedExportOption({ format: 'jpeg', quality: 1 })
                }
                active={
                  selectedExportOption.format === 'jpeg' &&
                  selectedExportOption.quality === 1
                }
                className="px-3 py-2"
              >
                JPEG 100%
              </Button>
              <Button
                onClick={() =>
                  setSelectedExportOption({ format: 'png' })
                }
                active={selectedExportOption.format === 'png'}
                className="px-3 py-2"
              >
                PNG
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-8">
            <Button
              onClick={renderImage}
            >
              Save Image
            </Button>
            <Button
              onClick={resetTool}
            >
              Start Over
            </Button>
            <Button href="/">
              Go Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
