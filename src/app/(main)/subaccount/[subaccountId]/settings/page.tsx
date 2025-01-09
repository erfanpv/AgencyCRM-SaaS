import React from 'react';
import { redirect } from 'next/navigation';

import { getAuthUserDetails } from '@/queries/auth';
import { getSubAccountDetails } from '@/queries/subaccount';
import { getAgencyDetails } from '@/queries/agency';

import BlurPage from '@/components/global/BlurPage';
import SubAccountDetails from '@/components/forms/SubAccountDetails';
import { Agency } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

interface SubAccountSettingsPageProps {
  params: {
    subaccountId: string | undefined;
  };
}

const SubAccountSettingsPage: React.FC<SubAccountSettingsPageProps> = async ({
  params,
}) => {
  const { subaccountId } = params;
  const authUser = await currentUser();

  if (!subaccountId) redirect('/subaccount/unauthorized');
  if (!authUser) redirect('/agency/sign-in');

  const userDetails = await getAuthUserDetails();

  if (!userDetails) redirect('/subaccount/unauthorized');

  const subAccount = await getSubAccountDetails(subaccountId);

  if (!subAccount) redirect('/subaccount/unauthorized');

  const agencyDetails = await getAgencyDetails(subAccount.agencyId);

  return (
    <BlurPage>
      <div className="mt-4 flex items-center justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-8">
          <SubAccountDetails
            agencyDetails={agencyDetails as Agency}
            details={subAccount}
            userId={userDetails.id}
            userName={userDetails.name}
          />
        </div>
      </div>
    </BlurPage>
  );
};

export default SubAccountSettingsPage;
