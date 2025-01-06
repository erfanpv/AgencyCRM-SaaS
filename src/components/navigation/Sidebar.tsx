import React from 'react';
import {
  type AgencySidebarOption,
  type SubAccountSidebarOption,
} from '@prisma/client';
import { getAuthUserDetails } from '@/queries/auth';
import MenuOptions from './MenuOptions';

interface SidebarProps {
  id: string;
  type: 'agency' | 'subaccount';
}

const Sidebar: React.FC<SidebarProps> = async ({ id, type }) => {
  const user = await getAuthUserDetails();

  if (!user || !user.Agency) return null;

  const details =
    type === 'agency'
      ? user.Agency
      : user?.Agency.SubAccount.find(Subaccount => Subaccount.id === id);

  const isWhiteLabelAgency = user.Agency.whiteLabel;

  if (!details) return null;

  let sideBarLogo: string =
    user.Agency.agencyLogo || '/assets/agencyCRM-logo.svg';

  if (!isWhiteLabelAgency && type === 'subaccount') {
    const subAccountLogo = user?.Agency.SubAccount.find(
      subAccount => subAccount.id === id,
    )?.subAccountLogo;

    sideBarLogo = subAccountLogo || user.Agency.agencyLogo;
  }

  let sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOption[] = [];

  if (type === 'agency') {
    sidebarOptions = user.Agency.SidebarOption || [];
  } else {
    const subAccount = user.Agency.SubAccount.find(
      subaccount => subaccount.id === id,
    );

    sidebarOptions = subAccount?.SidebarOption || [];
  }

  const subAccounts = user.Agency.SubAccount.filter(subAccount =>
    user.Permissions.find(
      permission =>
        permission.subAccountId === subAccount.id && permission.access === true,
    ),
  );

  return (
    <>
      <MenuOptions
        defaultOpen
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOptions={sidebarOptions}
        subAccount={subAccounts}
        user={user}
      />
      <MenuOptions
        defaultOpen={false}
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOptions={sidebarOptions}
        subAccount={subAccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
