'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useContext } from 'react';

import Navbar from '@/components/Navbar';
import { GlobalContext, default as GlobalState } from '@/context';

const inter = Inter({ subsets: ['latin'] });

function FullPageLoader() {
  return (
    <div className="absolute top-[80px] left-0 w-full h-[calc(100vh-80px)] flex items-center justify-center bg-white z-40">
      <div className="text-xl font-semibold animate-pulse">Loading...</div>
    </div>
  );
}

function LayoutBody({ children }) {
  const { pageLoading } = useContext(GlobalContext);

  return (
    <>
      <Navbar />
      <main className="relative flex bg-gray-50 min-h-screen flex-col mt-[80px]">
        {pageLoading && <FullPageLoader />}
        {children}
      </main>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalState>
          <LayoutBody>{children}</LayoutBody>
        </GlobalState>
      </body>
    </html>
  );
}
