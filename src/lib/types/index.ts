import { getAuthUserDetails } from '@/queries/auth';
import { getMedia } from '@/queries/media';
import { getUserWithPermissionsAndSubAccount } from '@/queries/permission';
import { getPipelineDetails } from '@/queries/pipelines';
import { getTicketsWithTags } from '@/queries/tickets';
import type {
  Contact,
  Lane,
  Notification,
  Prisma,
  Tag,
  Ticket,
  User,
} from '@prisma/client';

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

export type TicketAndTags = Ticket & {
  tags: Tag[];
  assigned: User | null;
  customer: Contact | null;
};

export type LaneDetails = Lane & {
  tickets: TicketAndTags[];
};

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export type TicketsWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;