'use client';

import { useState, useEffect } from 'react';
import exifr from 'exifr';
import Image from 'next/image';
import { UploadBox } from '@/components/shared/upload-box';
import { FileDropzone } from '@/components/shared/file-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/table';
import { Button } from '@/components/button';

type ExifData = {
  Make?: string;
  Model?: string;
  LensMake?: string;
  LensModel?: string;
  FocalLength?: number;
  FocalLengthIn35mmFormat?: number;
  FNumber?: number;
  ExposureTime?: number;
  ISO?: number;
  ExposureCompensation?: number;
  ExposureBiasValue?: number;
  FilmMode?: string;
  Simulation?: string;
  Flash?: string;
  DateTimeOriginal?: string;
  GPSLatitude?: number;
  GPSLongitude?: number;
  ColorSpace?: number | null;
  Copyright?: string;
  [key: string]: unknown; // Use unknown instead of any
};

export default function MetadataTool() {
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDimensions, setFileDimensions] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);

    try {
      const exif = await exifr.parse(file, {
        tiff: true,
        exif: true,
        gps: true,
      });

      if (exif) {
        const extractedData: ExifData = {
          ...exif,
          Copyright: exif.Copyright || 'Unknown',
          ColorSpace: exif.ColorSpace || null,
        };
        setExifData(extractedData);
      }
    } catch (error) {
      console.error('Error reading EXIF data:', error);
      alert('Failed to read EXIF data from the image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (file: File) => {
    handleFileChange(file);
  };

  const resetTool = () => {
    setExifData(null);
    setSelectedFile(null);
    setFileDimensions(null);
    setImageDimensions(null);
  };

  const formatExposureTime = (exposureTime: number) => {
    if (exposureTime >= 1) {
      return `${exposureTime} sec`;
    } else {
      const denominator = Math.round(1 / exposureTime);
      return `1/${denominator} sec`;
    }
  };

  const colorSpaceToString = (colorSpace: number) => {
    switch (colorSpace) {
      case 1:
        return 'sRGB';
      case 65535:
        return 'Uncalibrated';
      default:
        return `Unknown (${colorSpace})`;
    }
  };

  const tableData = [
    { label: 'Camera Brand', value: exifData?.Make || 'Unknown' },
    { label: 'Camera Model', value: exifData?.Model || 'Unknown' },
    { label: 'Lens Make', value: exifData?.LensMake || null },
    { label: 'Lens Model', value: exifData?.LensModel || null },
    { label: 'Focal Length', value: exifData?.FocalLength ? `${exifData.FocalLength} mm` : null },
    { label: 'Equivalent In Full Frame', value: exifData?.FocalLengthIn35mmFormat ? `${exifData.FocalLengthIn35mmFormat} mm` : null },
    { label: 'Aperture', value: exifData?.FNumber ? `f/${exifData.FNumber}` : null },
    { label: 'Shutter Speed', value: exifData?.ExposureTime ? formatExposureTime(exifData.ExposureTime) : null },
    { label: 'ISO', value: exifData?.ISO || null },
    { label: 'Exposure Compensation', value: exifData?.ExposureCompensation || exifData?.ExposureBiasValue || null },
    { label: 'Fujifilm Simulation', value: exifData?.FilmMode || exifData?.Simulation || null },
    { label: 'Flash', value: exifData?.Flash || null },
    { label: 'Date', value: exifData?.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toLocaleString() : null },
    { label: 'Location', value: exifData?.GPSLatitude && exifData?.GPSLongitude ? `Latitude: ${exifData.GPSLatitude}, Longitude: ${exifData.GPSLongitude}` : null },
    { label: 'Copyright', value: exifData?.Copyright || null },
    { label: 'Color Space', value: exifData?.ColorSpace ? colorSpaceToString(exifData.ColorSpace) : null },
  ].filter((item) => item.value);

  return (
    <div className="mt-12 md:mt-16 mb-20 w-full max-w-2xl mx-auto">
      <h1 className="mb-2 text-3xl md:text-4xl font-bold leading-tight md:leading-[2.8rem] text-center tracking-tight bg-gradient-to-br from-white from-25% to-orange-600 bg-clip-text text-transparent">
        Image Metadata Analyzer
      </h1>
      {!selectedFile ? (
        <FileDropzone
          setCurrentFile={handleUpload}
          acceptedFileTypes={['image/*']}
          dropText="Drop image file here"
        >
          <UploadBox
            title="Upload your unedited JPEG photos below to instantly view all their EXIF metadata and details."
            description="Upload Image"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </FileDropzone>
      ) : (
        selectedFile &&
        imageDimensions && (
          <div className="mt-6 mb-6">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded photograph"
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="rounded-2xl object-contain mx-auto max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ring-1 ring-white/10 shadow"
            />
            <div className="mt-8 md:mt-6 text-center text-sm md:text-base text-zinc-400">
              <p className="font-medium">File Name: {selectedFile.name}</p>
              <p className="font-medium">File Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <p className="font-medium">File Dimensions: {fileDimensions || 'Loading...'}</p>
            </div>
          </div>
        )
      )}

      {isLoading && (
        <div className="mt-10 text-center text-zinc-400">
          <p>Loading EXIF data...</p>
        </div>
      )}

      {exifData && !isLoading && (
        <div className="mt-10 w-full max-w-xl mx-auto">
          <h2 className="mb-4 text-2xl font-semibold text-white">Your EXIF Metadata:</h2>
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
