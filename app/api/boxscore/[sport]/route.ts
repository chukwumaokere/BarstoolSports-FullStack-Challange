import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { BoxScoreData } from '@/types';

const CACHE_TIMEOUT = 15;

const redis = Redis.fromEnv();

async function saveToRedis({key, data}: {key: string, data: BoxScoreData}) {
    const tx = redis.multi();
    tx.hset(key, {data: data});
    tx.expire(key, CACHE_TIMEOUT);
    await tx.exec();
}

export async function GET(request: NextRequest, {params}: {params: {sport: string}}) {
    const { sport } = params;
    // How long in seconds the cache should last before expiring
    const data = new Map([]);
    const MLB_REDIS_KEY = 'MLB';
    const NBA_REDIS_KEY = 'NBA';
    const DATA_MAP_KEY = 'data';

    if (sport === 'mlb') {
        const mlbGameData = await redis.hgetall(MLB_REDIS_KEY);

        if (mlbGameData) {
            console.log('cache hit mlb');
            data.set(DATA_MAP_KEY, mlbGameData.data);
        } else {
            console.log('cache miss mlb, refetching');
            const key = MLB_REDIS_KEY;
            // We don't cache the response here, since we're using Redis to cache the data. This will only ever be called if the data is not in Redis, so we want fresh data.
            const mlbGameDataRequest = await fetch(process.env.MLB_DATA_ENDPOINT as string, {cache: 'no-store'});
            const mlbGameData = await mlbGameDataRequest.json();
            await saveToRedis({key, data: mlbGameData});
            data.set(DATA_MAP_KEY, mlbGameData);
        }
    }

    if (sport === 'nba') {
        const nbaGameData = await redis.hgetall(NBA_REDIS_KEY);

        if (nbaGameData) {
            console.log('cache hit nba');
            data.set(DATA_MAP_KEY, nbaGameData.data);
        } else {
            console.log('cache miss nba, refetching');
            const key = NBA_REDIS_KEY;
            // We don't cache the response here, since we're using Redis to cache the data. This will only ever be called if the data is not in Redis, so we want fresh data.
            const nbaGameDataRequest = await fetch(process.env.NBA_DATA_ENDPOINT as string, {cache: 'no-store'});
            const nbaGameData = await nbaGameDataRequest.json();
            await saveToRedis({key, data: nbaGameData});
            data.set(DATA_MAP_KEY, nbaGameData);
        }
    }

    const serializedData = (Object.fromEntries(data)) as BoxScoreData;

    return NextResponse.json(serializedData);
}
