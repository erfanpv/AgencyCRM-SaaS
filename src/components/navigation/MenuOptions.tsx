'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  type User,
  type AgencySidebarOption,
  type SubAccount,
  type SubAccountSidebarOption,
  type Agency,
  type Permissions,
  Role,
} from '@prisma/client';
import { ChevronsUpDown, Compass, Menu, PlusCircle } from 'lucide-react';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { AspectRatio } from '../ui/aspect-ratio';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { ScrollArea } from '../ui/scroll-area';
import CustomModal from '../global/CustomModal';
import SubAccountDetails from '../forms/SubAccountDetails';

import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/use-modal';
import { Separator } from '../ui/separator';
import { icons } from '../ui/icons';
import clsx from 'clsx';

interface MenuOptionsProps {
  id: string;
  defaultOpen?: boolean;
  sideBarLogo: string;
  subAccount: SubAccount[];
  sideBarOptions: AgencySidebarOption[] | SubAccountSidebarOption[];
  details: Agency | SubAccount;
  user: any;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({
  details,
  id,
  sideBarLogo,
  sideBarOptions,
  subAccount,
  user,
  defaultOpen,
}) => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const { setOpen } = useModal();
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isOwnerOrAdmin =
    user.role === Role.AGENCY_ADMIN || user.role === Role.AGENCY_OWNER;

  return (
    <Sheet modal={false} open={defaultOpen ? true : undefined}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] flex md:hidden"
      >
        <Button size="icon" variant="outline">
          <Menu aria-label="Open Menu" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className={clsx(
          'fixed top-0 border-r-[1px] bg-background/80 p-6 backdrop-blur-xl',
          {
            'z-0 hidden w-[300px] md:inline-block': defaultOpen,
            'z-[100] inline-block w-full md:hidden': !defaultOpen,
          },
        )}
      >
        <div className="">
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sideBarLogo}
              alt="Sidebar logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="my-4 flex w-full items-center justify-between py-8"
                variant="ghost"
              >
                <div className="flex items-center gap-2 text-left">
                  <Compass aria-hidden />
                  <div className="flex flex-col">
                    {details.name}
                    <span className="text-muted-foreground">
                      {details.address}
                    </span>
                  </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[200] mt-4 h-80 overflow-y-hidden">
              <Command>
                <CommandInput placeholder="Search Accounts..." />
                <ScrollArea className="rounded-md">
                  <CommandList className="overflow-y-hidden pb-16">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {isOwnerOrAdmin && user.agency && (
                      <CommandGroup
                        heading="Agency"
                        className="overflow-y-hidden"
                      >
                        <CommandItem className="my-2 rounded-md border border-border bg-transparent p-2 text-primary transition-all hover:bg-muted">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user.agency.id}`}
                              className="flex h-full w-full gap-4"
                            >
                              <div className="relative w-10">
                                <Image
                                  src={user.agency.agencyLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-1 flex-col">
                                {user.agency.name}
                                <span className="text-muted-foreground">
                                  {user.agency.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user.agency.id}`}
                                className="flex h-full w-full gap-4"
                              >
                                <div className="relative w-10">
                                  <Image
                                    src={user.agency.agencyLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-1 flex-col">
                                  {user.agency.name}
                                  <span className="text-muted-foreground">
                                    {user.agency.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                    <CommandGroup heading="Accounts">
                      {!!subAccount.length ? (
                        subAccount.map(sub => (
                          <CommandItem key={sub.id}>
                            {defaultOpen ? (
                              <Link
                                href={`/subaccount/${sub.id}`}
                                className="flex h-full w-full gap-4"
                              >
                                <div className="relative w-10">
                                  <Image
                                    src={sub.subAccountLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-1 flex-col">
                                  {sub.name}
                                  <span className="text-muted-foreground">
                                    {sub.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/subaccount/${sub.id}`}
                                  className="flex h-full w-full gap-4"
                                >
                                  <div className="relative w-10">
                                    <Image
                                      src={sub.subAccountLogo}
                                      alt="Agency Logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-1 flex-col">
                                    {sub.name}
                                    <span className="text-muted-foreground">
                                      {sub.address}
                                    </span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      ) : (
                        <div className="w-full text-center text-xs text-muted-foreground">
                          No accounts found.
                        </div>
                      )}
                    </CommandGroup>
                  </CommandList>
                </ScrollArea>
                {isOwnerOrAdmin && (
                  <SheetClose asChild>
                    <div>
                      <Button
                        onClick={() =>
                          setOpen(
                            <CustomModal
                              title="Create A Subaccount"
                              subTitle="You can switch between your agency account and the subaccount from the sidebar"
                            >
                              <SubAccountDetails
                                agencyDetails={user.Agency!}
                                userId={user.id}
                                userName={user.name}
                              />
                            </CustomModal>,
                          )
                        }
                        className="mt-4 flex w-full items-center gap-2"
                      >
                        <PlusCircle aria-hidden className="h-4 w-4" />
                        Create Sub Account
                      </Button>
                    </div>
                  </SheetClose>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <p className="mb-2 text-xs text-muted-foreground">Menu Links</p>
          <Separator className="mb-4" />
          <nav className="relative">
            <Command className="bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {sideBarOptions.map(option => {
                    let value;
                    const Result = icons.find(
                      icon => icon.value === option.icon,
                    );

                    if (Result) {
                      value = <Result.path />;
                    }
                    return (
                      <CommandItem
                        key={option.id}
                        className={cn(
                          'w-full transition-all aria-selected:bg-inherit',
                          {
                            'bg-primary font-bold text-white':
                              pathname === option.link,
                          },
                        )}
                      >
                        <Link
                          href={option.link}
                          className="flex w-full items-center gap-2 rounded-md"
                        >
                          {value}
                          <span>{option.name}</span>
                        </Link>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
