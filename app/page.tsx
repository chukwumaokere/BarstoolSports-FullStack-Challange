import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    return (
        <main className={`flex h-full flex-col items-center justify-center gap-6 antialiased ${inter.className}`}>
            <h1 className='text-3xl'>Please choose a sport:</h1>
            <div className='flex flex-row gap-3'>
                <Link className='hover:text-blue-500 hover:font-bold' href='/mlb'>MLB</Link>
                <Link className='hover:text-blue-500 hover:font-bold' href='/nba'>NBA</Link>
            </div>
        </main>
    );
}
