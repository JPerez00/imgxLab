'use client';

import { useState, useEffect } from 'react';
import { FileDropzone } from '@/components/shared/file-dropzone';
import { UploadBox } from '@/components/shared/upload-box';
import { Button } from '@/components/button';
import Image from 'next/image';

export default function FaviconTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDimensions, setFileDimensions] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const [fileName, setFileName] = useState<string>('');
  const [fileSizeKB, setFileSizeKB] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // On file selection
  const handleFileUpload = (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeKB((file.size / 1024).toFixed(2));
  };

  // Load image to get dimensions
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

  // Reset tool
  const resetTool = () => {
    setSelectedFile(null);
    setFileDimensions(null);
    setImageDimensions(null);
    setFileName('');
    setFileSizeKB('');
    setErrorMessage(null);
    setIsLoading(false);
  };

  // Convert the PNG by sending it to /api/favicon
  const convertToIco = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const arrayBuf = await selectedFile.arrayBuffer();
      const response = await fetch('/api/favicon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: arrayBuf,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to convert PNG to ICO.');
        setIsLoading(false);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Auto-download
      const link = document.createElement('a');
      link.href = downloadUrl;
      const baseName = fileName.replace(/\.[^.]+$/, '') || 'favicon';
      link.download = `${baseName}.ico`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error converting PNG to ICO:', error);
      setErrorMessage('An unexpected error occurred while converting the PNG to ICO.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-600 bg-clip-text text-transparent">
        PNG to ICO Favicon Generator
      </h1>

      {!selectedFile ? (
        <FileDropzone
          setCurrentFile={handleFileUpload}
          acceptedFileTypes={['image/png']}
          dropText="Drop PNG file here"
        >
          <UploadBox
            title="Upload a PNG file to generate a smaller, single-subimage 128×128 favicon (.ico)."
            accept="image/png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </FileDropzone>
      ) : (
        selectedFile &&
        imageDimensions && (
          <div className="mt-6 mb-6">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded PNG"
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="rounded-2xl object-contain mx-auto max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
              unoptimized
            />
            <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400">
              <p className="font-medium">File Name: {fileName}</p>
              <p className="font-medium">File Size: {fileSizeKB} KB</p>
              <p className="font-medium">File Dimensions: {fileDimensions || 'Loading...'}</p>
            </div>
          </div>
        )
      )}

      {errorMessage && !isLoading && (
        <div className="mt-6 text-center text-red-400">
          <p>{errorMessage}</p>
        </div>
      )}

      {selectedFile && (
        <div className="mt-8 text-center flex justify-center gap-4">
          <Button onClick={convertToIco} disabled={isLoading}>
            {isLoading ? 'Converting...' : 'Generate ICO'}
          </Button>
          <Button onClick={resetTool}>
            Start Over
          </Button>
          <Button href="/">
            Go Home
          </Button>
        </div>
      )}
    </div>
  );
}
