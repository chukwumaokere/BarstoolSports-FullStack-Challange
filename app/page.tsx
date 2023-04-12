import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    return (
        <main className={`flex h-full flex-col items-center justify-center gap-6 antialiased ${inter.className}`}>
            <h1 className='text-3xl'>Please choose a sport:</h1>
            <div className='flex flex-row gap-3'>
                <Link className='hover:after:border-b hover:after:content-[""] hover:after:w-full hover:after:border-blue-400 hover:after:absolute hover:after:bottom-0' href='/mlb'>MLB</Link>
                <Link href='/nba'>NBA</Link>
            </div>
        </main>
    );
}
