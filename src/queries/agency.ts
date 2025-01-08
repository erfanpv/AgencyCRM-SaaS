'use server';

import db from '@/lib/db';
import { logger } from '@/lib/utils';
import { AgencyDetailsSchema } from '@/lib/validators/agency-details';
import { Agency } from '@prisma/client';

export const getAgencyDetails = async (agencyId: string) => {
  try {
    const agencyDetails = await db.agency.findUnique({
      where: {
        id: agencyId,
      },
      include: {
        subAccounts: true,
      },
    });

    if (!agencyDetails) throw new Error('Agency not found');

    return agencyDetails;
  } catch (error) {
    logger(error);
  }
};

//update agency details
export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<AgencyDetailsSchema>,
) => {
  if (!agencyDetails.goal) {
    throw new Error('The `goal` field is required.');
  }

  const response = await db.agency.update({
    where: {
      id: agencyId,
    },
    data: {
      ...agencyDetails,
      goal: agencyDetails.goal,
    },
  });

  return response;
};

//delete agency
export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({ where: { id: agencyId } });
  return response;
};

//agency creation
export const upsertAgency = async (agency: Agency) => {
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        sidebarOptions: {
          create: [
            {
              name: 'Dashboard',
              icon: 'category',
              link: `/agency/${agency.id}`,
            },
            {
              name: 'Launchpad',
              icon: 'clipboardIcon',
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: 'Billing',
              icon: 'payment',
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: 'Settings',
              icon: 'settings',
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: 'Sub Accounts',
              icon: 'person',
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: 'Team',
              icon: 'shield',
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });

    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};
