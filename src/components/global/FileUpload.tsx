import React from 'react';
import Image from 'next/image';
import { File, X } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';
import { fileRouter } from '@/app/api/uploadthing/core';
import { Button } from '../ui/button';

interface FileUploadProps {
  endpoint: keyof typeof fileRouter;
  onChange: (url?: string) => void;
  value: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  const fileFormat = value?.split('.').pop();

  if (value) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {fileFormat !== 'pdf' ? (
          <div className="relative h-40 w-40">
            <Image
              src={value}
              className="object-contain"
              fill
              alt="Uploaded image"
            />
          </div>
        ) : (
          <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
            <File aria-hidden />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreffer"
              className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
            >
              View PDF
            </a>
          </div>
        )}
        <Button
          onClick={() => onChange('')}
          variant="ghost"
          type="button"
          className="flex items-center gap-2"
        >
          <X aria-hidden className="h-4 w-4" />
          Remove Image
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-dashed bg-muted/30">
      <UploadDropzone
        endpoint={endpoint}
        className="mt-0 rounded-md"
        onClientUploadComplete={res => {
          onChange(res?.[0].url);
        }}
        onUploadError={error => {
          console.log(error);
        }}
      />
    </div>
  );
};

export default FileUpload;
