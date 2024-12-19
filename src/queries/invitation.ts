"use server";
import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createTeamUser } from "./auth";
import { saveActivityLogsNotification } from "./notification";

// Handles accepting user invitations and linking them to an agency.
export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const invintationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  // check if user exist already to avoid duplicates users
  const isUserExist = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  if (isUserExist) {
    return isUserExist.agencyId;
  }

  if (invintationExists) {
    const userDetails = await createTeamUser(invintationExists.agencyId, {
      id: user.id,
      role: invintationExists.role,
      email: invintationExists.email,
      agencyId: invintationExists.agencyId,
      avatarUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await saveActivityLogsNotification({
      agencyId: invintationExists?.agencyId,
      description: "Joined",
      subaccountId: undefined,
    });

    if (userDetails) {
      await (clerkClient as any).users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });

      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });

      return userDetails.agencyId;
    }

    return null;
  }

  const agency = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return agency ? agency.agencyId : null;
};
