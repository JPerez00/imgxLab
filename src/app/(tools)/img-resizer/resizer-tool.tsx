// src/app/(tools)/img-resizer/resizer-tool.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useFileUploader } from '@/hooks/use-file-uploader';
import { UploadBox } from '@/components/shared/upload-box';
import { FileDropzone } from '@/components/shared/file-dropzone';
import { Button } from '@/components/button';
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import resizeImage from '@/libs/resizeImage';

export default function ImageResizer() {
  const fileUploaderProps = useFileUploader();
  const {
    imageContent,
    imageMetadata,
    handleFileUploadEvent,
    cancel,
    selectedFile,
  } = fileUploaderProps;

  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [fileDimensions, setFileDimensions] = useState<string | null>(null);

  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const lastChanged = useRef<'width' | 'height' | null>(null);
  const [percentage, setPercentage] = useState<number>(100);

  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<string>('Original');
  const [exportFormat, setExportFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [loading, setLoading] = useState<boolean>(false);

  // Populate width and height with the original image dimensions
  useEffect(() => {
    if (imageMetadata) {
      setWidth(imageMetadata.width);
      setHeight(imageMetadata.height);
    }
  }, [imageMetadata]);

  // Load image dimensions for display
  useEffect(() => {
    if (selectedFile) {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setFileDimensions(`${img.width} × ${img.height}`);
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  }, [selectedFile]);

  // Update height when width changes
  useEffect(() => {
    if (
      resizeMode === 'dimensions' &&
      aspectRatioLocked &&
      width !== '' &&
      imageMetadata &&
      lastChanged.current === 'width'
    ) {
      let newHeight;
      if (aspectRatio === 'Original') {
        newHeight = Math.round((width as number) * imageMetadata.height / imageMetadata.width);
      } else {
        const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
        newHeight = Math.round((width as number) * ratioH / ratioW);
      }
      setHeight(newHeight);
      lastChanged.current = null;
    }
  }, [width, aspectRatio, aspectRatioLocked, resizeMode, imageMetadata]);

  // Update width when height changes
  useEffect(() => {
    if (
      resizeMode === 'dimensions' &&
      aspectRatioLocked &&
      height !== '' &&
      imageMetadata &&
      lastChanged.current === 'height'
    ) {
      let newWidth;
      if (aspectRatio === 'Original') {
        newWidth = Math.round((height as number) * imageMetadata.width / imageMetadata.height);
      } else {
        const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
        newWidth = Math.round((height as number) * ratioW / ratioH);
      }
      setWidth(newWidth);
      lastChanged.current = null;
    }
  }, [height, aspectRatio, aspectRatioLocked, resizeMode, imageMetadata]);

  // Update dimensions when aspect ratio changes
  useEffect(() => {
    if (resizeMode === 'dimensions' && aspectRatioLocked && imageMetadata) {
      if (lastChanged.current === 'width' && width !== '') {
        // Recalculate height
        let newHeight;
        if (aspectRatio === 'Original') {
          newHeight = Math.round((width as number) * imageMetadata.height / imageMetadata.width);
        } else {
          const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
          newHeight = Math.round((width as number) * ratioH / ratioW);
        }
        setHeight(newHeight);
      } else if (lastChanged.current === 'height' && height !== '') {
        // Recalculate width
        let newWidth;
        if (aspectRatio === 'Original') {
          newWidth = Math.round((height as number) * imageMetadata.width / imageMetadata.height);
        } else {
          const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
          newWidth = Math.round((height as number) * ratioW / ratioH);
        }
        setWidth(newWidth);
      }
      lastChanged.current = null;
    }
  }, [aspectRatio, aspectRatioLocked, resizeMode, imageMetadata, width, height]);

  // Trigger resizing and automatic download
  const handleResize = async () => {
    if (!selectedFile || !imageContent) return;
    setLoading(true);

    try {
      const options = {
        width: resizeMode === 'dimensions' ? Number(width) : undefined,
        height: resizeMode === 'dimensions' ? Number(height) : undefined,
        percentage: resizeMode === 'percentage' ? percentage : undefined,
        format: exportFormat,
        aspectRatioLocked,
      };

      // Resize image using the utility
      const resizedImageUrl = await resizeImage(imageContent, options);

      // Automatically download the resized image
      const link = document.createElement('a');
      link.href = resizedImageUrl;
      const fileNameWithoutExtension = imageMetadata?.name.replace(/\..+$/, '') || 'resized-image';
      link.download = `${fileNameWithoutExtension}-resized.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error resizing image:', error);
      alert('An error occurred while resizing the image.');
    } finally {
      setLoading(false);
    }
  };

  // Reset the tool
  const resetTool = () => {
    cancel();
    setWidth('');
    setHeight('');
    setPercentage(100);
    setAspectRatioLocked(true);
    setAspectRatio('Original');
    setExportFormat('jpeg');
    setImageDimensions(null);
    setFileDimensions(null);
  };

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-600 bg-clip-text text-transparent">
        Image Resizer
      </h1>

      {!imageMetadata ? (
        <FileDropzone
          setCurrentFile={fileUploaderProps.handleFileUpload}
          acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
          dropText="Drop image file here"
        >
          <UploadBox
            title="Resize your photos by dimensions or percentage for the web quickly and easily."
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileUploadEvent}
          />
        </FileDropzone>
      ) : (
        selectedFile &&
        imageDimensions && (
          <div className="mt-6 mb-6">
            {/* Image Preview */}
            <Image
              src={imageContent}
              alt="Uploaded image"
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="rounded-2xl object-contain mx-auto max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
              unoptimized
            />
            {/* Image Information */}
            <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400">
              <p className="font-medium">File Name: {imageMetadata?.name}</p>
              <p className="font-medium">File Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <p className="font-medium">File Dimensions: {fileDimensions || 'Loading...'}</p>
            </div>

            {/* Resize Mode Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => setResizeMode('dimensions')}
                active={resizeMode === 'dimensions'}
                className="px-3 py-2"
              >
                Resize by Dimensions
              </Button>
              <Button
                onClick={() => setResizeMode('percentage')}
                active={resizeMode === 'percentage'}
                className="px-3 py-2"
              >
                Resize by Percentage
              </Button>
            </div>

            {/* Dimensions / Percentage Inputs */}
            {resizeMode === 'dimensions' ? (
              <div className="flex flex-row justify-center gap-4 mt-6">
                {/* Width */}
                <div className="flex flex-col">
                  <label htmlFor="width" className="text-sm text-zinc-400 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    id="width"
                    value={width}
                    onChange={(e) => {
                      const value = e.target.value;
                      setWidth(value === '' ? '' : Number(value));
                      lastChanged.current = 'width';
                    }}
                    className="bg-zinc-700 text-zinc-200 rounded px-2 py-1 w-32"
                  />
                </div>
                {/* Height */}
                <div className="flex flex-col">
                  <label htmlFor="height" className="text-sm text-zinc-400 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => {
                      const value = e.target.value;
                      setHeight(value === '' ? '' : Number(value));
                      lastChanged.current = 'height';
                    }}
                    className="bg-zinc-700 text-zinc-200 rounded px-2 py-1 w-32"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-2 mt-6">
                {[100, 75, 50, 25].map((percent) => (
                  <Button
                    key={percent}
                    onClick={() => setPercentage(percent)}
                    active={percentage === percent}
                    className="px-3 py-2"
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
            )}

            {/* Aspect Ratio and Format Options */}
            <div className="flex flex-col items-center gap-4 mt-6">
              {/* Aspect Ratio */}
              <div className="flex items-center gap-2">
                <label htmlFor="aspectRatio" className="text-sm text-zinc-400">
                  Aspect Ratio:
                </label>
                <select
                  id="aspectRatio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="bg-zinc-700 text-zinc-200 rounded px-2 py-1"
                >
                  <option value="Original">Original</option>
                  <option value="1:1">1:1</option>
                  <option value="16:9">16:9</option>
                  <option value="4:3">4:3</option>
                  <option value="3:2">3:2</option>
                  <option value="2:1">2:1</option>
                </select>
              </div>

              {/* Maintain Aspect Ratio */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">Maintain Aspect Ratio:</label>
                <Switch
                  checked={aspectRatioLocked}
                  onChange={setAspectRatioLocked}
                  className={`${
                    aspectRatioLocked ? 'bg-orange-500' : 'bg-zinc-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
                >
                  <span className="sr-only">Maintain Aspect Ratio</span>
                  <span
                    className={`${
                      aspectRatioLocked ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                  />
                </Switch>
              </div>

              {/* Export Format */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">Export Format:</label>
                <div className="flex gap-2">
                  {['jpeg', 'png', 'webp'].map((format) => (
                    <Button
                      key={format}
                      onClick={() => setExportFormat(format as 'jpeg' | 'png' | 'webp')}
                      active={exportFormat === format}
                      className="px-3 py-2"
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handleResize} disabled={loading} aria-label="Resize & Download">
                {loading ? 'Resizing...' : 'Resize & Download'}
              </Button>
              <Button onClick={resetTool} aria-label="Start Over">
                Start Over
              </Button>
              <Button href="/" aria-label="Go Home">
                Go Home
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
