import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/global/ModeToggle';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import agencyCRMLogo from '../../../../public/assets/agencyCRM-logo.svg';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = async ({}) => {
  const user = await currentUser();

  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
      <aside className="flex items-center gap-2">
        <Image src={agencyCRMLogo} width={40} height={40} alt="Plura Logo" />
        <span className="z-10 text-xl font-bold">AgencyCRM</span>
      </aside>
      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:block">
        <ul className="flex items-center gap-8">
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-inherit underline-offset-8',
              )}
              href="#"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-inherit underline-offset-8',
              )}
              href="#"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-inherit underline-offset-8',
              )}
              href="#"
            >
              Documentation
            </Link>
          </li>
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-inherit underline-offset-8',
              )}
              href="#"
            >
              Features
            </Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link href="/agency" className={cn(buttonVariants())}>
          {user ? 'Dashboard' : 'Get Started'}
        </Link>
        {user && <UserButton afterSignOutUrl="/" />}
        <ModeToggle />
      </aside>
    </header>
  );
};

export default Navigation;
