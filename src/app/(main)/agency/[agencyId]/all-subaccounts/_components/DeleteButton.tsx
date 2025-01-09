'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteSubAccount, getSubAccountDetails } from '@/queries/subaccount';
import { saveActivityLogsNotification } from '@/queries/notification';

import { AlertDialogAction } from '@/components/ui/alert-dialog';

interface DeleteButtonProps {
  subAccountId: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ subAccountId }) => {
  const router = useRouter();

  const onClickDelete = async () => {
    const response = await getSubAccountDetails(subAccountId);

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a subaccount | ${response?.name}`,
      subaccountId: subAccountId,
    });
    await deleteSubAccount(subAccountId);

    toast.success('Subaccount Delete', {
      description: 'Successfully Deleted your subaccount',
    });

    router.refresh();
  };

  return (
    <AlertDialogAction
      onClick={onClickDelete}
      className="bg-destructive hover:bg-destructive"
    >
      Delete subaccount
    </AlertDialogAction>
  );
};

export default DeleteButton;
