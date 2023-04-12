import React from 'react';
import Header from '@/components/Header';
import './globals.css';

export const metadata = {
    title: 'Barstool Sports Score Tracker',
    description: '',
};

export default function RootLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en" className='h-full'>
            <body className='min-h-screen w-full flex flex-col px-4 sm:px-16 md:px-32 lg:px-48 xl:px-52 2xl:px-64 h-screen p-6 bg-gradient-to-br from-black from-30% via-black/75 via-80% to-black'>
                <Header />
                {children}
            </body>
        </html>
    );
}
