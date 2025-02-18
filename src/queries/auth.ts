'use server';

import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import db from '@/lib/db';
import { Role, User } from '@prisma/client';
import { logger } from '@/lib/utils';

export const getAuthUser = async (email: string) => {
  try {
    const details = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!details) {
      throw new Error('Not authorized');
    }

    return details as User;
  } catch (error) {
    logger(error);
  }
};

// Fetches details of the logged-in user, including their agency and permissions.
export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      agency: {
        include: {
          sidebarOptions: true,
          subAccounts: {
            include: {
              sidebarOptions: true,
            },
          },
        },
      },
      permissions: true,
    },
  });

  return userData;
};

// Adds a new user to an agency.
export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === 'AGENCY_OWNER') return null;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

///init user
export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();

  if (!user) {
    return new Error('User not found');
  }

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || Role.SUBACCOUNT_USER,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || Role.SUBACCOUNT_USER,
    },
  });

  return userData;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });

  await clerkClient.users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || Role.SUBACCOUNT_USER,
    },
  });

  return response;
};

export const getAuthUserGroup = async (agencyId: string) => {
  const teamMembers = await db.user.findMany({
    where: {
      agency: {
        id: agencyId,
      },
    },
    include: {
      agency: { include: { subAccounts: true } },
      permissions: { include: { subAccount: true } },
    },
  });

  return teamMembers;
};

export const deleteUser = async (userId: string) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  });
  await clerkClient.users.deleteUser(userId);
  const deletedUser = await db.user.delete({ where: { id: userId } });

  return deletedUser;
};
