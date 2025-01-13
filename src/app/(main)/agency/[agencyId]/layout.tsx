import React from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';
import Sidebar from '@/components/navigation/Sidebar';
import BlurPage from '@/components/global/BlurPage';
import { verifyAndAcceptInvitation } from '@/queries/invitation';
import { getNotification } from '@/queries/notification';
import InfoBar from '@/components/global/InfoBar';

interface AgencyIdLayoutProps extends React.PropsWithChildren {
  params: {
    agencyId: string | undefined;
  };
}

const AgencyIdLayout: React.FC<AgencyIdLayoutProps> = async ({
  params,
  children,
}) => {
  const user = await currentUser();

  if (!user) redirect('/');

  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId || !params.agencyId) redirect('/agency');

  if (
    user.privateMetadata.role !== Role.AGENCY_OWNER &&
    user.privateMetadata.role !== Role.AGENCY_ADMIN
  ) {
    redirect('/agency/unauthorized');
  }

  const notifications = await getNotification(agencyId);

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications?.map(notification => ({
            ...notification,
            user: notification.user,
          }))}
          subAccountId={user.id}
          role={user.privateMetadata.role}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default AgencyIdLayout;
