import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from './components/theme/theme-provider';
import NavBar from './components/ui/NavBar';
import { robotoMono } from './components/theme/fonts';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AIS-Barcelona',
  description:
    'AIS-Barcelona receives and displays AIS data from the Barcelona area.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <ThemeProviders>
          <NavBar />
          <Suspense>{children}</Suspense>
        </ThemeProviders>
      </body>
    </html>
  );
}
