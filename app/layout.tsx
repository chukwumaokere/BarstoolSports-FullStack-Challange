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
            <body className='min-h-screen flex flex-col items-center h-screen p-6'>
                <Header />
                {children}
            </body>
        </html>
    );
}
