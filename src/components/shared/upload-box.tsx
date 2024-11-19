import React from "react";
import { UploadIcon } from "lucide-react";

interface UploadBoxProps {
  title: string;
  description: string;
  accept: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadBox({
  title,
  description,
  accept,
  onChange,
}: UploadBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <p className="text-balance text-lg text-center text-zinc-300">{title}</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-xl border border-white/20 bg-zinc-900 p-10">
      <div className="flex items-center space-x-3">
        <UploadIcon className="h-6 w-6 text-zinc-300" />
        <p className="font-semibold text-zinc-300">Drag & Drop</p>
      </div>
        <p className="text-base text-zinc-500">Or</p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-75">
          <span>{description}</span>
          <input
            type="file"
            onChange={onChange}
            accept={accept}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}