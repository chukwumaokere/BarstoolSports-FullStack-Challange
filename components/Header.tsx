'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Title from '@/components/Title';
import Link from 'next/link';

interface NavLink {
    name: string;
    link: string;
}

const navigation: NavLink[] = [
    {
        name: 'MLB Boxscore',
        link: '/mlb',
    },
    {
        name: 'NBA Boxscore',
        link: '/nba',
    },
];

export default function Header() {
    const pathName = usePathname();
    const paths = pathName.split('/');

    return (
        <nav className='flex flex-col gap-2'>
            <Link href='/'>
                <Title>Barstool Sports Score Tracker</Title>
            </Link>
            <ul className='flex flex-row gap-4 grow'>
                {
                    navigation.map((nav: NavLink) => {
                        return (
                            <li className='relative' key={nav.link}>
                                <Link href={nav.link} className={`${paths?.includes(nav.link.substring(1)) ?
                                    'after:border-b after:content-[""] after:w-full after:-translate-x-full after:border-blue-400 after:absolute after:bottom-0 after:'
                                    : ''}
                                text-white font-semibold antialiased hover:text-blue-500`}>{nav.name}</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
}