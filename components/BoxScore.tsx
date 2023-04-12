'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

async function getData({ queryKey }: { queryKey: (string | undefined)[] }) {
    try {
        const [, sport] = queryKey;
        const response = await fetch(`/api/boxscore/${sport}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default function BoxScore({sport}: {sport: string}) {
    const { data, isLoading, isError } = useQuery({ queryKey: ['boxscore', sport], queryFn: getData});

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong while trying to fetch the data. Please refresh to try again!</div>;
    }

    return (
        <div>
            <h1>{sport.toUpperCase()} Boxscore</h1>
        </div>
    );
}