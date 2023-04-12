import React from 'react';
import QueryContext from '@/contexts/QueryContext';
import BoxScore from '@/components/BoxScore';

export default function SportPage({params}: {params: {sport: string}}) {
    const { sport } = params;
    return (
        <QueryContext>
            <BoxScore sport={sport} />
        </QueryContext>
    );
}