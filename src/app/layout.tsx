import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/navigation/NavBar';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'ClubTrainer',
  description: 'Trainers app for player feedback',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
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
