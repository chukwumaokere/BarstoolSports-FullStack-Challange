import React from 'react';
import QueryContext from '@/contexts/QueryContext';
import BoxScore from '@/components/BoxScore';

export default function SportPage({params}: {params: {sport: string}}) {
    const { sport } = params;
    return (
        <div className='w-full flex flex-col gap-4 justify-center h-full items-center'>
            <QueryContext>
                <BoxScore sport={sport} />
            </QueryContext>
        </div>
    );
}