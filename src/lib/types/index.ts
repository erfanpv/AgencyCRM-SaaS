import { getAuthUserDetails } from '@/queries/auth';
import { getMedia } from '@/queries/media';
import { getUserWithPermissionsAndSubAccount } from '@/queries/permission';
import type { Notification, Prisma, User } from '@prisma/client';

export type NotificationsWithUser =
  | ({ user: User } & Notification)[]
  | undefined;

export type AuthUserWithAgencySidebarOptionsAndSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserWithPermissionsAndSubAccount
>;
export type MediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubAccountInput;
