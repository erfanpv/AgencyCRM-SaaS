'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Copy, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { type Media } from '@prisma/client';

import { deleteMedia } from '@/queries/media';
import { saveActivityLogsNotification } from '@/queries/notification';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { useModal } from '@/hooks/use-modal';

interface MediaCardProps {
  file: Media;
}

const MediaCard: React.FC<MediaCardProps> = ({ file }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { setClose } = useModal();

  const handleDelete = async () => {
    setIsLoading(true);

    const response = await deleteMedia(file.id);

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a media file | ${response?.name}`,
      subaccountId: response.subAccountId,
    });

    toast.success('Deleted File', {
      description: 'Successfully deleted the file',
    });

    setIsLoading(false);
    setClose();
    router.refresh();
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="w-full rounded-md border bg-background">
          <div className="relative h-40 w-full rounded-se-md rounded-ss-md bg-muted">
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="rounded-md object-contain"
            />
          </div>
          <p className="h-0 w-0 opacity-0">{file.name}</p>
          <div className="relative p-4">
            <p className="text-xs text-muted-foreground">
              {format(new Date(file.createdAt), 'dd.MM.yyyy hh:mm a')}
            </p>
            <p className="text-base">{file.name}</p>
            <div className="absolute right-4 top-4 cursor-pointer p-[1px]">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast.success('Copied To Clipboard');
              }}
            >
              <Copy aria-hidden className="h-4 w-4" /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 text-destructive">
                <Trash aria-hidden className="h-4 w-4" /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;
