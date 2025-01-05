"use server";

import { db } from "@/lib/db";

export const getSubAccountDetails = async (subAccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subAccountId,
    },
  });

  return response;
};

export const getSubAccountsByAgency = async (agencyId: string) => {
  const response = await db.subAccount.findMany({
    where: {
      agencyId,
    },
  });

  return response;
};
