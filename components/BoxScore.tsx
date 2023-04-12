'use client';

import React from 'react';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { BoxScoreResponse, Team } from '@/types';

async function getData({ queryKey }: { queryKey: (string | undefined)[] }): Promise<BoxScoreResponse | null> {
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

function getOrdinal(n: number) {
    let ord = 'th';

    if (n % 10 === 1 && n % 100 !== 11) {
        ord = 'st';
    } else if (n % 10 === 2 && n % 100 !== 12) {
        ord = 'nd';
    } else if (n % 10 === 3 && n % 100 !== 13) {
        ord = 'rd';
    }

    return ord;
}

export default function BoxScore({sport}: {sport: string}) {
    const { data, isLoading, isError } = useQuery({ queryKey: ['boxscore', sport], queryFn: getData});

    if (isLoading) {
        return <div className='text-white'>Loading...</div>;
    }

    if (isError || !data || 'error' in data) {
        return <div className='text-white'>Something went wrong while trying to fetch the data. Please refresh to try again!</div>;
    }

    // Shared Styles
    const containerStyles = classNames('w-full h-auto rounded-t-lg rounded-b-lg text-white antialiased overflow-hidden');
    const tableStyles = classNames('w-full table-auto');
    const blankSpaceStyles = classNames('border-r border-px border-black border-b');
    const cellStyles = classNames('p-4 border-b border-r border-px border-black text-center');
    const detailsBox = classNames('flex flex-row text-center items-center bg-gray-400 py-3 px-3 w-full');
    const teamContainerStyles = classNames('font-bold w-2/5 flex flex-col rounded-md');
    const teamNameStyles = classNames('text-5xl uppercase');
    const eventInfoStyles = classNames('bg-white text-black flex flex-row gap-4 justify-center py-3');

    const gameStatus = data.event_information.status === 'completed' ? 'Final' : 'In Progress';

    if (data.league === 'MLB' && 'away_batters' in data) {
        // MLB specific styles
        const runsHitsErrorsHeaderStyles = classNames('bg-blue-800/90 font-bold', cellStyles);
        const runsHitsErrorsStyles = classNames('bg-blue-700/80 font-bold', cellStyles);
        const teamNameCellStyles = classNames('bg-blue-800/80 font-bold', cellStyles);
        const headerRowStyles = classNames('bg-blue-800/60 rounded-t-lg');


        const awayRuns = data.away_period_scores.reduce((a, b) => a + b, 0);
        const homeRuns = data.home_period_scores.reduce((a, b) => a + b, 0);

        return (
            <div className={classNames(containerStyles, 'bg-blue-500')}>
                <table className={tableStyles}>
                    <thead>
                        <tr className={headerRowStyles}>
                            <th className={blankSpaceStyles}>&nbsp;</th>
                            {Array.from({length: data.home_period_scores.length}, (_, i) => i + 1).map((period) => {
                                return <th className={cellStyles} key={period}>{period}</th>;
                            })}
                            <th className={runsHitsErrorsHeaderStyles}>R</th>
                            <th className={runsHitsErrorsHeaderStyles}>H</th>
                            <th className={runsHitsErrorsHeaderStyles}>E</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={teamNameCellStyles}>
                                <span title={data.away_team.full_name}>
                                    {data.away_team.abbreviation}
                                </span>
                            </td>
                            {data.away_period_scores.map((score, index) => {
                                return <td className={cellStyles} key={index}>{score}</td>;
                            })}
                            <td className={runsHitsErrorsStyles}>{awayRuns}</td>
                            <td className={runsHitsErrorsStyles}>{data.away_batter_totals.hits}</td>
                            <td className={runsHitsErrorsStyles}>{data.away_errors}</td>
                        </tr>
                        <tr>
                            <td className={teamNameCellStyles}>
                                <span title={data.home_team.full_name}>
                                    {data.home_team.abbreviation}
                                </span>
                            </td>
                            {data.home_period_scores.map((score, index) => {
                                return <td className={cellStyles} key={index}>{score}</td>;
                            })}
                            <td className={runsHitsErrorsStyles}>{homeRuns}</td>
                            <td className={runsHitsErrorsStyles}>{data.home_batter_totals.hits}</td>
                            <td className={runsHitsErrorsStyles}>{data.home_errors}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={detailsBox}>
                    <div className={classNames(teamContainerStyles, 'bg-blue-500')}>
                        <span className={teamNameStyles}>
                            {data.away_team.last_name}
                        </span>
                        <span>
                            {data.away_team.full_name}
                        </span>
                    </div>
                    <div className='flex flex-col w-1/5'>
                        <span>{data.event_information.duration}</span>
                        <span className='text-2xl'>{gameStatus}</span>
                        <span className='text-2xl font-bold'>{awayRuns} - {homeRuns}</span>
                    </div>
                    <div className={classNames(teamContainerStyles, 'bg-blue-800')}>
                        <span className={teamNameStyles}>
                            {data.home_team.last_name}
                        </span>
                        <span>
                            {data.home_team.full_name}
                        </span>
                    </div>
                </div>
                <div className={eventInfoStyles}>
                    <span className='text-3xl'>{data.event_information.temperature}&deg;F</span>
                    <span className='text-2xl'>—</span>
                    <span className='text-2xl'>{`${data.event_information.site.name} in ${data.event_information.site.city}, ${data.event_information.site.state}`}</span>
                </div>
            </div>
        );
    }

    if (data.league === 'NBA') {
        // NBA Specific styles
        const pointsHeaderStyles = classNames('bg-orange-800/90 font-bold', cellStyles);
        const pointsStyle = classNames('bg-orange-700/80 font-bold', cellStyles);
        const teamNameCellStyles = classNames('bg-orange-800/80 font-bold', cellStyles);
        const headerRowStyles = classNames('bg-orange-800/60 rounded-t-lg');

        const awayScore = data.away_period_scores.reduce((a, b) => a + b, 0);
        const homeScore = data.home_period_scores.reduce((a, b) => a + b, 0);
        return (
            <div className={classNames(containerStyles, 'bg-orange-500')}>
                <table className={tableStyles}>
                    <thead>
                        <tr className={headerRowStyles}>
                            <th className={blankSpaceStyles}>&nbsp;</th>
                            {Array.from({length: data.home_period_scores.length}, (_, i) => i + 1).map((period) => {
                                return <th className={cellStyles} key={period}>{period}{getOrdinal(period)}</th>;
                            })}
                            <th className={pointsHeaderStyles}>PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={teamNameCellStyles}>
                                <span title={data.away_team.full_name}>
                                    {data.away_team.abbreviation}
                                </span>
                            </td>
                            {data.away_period_scores.map((score, index) => {
                                return <td className={cellStyles} key={index}>{score}</td>;
                            })}
                            <td className={pointsStyle}>{awayScore}</td>
                        </tr>
                        <tr>
                            <td className={teamNameCellStyles}>
                                <span title={data.home_team.full_name}>
                                    {data.home_team.abbreviation}
                                </span>
                            </td>
                            {data.home_period_scores.map((score, index) => {
                                return <td className={cellStyles} key={index}>{score}</td>;
                            })}
                            <td className={pointsStyle}>{homeScore}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={detailsBox}>
                    <div className={classNames(teamContainerStyles, 'bg-orange-500')}>
                        <span className={teamNameStyles}>
                            {data.away_team.last_name}
                        </span>
                        <span>
                            {data.away_team.full_name}
                        </span>
                    </div>
                    <div className='flex flex-col w-1/5'>
                        <span>{data.event_information.duration}</span>
                        <span className='text-2xl'>{gameStatus}</span>
                        <span className='text-2xl font-bold'>{awayScore} - {homeScore}</span>
                    </div>
                    <div className={classNames(teamContainerStyles, 'bg-orange-800')}>
                        <span className={teamNameStyles}>
                            {data.home_team.last_name}
                        </span>
                        <span>
                            {data.home_team.full_name}
                        </span>
                    </div>
                </div>
                <div className={eventInfoStyles}>
                    <span className='text-2xl'>{`${data.event_information.site.name} in ${data.event_information.site.city}, ${data.event_information.site.state}`}</span>
                </div>
            </div>
        );
    }

    return (
        <span className='text-2xl text-white'>Sorry, we don&apos;t have data for {sport}. Please select a sport from the header above to see BoxScore info!</span>
    );

}