"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Role, User } from "@prisma/client";

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
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};

// Adds a new user to an agency.
export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

///init user
export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();

  if (!user) {
    return new Error("User not found");
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

  await (clerkClient as any).users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || Role.SUBACCOUNT_USER,
    },
  });

  return userData;
};
