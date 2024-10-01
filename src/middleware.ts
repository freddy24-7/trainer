import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
});

export const config = {
  matcher: [
    '/((?!.*\\.(?:js|css|mjs|map|png|jpg|jpeg|gif|svg|ico|mp4|webm|woff|woff2|ttf|eot|otf)$|_next/static).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
  runtime: 'nodejs',
};
