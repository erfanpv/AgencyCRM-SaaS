import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

import { getAgencyDetails } from '@/queries/agency';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// import { constructMetadata, getStripeOAuthLink, logger } from "@/lib/utils";
// import { stripe } from "@/lib/stripe";

interface LaunchPagPageageProps {
  params: {
    agencyId: string | undefined;
  };
  searchParams: {
    code: string | undefined;
  };
}

const LaunchPagPageage: React.FC<LaunchPagPageageProps> = async ({
  params,
  searchParams,
}) => {
  const { agencyId } = params;
  const { code } = searchParams;

  if (!agencyId) redirect('/agency/unauthorized');

  const agencyDetails = await getAgencyDetails(agencyId);

  if (!agencyDetails) redirect('/agency/unauthorized');

  const isAllDetailsExist =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  // const stripeOAuthLink = getStripeOAuthLink(
  //   "agency",
  //   `launchpad___${agencyDetails.id}`
  // );
  
  let connectedStripeAccount: boolean = false;

  // if (code) {
  //   if (!agencyDetails.connectAccountId) {
  //     try {
  //       // connect stripe account
  //       const response = await stripe.oauth.token({
  //         grant_type: "authorization_code",
  //         code,
  //       });

  //       if (response?.stripe_user_id) {
  //         await updateAgencyConnectedId(agencyId, response?.stripe_user_id);
  //       }

  //       connectedStripeAccount = true;
  //     } catch (error) {
  //       logger("Could not connect stripe account", error);
  //     }
  //   }
  // }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-full w-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* <div className="flex justify-between items-center border p-4 rounded-md gap-2">
              <div className="flex md:items-center gap-4 flex-col md:flex-row">
                <Image
                  src="/appstore.png"
                  alt="App Logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Save the websites as a shortcut on your mobile devices.</p>
              </div>
              <Button>Start</Button>
            </div> */}
            <div className="flex items-center justify-between gap-2 rounded-md border p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Image
                  src="/stripelogo.png"
                  alt="App Logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your stripe account to accept payments and see your
                  dashboard.
                </p>
              </div>
              {agencyDetails.connectAccountId || connectedStripeAccount ? (
                <CheckCircle2
                  role="status"
                  aria-label="Done"
                  className="h-12 w-12 flex-shrink-0 p-2 text-emerald-500"
                />
              ) : (
                <Link href={'stripeOAuthLink'} className={buttonVariants()}>
                  Start
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 rounded-md border p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Image
                  src={agencyDetails.agencyLogo}
                  alt="App Logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Fill in all your business details</p>
              </div>
              {isAllDetailsExist ? (
                <CheckCircle2
                  role="status"
                  aria-label="Done"
                  className="h-12 w-12 flex-shrink-0 p-2 text-emerald-500"
                />
              ) : (
                <Link
                  href={`/agency/${agencyId}/settings`}
                  className={buttonVariants()}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPagPageage;
