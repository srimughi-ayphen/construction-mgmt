import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from '@/components/shared/Providers';

//Providers-API + toast won’t work globally
//inter Next.js's built-in font optimization module
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Construction Manager',
  description: 'Construction project management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}