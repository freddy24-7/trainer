import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { NextUIProvider } from '@nextui-org/react';
import type { Metadata } from 'next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import NavBar from '@/app/NavBar';
import 'react-toastify/dist/ReactToastify.css';

export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'ClubTrainer',
  description: 'Trainers app for player feedback',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props): React.ReactElement {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <NextUIProvider>
              <NavBar />
              <main className="container mx-auto p-2">{children}</main>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
              />
            </NextUIProvider>
          </NextThemesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
