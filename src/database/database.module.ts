import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow('POSTGRES_HOST'),
                port: parseInt(configService.getOrThrow('POSTGRES_PORT'), 10),
                username: configService.getOrThrow('POSTGRES_USER'),
                password: configService.getOrThrow('POSTGRES_PASSWORD'),
                database: configService.getOrThrow('POSTGRES_DB'),
                entities: [__dirname + '/../**/*.entity.{js,ts}'],
                synchronize: true,
            }),
        }),
    ],
})
export class DatabaseModule { }
