import React from 'react';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

import { verifyAndAcceptInvitation } from '@/queries/invitation';
import { getAuthUserDetails } from '@/queries/auth';
import { getNotification } from '@/queries/notification';

import Sidebar from '@/components/navigation/Sidebar';
import InfoBar from '@/components/global/InfoBar';
import { NotificationsWithUser } from '@/lib/types';
import { currentUser } from '@clerk/nextjs/server';

interface SubAccountIdLayoutProps {
  children: React.ReactNode;
  params: {
    subaccountId: string | undefined;
  };
}

const SubAccountIdLayout: React.FC<SubAccountIdLayoutProps> = async ({
  children,
  params,
}) => {
  const { subaccountId } = params;
  const agencyId = await verifyAndAcceptInvitation();

  if (!subaccountId) redirect(`/subaccount/unauthorized`);
  if (!agencyId) redirect(`/subaccount/unauthorized`);

  const user = await currentUser();

  if (!user) redirect(`/agency/sign-in`);

  let notifications: NotificationsWithUser = [];

  if (!user.privateMetadata.role) {
    redirect(`/subaccount/unauthorized`);
  }

  const authUser = await getAuthUserDetails();
  const hasPermission = authUser?.permissions.find(
    permission => permission.access && permission.subAccountId === subaccountId,
  );
  if (!hasPermission) redirect(`/subaccount/unauthorized`);

  const allNotifications = await getNotification(agencyId);

  if (
    user.privateMetadata.role === Role.AGENCY_ADMIN ||
    user.privateMetadata.role === Role.AGENCY_OWNER
  ) {
    notifications = allNotifications;
  } else {
    const filteredNotifications = allNotifications?.filter(
      notification => notification.subAccountId === subaccountId,
    );
    if (filteredNotifications) notifications = filteredNotifications;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default SubAccountIdLayout;
