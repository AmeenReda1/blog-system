
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    public readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0', 10),
        });
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<T> {
        const stringValue = JSON.stringify(value);
        await (ttl
            ? this.client.setex(key, ttl, stringValue)
            : this.client.set(key, stringValue));
        return value;
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async del(key: string): Promise<number> {
        return this.client.del(key);
    }
}