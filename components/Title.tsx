import React from 'react';
import { Bebas_Neue } from 'next/font/google';

const bebas = Bebas_Neue({ weight: ['400'], style: ['normal'], subsets: ['latin'] });

export default function Title({children}: {children: React.ReactNode}) {
    return (
        <h1 className={`text-5xl bg-clip-text bg-gradient-to-b from-blue-400 to to-blue-800 font-semibold tracking-wide text-transparent ${bebas.className}`}>{children}</h1>
    );
}