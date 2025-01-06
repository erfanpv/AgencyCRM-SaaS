import { auth } from '@clerk/nextjs/server';
import {
  createUploadthing,
  type FileRouter as UploadthingFileRouter,
} from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const authenticateUser = () => {
  const user = auth();

  if (!user) {
    throw new UploadThingError('Unauthorized');
  }

  return {
    user,
  };
};
// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  subAccountLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  agencyLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
} satisfies UploadthingFileRouter;

export type FileRouter = typeof fileRouter;
