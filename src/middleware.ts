import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher(['/site', '/api/uploadthing']);

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${url.pathname}${
    searchParams ? `?${searchParams}  ` : ''
  }`;

  const hostname = req.headers.get('host') || '';

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Subdomain logic
  const customSubDomain = hostname
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url),
    );
  }

  // Redirect sign-in and sign-up routes
  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL('/agency/sign-in', req.url));
  }

  // Default rewrite for '/' or public pages
  if (
    url.pathname === '/' ||
    (url.pathname === '/site' && hostname === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL('/site', req.url));
  }

  return NextResponse.next();
});

// Middleware matcher configuration
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next/static|_next/image|favicon.ico).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
