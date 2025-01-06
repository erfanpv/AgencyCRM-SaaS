'use client';
import React from 'react';
import { Role } from '@prisma/client';
import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ModeToggle } from './ModeToggle';
import { cn } from '@/lib/utils';
import { type NotificationsWithUser } from '@/lib/types';

interface InfoBarProps {
  notifications: NotificationsWithUser;
  subAccountId: string;
  role?: Role;
  className?: string;
}

const InfoBar: React.FC<InfoBarProps> = ({
  notifications,
  subAccountId,
  className,
  role,
}) => {
  const [allNotifications, setAllNotifications] =
    React.useState<NotificationsWithUser>(notifications);
  const [isShowAll, setIsShowAll] = React.useState<boolean>(true);
  const [animatedListRef] = useAutoAnimate();

  const handleSwitch = () => {
    if (!isShowAll) {
      setAllNotifications(notifications);
    } else {
      if (!!notifications?.length) {
        const filteredNotifications = notifications?.filter(
          notif => notif.subAccountId === subAccountId,
        );

        setAllNotifications(filteredNotifications ?? []);
      }
    }

    setIsShowAll(prev => !prev);
  };

  return (
    <>
      <div
        className={cn(
          'fixed left-0 right-0 top-0 z-[20] flex items-center gap-4 border-b-[1px] bg-background/80 p-4 backdrop-blur-md md:left-[300px]',
          className,
        )}
      >
        <div className="ml-auto flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="h-8 w-8 rounded-full">
                <Bell aria-label="Notifications" className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col pr-4">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription asChild>
                  <div>
                    {(role === Role.AGENCY_ADMIN ||
                      role === Role.AGENCY_OWNER) && (
                      <Card className="flex items-center justify-between p-4">
                        Current Subaccount
                        <Switch onCheckedChange={handleSwitch} />
                      </Card>
                    )}
                  </div>
                </SheetDescription>
              </SheetHeader>
              {!!allNotifications?.length && (
                <div
                  ref={animatedListRef}
                  className="scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium flex flex-col gap-4 overflow-y-auto"
                >
                  {allNotifications?.map(notification => (
                    <Card key={notification.id}>
                      <CardContent className="flex gap-4 p-4">
                        <Avatar>
                          <AvatarImage
                            src={notification.user.avatarUrl}
                            alt="Profile Picture"
                          />
                          <AvatarFallback className="bg-primary">
                            {notification.user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <p className="leading-tight">
                            <span className="font-semibold">
                              {notification.notification.split('|')[0]}
                            </span>
                            <span className="text-muted-foreground">
                              {notification.notification.split('|')[1]}
                            </span>
                            <span className="font-semibold">
                              {notification.notification.split('|')[2]}
                            </span>
                          </p>
                          <small className="text-sm text-muted-foreground">
                            {format(
                              new Date(notification.createdAt),
                              'dd.MM.yyyy hh:mm a',
                            )}
                          </small>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {!allNotifications?.length && (
                <div className="mb-4 flex items-center justify-center text-sm text-muted-foreground">
                  You have no notifications.
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
