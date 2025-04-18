import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import * as Joi from 'joi';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      expandVariables: true,
    }),

    DatabaseModule, AuthModule, BlogModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
