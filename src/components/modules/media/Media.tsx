import React from 'react';
import { FolderOpen } from 'lucide-react';

import MediaUploadButton from './MediaUploadButton';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/command';
import MediaCard from './MediaCard';
import { type MediaFiles } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MediaProps {
  subAccountId: string;
  data: MediaFiles;
  headerClassName?: string;
}

const Media: React.FC<MediaProps> = ({
  subAccountId,
  data,
  headerClassName,
}) => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className={cn('flex items-center justify-between', headerClassName)}>
        <h1 className="text-3xl font-bold">Media Bucket</h1>
        <MediaUploadButton subAccountId={subAccountId} />
      </div>
      <Command className="px-6 py-4">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="max-h-full pb-40">
          {!!data?.media.length && (
            <CommandEmpty>No media files found.</CommandEmpty>
          )}
          <CommandGroup>
            <div className="flex flex-wrap gap-4 bg-transparent pt-4">
              {data?.media.map(file => (
                <CommandItem
                  key={file.id}
                  className="w-full max-w-[300px] rounded-lg bg-transparent p-0 font-medium text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.media.length && (
                <div className="flex w-full flex-col items-center justify-center gap-2 pb-10">
                  <FolderOpen className="h-32 w-32 text-muted-foreground" />
                  <p className="text-center text-xs font-medium text-muted-foreground">
                    Your media bucket is empty. No files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Media;
