import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import * as Joi from 'joi';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { config } from 'dotenv';

config();
console.log(process.env.REDIS_HOST)
console.log(process.env.REDIS_PORT)
console.log(process.env.REDIS_DATABASE)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      expandVariables: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      database: process.env.REDIS_DATABASE,
    }),
    DatabaseModule, AuthModule, BlogModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
