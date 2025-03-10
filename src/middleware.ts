import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/instructions(.*)',
  '/match-stats(.*)',
  '/matches(.*)',
  '/player-management(.*)',
  '/poule-management(.*)',
  '/training-stats(.*)',
  '/trainings(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.url?.startsWith('/api/inngest')) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
