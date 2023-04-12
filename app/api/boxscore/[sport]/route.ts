import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { BoxScoreData, BoxScoreError, BoxScoreResponse } from '@/types';

// How long in seconds the cache should last before expiring
const CACHE_TIMEOUT = 15;

const redis = Redis.fromEnv();

async function saveToRedis({key, data}: {key: string, data: any}) {
    const tx = redis.multi();
    tx.hset(key, data);
    tx.expire(key, CACHE_TIMEOUT);
    await tx.exec();
}

export async function GET(request: NextRequest, {params}: {params: {sport: string}}) {
    const { sport } = params;
    let data: BoxScoreResponse = {error: null};
    const MLB_REDIS_KEY = 'MLB';
    const NBA_REDIS_KEY = 'NBA';

    if (sport.toLowerCase() === 'mlb') {
        const mlbGameData = await redis.hgetall(MLB_REDIS_KEY);

        if (mlbGameData) {
            console.log('cache hit mlb');
            data = (mlbGameData as unknown) as BoxScoreData;
        } else {
            console.log('cache miss mlb, refetching');
            try {
                const key = MLB_REDIS_KEY;
                // We don't cache the response here, since we're using Redis to cache the data. This will only ever be called if the data is not in Redis, so we want fresh data.
                const mlbGameDataRequest = await fetch(process.env.MLB_DATA_ENDPOINT as string, {cache: 'no-store'});
                const mlbGameData: BoxScoreData = await mlbGameDataRequest.json();
                await saveToRedis({key, data: mlbGameData});
                data = mlbGameData;
            } catch (e) {
                console.error(e);
                data = {error: 'There was an error fetching MLB data.', data: null} as BoxScoreError;
            }
        }
    }

    if (sport.toLowerCase() === 'nba') {
        const nbaGameData = await redis.hgetall(NBA_REDIS_KEY);

        if (nbaGameData) {
            console.log('cache hit nba');
            data = (nbaGameData as unknown) as BoxScoreData;
        } else {
            console.log('cache miss nba, refetching');
            try {
                const key = NBA_REDIS_KEY;
                // We don't cache the response here, since we're using Redis to cache the data. This will only ever be called if the data is not in Redis, so we want fresh data.
                const nbaGameDataRequest = await fetch(process.env.NBA_DATA_ENDPOINT as string, {cache: 'no-store'});
                const nbaGameData: BoxScoreData = await nbaGameDataRequest.json();
                await saveToRedis({key, data: nbaGameData});
                data = nbaGameData;
            } catch (e) {
                console.error(e);
                data = {error: 'There was an error fetching NBA data.', data: null} as BoxScoreError;
            }
        }
    }

    return NextResponse.json(data);
}
