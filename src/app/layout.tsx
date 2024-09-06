// This component is responsible for rendering the layout of the application.
// It wraps the entire application in the ClerkProvider to manage the user context,
// NextThemesProvider to manage the theme context,
// and NextUIProvider to apply the UI theme and settings throughout the app.
import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/navigation/NavBar';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
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
    // Wrapping the entire application in ClerkProvider to manage the user context
    <ClerkProvider>
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
    </ClerkProvider>
  );
}
