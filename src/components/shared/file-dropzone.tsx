import React, { useCallback, useState, useRef } from "react";

interface FileDropzoneProps {
  children: React.ReactNode;
  acceptedFileTypes: string[];
  dropText: string;
  setCurrentFile: (file: File) => void;
}

export function FileDropzone({
  children,
  acceptedFileTypes,
  dropText,
  setCurrentFile,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;

    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const droppedFile = files[0];

        if (!droppedFile) {
          alert("No files were uploaded. Please ensure you drag and drop valid files.");
          throw new Error("File upload error: No files detected.");
        }

        const fileName = droppedFile.name.toLowerCase();
        const fileType = droppedFile.type.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf("."));

        // Normalize accepted file types for consistent comparison
        const normalizedAcceptedTypes = acceptedFileTypes.map((type) =>
          type.replace("*", "").toLowerCase()
        );

        // Validate by MIME type or common image extensions
        const isValidType =
          normalizedAcceptedTypes.includes(fileType) ||
          (normalizedAcceptedTypes.includes("image/") &&
            [".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(fileExtension));

        if (!isValidType) {
          alert("Invalid file type. Please upload a supported file type.");
          return;
        }

        // Happy path
        setCurrentFile(droppedFile);
      }
    },
    [acceptedFileTypes, setCurrentFile]
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className="h-full w-full"
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="animate-in fade-in zoom-in relative flex h-[80%] w-[80%] transform items-center justify-center border border-white/20 transition-all duration-300 ease-out rounded-xl bg-zinc-900">
            <p className="text-2xl font-semibold text-white">{dropText}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
