import { ClerkProvider } from '@clerk/nextjs';
import { NextUIProvider } from '@nextui-org/react';
import type { Metadata } from 'next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import NavBar from '@/components/navigation/NavBar';
import Providers from '@/utils/Providers';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

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
              <Providers>
                <NavBar />
                <main className="container mx-auto p-2">{children}</main>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                />
              </Providers>
            </NextUIProvider>
          </NextThemesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
