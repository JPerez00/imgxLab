'use client';

import { useState, useEffect } from 'react';
import { UploadBox } from '@/components/shared/upload-box';
import { FileDropzone } from '@/components/shared/file-dropzone';
import exifr from 'exifr';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/table';
import { Button } from '@/components/button';
import Image from 'next/image'; // Import Image component

type ExifData = {
  Make?: string;
  Model?: string;
};

type ShutterData = {
  Make: string | null;
  Model: string | null;
  ShutterCount: number | string | null;
};

export default function ShutterTool() {
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [shutterData, setShutterData] = useState<ShutterData>({
    Make: null,
    Model: null,
    ShutterCount: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDimensions, setFileDimensions] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null); // Added this line
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFile) {
      const img = new window.Image();
      img.onload = () => {
        setFileDimensions(`${img.width} × ${img.height}`);
        setImageDimensions({ width: img.width, height: img.height }); // Set image dimensions
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  }, [selectedFile]);

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
  
    try {
      // Parse EXIF data on the client side (optional)
      const exif = await exifr.parse(file);
  
      const make = exif?.Make || 'Unknown';
      const model = exif?.Model || 'Unknown';
  
      setExifData({
        Make: make,
        Model: model,
      });
  
      const base64File = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]); // Exclude data URL prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
      const response = await fetch('/api/get-shutter-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64File,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch shutter count.');
      }
  
      const data = await response.json();
  
      setShutterData({
        Make: data.Make || make,
        Model: data.Model || model,
        ShutterCount: data.shutterCount || 'Unavailable',
      });
    } catch (error) {
      console.error('Error retrieving shutter count:', error);
      setShutterData({
        Make: exifData?.Make || 'Unknown',
        Model: exifData?.Model || 'Unknown',
        ShutterCount: 'Unavailable',
      });
      alert('Failed to retrieve shutter count. Please try again with a different file.');
    } finally {
      setIsLoading(false);
    }
  };  

  const handleUpload = (file: File) => {
    handleFileChange(file);
  };

  const resetTool = () => {
    setExifData(null);
    setShutterData({ Make: null, Model: null, ShutterCount: null });
    setSelectedFile(null);
    setFileDimensions(null);
    setImageDimensions(null);
  };

  const tableData = [
    { label: 'Camera Brand', value: shutterData.Make || 'Unknown' },
    { label: 'Camera Model', value: shutterData.Model || 'Unknown' },
    { label: 'Shutter Count', value: shutterData.ShutterCount || 'Unavailable' },
  ];

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-500 bg-clip-text text-transparent">
        Shutter Count Checker
      </h1>
      {!selectedFile ? (
        <FileDropzone
          setCurrentFile={handleUpload}
          acceptedFileTypes={['image/*']}
          dropText="Drop image file here"
        >
          <UploadBox
            title="Upload an unedited JPEG photo from your camera to check its shutter count."
            description="Upload Image"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </FileDropzone>
      ) : (
        <div className="mt-6 mb-6">
          {imageDimensions && (
            <Image
              src={URL.createObjectURL(selectedFile!)}
              alt="Uploaded photograph"
              width={imageDimensions.width}
              height={imageDimensions.height}
              unoptimized
              className="rounded-2xl object-contain mx-auto max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
            />
          )}
          <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400 space-y-1">
            <p className="font-medium">File Name: {selectedFile.name}</p>
            <p className="font-medium">File Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p className="font-medium">File Dimensions: {fileDimensions || 'Loading...'}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-10 text-center text-zinc-400">
          <p>Processing your image...</p>
        </div>
      )}

      {!isLoading && (exifData || shutterData.ShutterCount) && (
        <div className="mt-10 w-full max-w-xl mx-auto">
          <h2 className="mb-4 text-2xl font-semibold text-white">Shutter Count Details:</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-xl font-bold text-white">Attribute</TableCell>
                <TableCell className="text-xl font-bold text-white">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold text-base text-zinc-300">{item.label}</TableCell>
                  <TableCell className="text-base text-zinc-300">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedFile && (
        <div className="mt-12 text-center flex justify-center gap-4">
          <Button onClick={resetTool}>
            Check Another Photograph
          </Button>
          <Button href="/">
            Go Home
          </Button>
        </div>
      )}
    </div>
  );
}
