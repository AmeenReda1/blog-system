
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {

    constructor(@InjectRedis() private readonly client: Redis) { }

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