import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

import { getAuthUserDetails } from '@/queries/auth';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import DeleteButton from './_components/DeleteButton';
import CreateButton from './_components/CreateButton';

interface AllSubAccountsPageProps {
  params: {
    agencyId: string | undefined;
  };
}

const AllSubAccountsPage: React.FC<AllSubAccountsPageProps> = async ({
  params,
}) => {
  const { agencyId } = params;

  const user = await getAuthUserDetails();

  if (!agencyId) redirect('/agency/unauthorized');
  if (!user) redirect('/agency/sign-in');

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <div className="flex justify-center md:justify-start">
          <CreateButton user={user} agencyId={agencyId} />
        </div>
        <Command className="bg-transparent">
          <CommandInput placeholder="Search accounts..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.agency?.subAccounts.length ? (
                user.agency.subAccounts.map(subAccount => (
                  <CommandItem
                    key={subAccount.id}
                    className="my-2 h-32 cursor-pointer border border-border bg-background p-4 text-primary"
                  >
                    <Link
                      href={`/subaccount/${subAccount.id}`}
                      className="flex h-full w-full gap-4"
                    >
                      <div className="h-2w-28 relative w-28">
                        <Image
                          src={subAccount.subAccountLogo}
                          alt="Subaccount logo"
                          fill
                          className="rounded-md bg-muted/50 object-contain p-4"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {subAccount.name}
                          <span className="text-xs text-muted-foreground">
                            {subAccount.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="w-20">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the subaccount and all data related to
                          subaccount.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <DeleteButton subAccountId={subAccount.id} />
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No subaccounts
                </div>
              )}
            </CommandGroup>
            <CommandItem></CommandItem>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default AllSubAccountsPage;
