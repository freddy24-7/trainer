import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import NavBar from '@/components/navigation/NavBar';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'ClubTrainer',
  description: 'Trainers app for player feedback',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const user = await fetchAndCheckUser();

  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <NavBar user={user} />
            <main className="container mx-auto p-2">{children}</main>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
            />
          </NextThemesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
