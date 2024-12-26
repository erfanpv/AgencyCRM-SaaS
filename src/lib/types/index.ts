import type { Notification, User } from "@prisma/client";

export type NotificationsWithUser =
  | ({ user: User } & Notification)[]
  | undefined;
