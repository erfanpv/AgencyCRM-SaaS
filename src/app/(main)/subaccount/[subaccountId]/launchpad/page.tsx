import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

import { getSubAccountDetails } from '@/queries/subaccount';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import BlurPage from '@/components/global/BlurPage';

// import { constructMetadata, getStripeOAuthLink, logger } from "@/lib/utils";
// import { stripe } from '@/lib/stripe';

interface LaunchpadPageProps {
  searchParams: {
    state: string | undefined;
    code: string | undefined;
  };
  params: {
    subaccountId: string | undefined;
  };
}

const LaunchpadPage: React.FC<LaunchpadPageProps> = async ({
  params,
  searchParams,
}) => {
  const { code, state } = searchParams;
  const { subaccountId } = params;

  if (!subaccountId) redirect(`/subaccount/unauthorized`);

  const subAccountDetails = await getSubAccountDetails(subaccountId);

  if (!subAccountDetails) redirect(`/subaccount/unauthorized`);

  const allDetailsExist =
    subAccountDetails.address &&
    subAccountDetails.subAccountLogo &&
    subAccountDetails.city &&
    subAccountDetails.companyEmail &&
    subAccountDetails.companyPhone &&
    subAccountDetails.country &&
    subAccountDetails.name &&
    subAccountDetails.state;

  // const stripeOAuthLink = getStripeOAuthLink(
  //   'subaccount',
  //   `launchpad___${subAccountDetails.id}`,
  // );
  // let connectedStripeAccount: boolean = false;

  // if (code) {
  //   if (!subAccountDetails.connectAccountId) {
  //     try {
  //       // connect stripe account
  //       const response = await stripe.oauth.token({
  //         grant_type: 'authorization_code',
  //         code,
  //       });

  //       if (response?.stripe_user_id) {
  //         await updateSubAccountConnectedId(
  //           subaccountId,
  //           response?.stripe_user_id,
  //         );
  //       }

  //       connectedStripeAccount = true;
  //     } catch (error) {
  //       logger('Could not connect stripe account', error);
  //     }
  //   }
  // }

  return (
    <BlurPage>
      <div className="flex flex-col items-center justify-center">
        <div className="h-full w-full max-w-[800px]">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Lets get started!</CardTitle>
              <CardDescription>
                Follow the steps below to get your account setup correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* <div className="flex items-center justify-between gap-2 rounded-md border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Image
                    src="/appstore.png"
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>Save the website as a shortcut on your mobile devide</p>
                </div>
                <Button>Start</Button>
              </div> */}
              <div className="flex items-center justify-between gap-2 rounded-md border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Image
                    src="/stripelogo.png"
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>
                    Connect your stripe account to accept payments. Stripe is
                    used to run payouts.
                  </p>
                </div>
                {subAccountDetails.connectAccountId || false ? (
                  <CheckCircle2
                    role="status"
                    aria-label="Done"
                    className="h-12 w-12 flex-shrink-0 p-2 text-emerald-500"
                  />
                ) : (
                  <Link className={buttonVariants()} href={''}>
                    Start
                  </Link>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 rounded-md border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Image
                    src={subAccountDetails.subAccountLogo}
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain p-4"
                  />
                  <p>Fill in all your business details.</p>
                </div>
                {allDetailsExist ? (
                  <CheckCircle2
                    role="status"
                    aria-label="Done"
                    className="h-12 w-12 flex-shrink-0 p-2 text-emerald-500"
                  />
                ) : (
                  <Link
                    className={buttonVariants()}
                    href={`/subaccount/${subAccountDetails.id}/settings`}
                  >
                    Start
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  );
};

export default LaunchpadPage;
