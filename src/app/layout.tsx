import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/navigation/NavBar';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

// Defining metadata for the page, which includes the title and description
export const metadata: Metadata = {
  title: 'ClubTrainer', // The title of the page, which appears in the browser tab
  description: 'Trainers app for player feedback', // A brief description of the page for SEO and social sharing
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    // Wrapping the application in ClerkProvider to manage the user context
    <html lang="en">
      <body>
        {/* Wrapping the application in NextThemesProvider to manage the theme context */}
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {/* Wrapping the application in NextUIProvider to apply the UI theme and settings throughout the app */}
          <NextUIProvider>
            {/* Rendering the NavBar at the top of the page for navigation */}
            <NavBar />
            {/* Main content area with container and padding styles applied */}
            <main className="container mx-auto p-2">{children}</main>
          </NextUIProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
